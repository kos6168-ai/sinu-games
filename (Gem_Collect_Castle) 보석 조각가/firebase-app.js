// 보석수집가(Gem Collect Castle) Firebase 모듈 — Firebase 프로젝트 gem-collect-castle 전용
// (2026-11-05 옛 프로젝트 gem-tetris-castle에서 옮김)
// 서버는 최소한으로(CLAUDE.md): SDK는 필요한 순간에만 불러오고, Firestore는 인증과 따로 더 늦게 불러온다.

// Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹) "Gem Collect Castle"의 SDK 설정 값
export const firebaseConfig = {
  apiKey: 'AIzaSyBSqKBdva9R_oq7pue-7ej9Irq180DRyxg',
  authDomain: 'gem-collect-castle.firebaseapp.com',
  projectId: 'gem-collect-castle',
  storageBucket: 'gem-collect-castle.firebasestorage.app',
  messagingSenderId: '43990333571',
  appId: '1:43990333571:web:714b732aa273834f57c3b6',
  measurementId: 'G-JBGXZ9NTMH',
  // Realtime Database(대결 모드 대기방·대전 동기화, 2026-11-05 만듦, 싱가포르)
  databaseURL: 'https://gem-collect-castle-default-rtdb.asia-southeast1.firebasedatabase.app',
};
const FB = 'https://www.gstatic.com/firebasejs/10.14.1/';

let appP = null;
let authP = null;
let storeP = null;

// 앱 초기화는 한 번만 — 인증과 애널리틱스가 같이 쓴다
function loadApp() {
  return appP || (appP = import(FB + 'firebase-app.js')
    .then(m => m.initializeApp(firebaseConfig))
    .catch(e => { appP = null; throw e; }));
}

// 인증: { ...firebase-auth 함수들, app, auth, provider }
export function loadAuth() {
  return authP || (authP = (async () => {
    const [app, authMod] = await Promise.all([loadApp(), import(FB + 'firebase-auth.js')]);
    const auth = authMod.getAuth(app);
    auth.languageCode = 'ko';
    return { ...authMod, app, auth, provider: new authMod.GoogleAuthProvider() };
  })().catch(e => { authP = null; throw e; }));
}

// ------------------------------ 구글 로그인 · 가입(2026-11-10) ------------------------------
// 약관 버전: 글이 바뀌면 날짜를 올린다 → 다음 로그인 때 다시 동의를 받는다
export const TERMS_VERSION = '2026-11-10';
const CONSENT_KEY = 'gtcConsent';
// 약관 동의는 가입할 때 서버(RTDB users/{uid})에 한 번 쓰고, 이 기기에도 남겨서 다시 읽지 않는다(서버 최소)
const consentMark = uid => `${uid}:${TERMS_VERSION}`;
export const hasLocalConsent = uid => { try { return localStorage.getItem(CONSENT_KEY) === consentMark(uid); } catch (e) { return false; } };
export const saveLocalConsent = uid => { try { localStorage.setItem(CONSENT_KEY, consentMark(uid)); } catch (e) {} };
export const clearLocalConsent = () => { try { localStorage.removeItem(CONSENT_KEY); } catch (e) {} };
export const hasAnyLocalConsent = () => { try { return !!localStorage.getItem(CONSENT_KEY); } catch (e) { return false; } };

// 대결 모드에 들어갈 때 쓰는 계정: 2026-11-10부터 대결 모드는 가입(구글 로그인) 유저만이라 보통은 그 계정이 돌아온다.
// 로그인이 없으면(옛 기기 호환) 익명 로그인으로 — 게임 쪽 게이트가 먼저 막으므로 거의 쓰이지 않는다
export async function signInGuest() {
  const fb = await loadAuth();
  await fb.auth.authStateReady();
  if (fb.auth.currentUser) return fb.auth.currentUser;
  return (await fb.signInAnonymously(fb.auth)).user;
}

// Realtime Database: { ...firebase-database 함수들, db } — 대결 모드(대기방·대전)에 들어갈 때만 불러온다
let rtdbP = null;
export function getRtdb() {
  return rtdbP || (rtdbP = Promise.all([loadApp(), import(FB + 'firebase-database.js')])
    .then(([app, m]) => ({ ...m, db: m.getDatabase(app) }))
    .catch(e => { rtdbP = null; throw e; }));
}

// Firestore: { ...firebase-firestore 함수들, db } — 가입·탈퇴·랭킹 때만 불러온다
export function getStore() {
  return storeP || (storeP = loadAuth()
    .then(fb => import(FB + 'firebase-firestore.js').then(m => ({ ...m, db: m.getFirestore(fb.app) })))
    .catch(e => { storeP = null; throw e; }));
}

// ------------------------------ 구글 애널리틱스 ------------------------------
// 첫 화면과 게임 시작을 막지 않도록, 페이지가 다 뜬 뒤 브라우저가 한가할 때 불러온다.
// 광고 차단 등으로 실패해도 조용히 꺼지고 게임은 그대로 돈다.
let gaState = 'idle'; // idle → loading → on | off
let gaLog = null;
const gaQueue = [];

// 게임 시작 시 한 번 부른다
export function startAnalytics() {
  if (gaState !== 'idle') return;
  gaState = 'loading';
  const run = () => Promise.all([loadApp(), import(FB + 'firebase-analytics.js')])
    .then(async ([app, m]) => {
      if (!(await m.isSupported())) throw new Error('analytics unsupported');
      const ga = m.getAnalytics(app);
      gaLog = (name, params) => m.logEvent(ga, name, params);
      gaState = 'on';
      gaQueue.splice(0).forEach(([name, params]) => gaLog(name, params));
    })
    .catch(() => { gaState = 'off'; gaQueue.length = 0; });
  const idle = () => (window.requestIdleCallback ? requestIdleCallback(run, { timeout: 5000 }) : setTimeout(run, 2000));
  if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
}

// 이벤트 기록. 애널리틱스가 뜨기 전 이벤트는 최대 50개까지 모아 뒀다가 보낸다.
export function track(name, params) {
  if (gaState === 'on') gaLog(name, params);
  else if (gaState !== 'off' && gaQueue.length < 50) gaQueue.push([name, params]);
}
