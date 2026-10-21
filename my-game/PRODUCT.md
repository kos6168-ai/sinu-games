# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The creator and people they know (friends, family). Games are shared as links and played casually, mostly on phones in the mobile browser, sometimes on desktop. This is a personal project, not a public service.

## Product Purpose

my-game is a collection of small browser mini-games, an arcade the creator keeps adding to. Success means a game opens instantly from a link, is understandable without instructions, and is fun enough to retry for a better score.

## Positioning

Hand-built single-file HTML games with their own illustrated worlds (mostly a Pandora/Na'vi fan world rendered procedurally on canvas), made for sharing with people the creator knows rather than for a store or ads.

## Operating Context

- Each game is one self-contained HTML file opened directly in the browser; no build step, server, or framework.
- Played with touch (tap, swipe) on mobile and keyboard on desktop.
- Best scores persist per device in localStorage (e.g. `pandora-runner-best`).
- Planning notes live as plain text files in the project root (`가상회사_본격적인 게임 기획.txt`).

## Capabilities and Constraints

Current games:
- `index.html`: **Pandora Runner**, a side-scrolling runner with a procedurally drawn Pandora scene (floating mountains, home tree, bioluminescent forest) and a purple Na'vi girl character; attacking giant birds; game over/retry.
- `runner.html`: **Lane Runner**, a 3-lane pseudo-3D endless runner (lane change / jump / slide, coins, best record) starring the pink Na'vi girl, with Pandora background art.
- `brick(1).html`: **여의봉 보석깨기**, a brick-breaker with an ultimate missile and a sound toggle.
- `hangang-canoe.html`: **한강 카누 러너**, a 3-lane canoe runner upstream on the real Seoul Han River, from 여의도 past 16 real bridges (마포대교 → 광진교). Hearts (3) plus an energy bar refilled by snacks (김밥, 컵라면, 치킨; no real brands). Hero: a child in a baby-dinosaur costume, drawn as SVG. Best score key `hangangCanoeBest`.

Haptics (implemented in `hangang-canoe.html` via the Vibration API, with an on/off toggle): light vibration on button press or screen touch; long, strong vibration (2–3 pulses) on collision or energy loss; short patterns for snacks, bridges, and new records. iOS Safari has no Vibration API, so it stays silent there.

Constraints:
- All UI copy is Korean (`lang="ko"`).
- Games must work in mobile browsers at portrait and landscape sizes, with touch input as a first-class control.
- Asset images must load from the relative `index esset/` folder; games fall back gracefully when an image fails to load.

## Brand Commitments

- The Pandora games are a non-commercial fan project based on the film *Avatar* (Pandora, Na'vi). The world stays as-is for personal sharing; it is not to be published commercially or presented as official.
- Recurring characters: 보라빛 나비족 소녀 (purple Na'vi girl), 분홍빛 나비 소녀 (pink Na'vi girl), 붉은 거인의 부유섬 지배자 (red giant ruler of the floating islands).
- 여의봉 보석깨기 uses a separate Journey to the West (여의봉) motif.
- 한강 카누 러너 is set in the real Seoul Han River, not the Pandora world. Its world is "선명한 파스텔 동화" (vivid pastel fairy tale), pinned by the user: a round, cute child in a baby-dinosaur costume with big eyes and lively expressions, and obstacles drawn in the same style.

## Evidence on Hand

- Illustrations in `index esset/`: `보라빛 나비족 소녀.png`, `분홍빛 나비 소녀.png`, `붉은 거인의 부유섬 지배자.png`, `아바타-세게관-판도라.jpg`.
- No player counts, reviews, or testimonials exist; none should be invented.

## Product Principles

1. Instant play: one link, one file, no install, no instructions needed.
2. Touch first: every action must feel good with a thumb on a phone, including haptic feedback where supported.
3. The world is the reward: each game's illustrated setting is part of the fun, not decoration.
4. Retry loop over progression: short rounds, clear game over, one-tap retry, a best score to beat.
5. Stay personal and non-commercial while borrowing a film's world.
