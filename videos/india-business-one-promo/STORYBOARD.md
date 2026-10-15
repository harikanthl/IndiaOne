---
format: 1920x1080
duration: 45s
message: "Every licence, every fee, every desk your file sits on, in one place, for free."
arc: PAS — hook → pain → product intro → feature showcase ×4 → CTA
audience: Small business owners and first-time shopkeepers in India (Telangana pilot), plus civic-tech contributors
mode: autonomous
music: warm hopeful Indian underscore, light tabla and plucked strings, builds gently, confident not corporate
---

## Video direction

- **Palette (frame.md roles):** `paper` parchment is the ground for the problem and demo frames; `ink` neel indigo carries all type and UI framing; `sun` marigold is the single accent (highlights, the counter, the CTA pill); `ember` red only for the stall/bribe moments (Frame 2's "6 days over", Frame 7's "asked for money"); `paper-deep`/`haze` for card surfaces. Frame 3 alone lives in the jungle-glow world (dark), the product's own splash. No other hues.
- **Type:** display role for headlines and numerals (Anek Latin 400, tight), micro-label uppercase for kickers, mono for every day count and rupee figure.
- **Motion grammar:** long-tail `power3` settles everywhere; no bounce. Every frame reveals on its spoken cue (VO-paced); at t=0 only what the VO is saying is on screen. Screenshots are shown as floating cards (soft shadow, rounded) on the parchment ground, never full-bleed browser chrome; a single **zoom-to-target** (`coordinate-target-zoom`) per demo frame lands the key detail. Holds are still; subtle jitter (`sine-wave-loop`, low amplitude) at most.
- **Rhythm:** Frames 1–2 quick and tense (word swaps, ticking counter); Frame 3 is the breath and the spectacle; Frames 4–6 brisk demo cadence; Frame 7 slows to a calm title card (the held breather before the close); Frame 8 a still, confident lockup.
- **Negative list:** no slideshow (front-load then freeze), no screensaver (many things drifting independently), no lazy breathing, no slow back-half pan/push, no `repeat`/`yoyo`, no random particles, no national emblem, flag or tricolour, no stock icons standing in for the real screens, nothing in the bottom ~17% caption band.

## Frame 1 — One licence. Then another.

- scene: Kinetic type on parchment: "One licence." → "Then another." → "Then a fee nobody wrote down." with a Kalighat clerk painting watching from the corner
- voiceover: "When I opened my bakery, it was one licence… then another… then a fee nobody had written down anywhere."
- duration: 7.201s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Pain validation
- beat: frustration + recognition
- blueprint: kinetic-type-beats
- asset_candidates: assets/kalighat-babu-clerk-with-hookah.jpg — Kalighat painting of a babu clerk, the gatekeeper

- focal: assets/kalighat-babu-clerk-with-hookah.jpg
- roles: kalighat-babu-clerk-with-hookah = supporting (cutout-style card, right third)
- sfx: soft tick on each word swap

Adapt: keep the in-place token swap signature; the swapping slot is the obstacle, and the clerk painting is the silent witness.
Scene 1 (0.0–1.3s): parchment ground; micro-label kicker "OPENING A SHOP?" enters top-left via per-word staggered reveal (`dynamic-content-sequencing`). Left 60/40 editorial, type in the left 60%.
Scene 2 (1.3–3.0s): on "One licence." the display line lands; on "Then another." the noun slot hard-cut swaps (`discrete-text-sequence`) and a second ghosted line stacks beneath. The clerk painting card slides up into the right third as a supporting witness (power3), depth layer 2.
Scene 3 (3.0–4.7s): on "a fee nobody wrote down" the last line lands and a marigold underline sweeps left to right under "nobody wrote down" (a scaleX wipe); hold still.

narrativeRole: name the everyday maze every new shopkeeper knows, in their words.
keyMessage: getting permission to open a shop is opaque.

## Frame 2 — Day twenty-one

- scene: A day counter ticks from Day 1 to Day 21 over the stalled Trade licence card; a red "6 days over" stamp lands; the line "Then someone asks for money." in ember red
- voiceover: "My file just sat on someone's desk. Day ten. Day twenty-one. Then a man asked me for money."
- duration: 6.377s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-pain.html
- type: pain_point
- persuasion: Pain agitation
- beat: anxiety → urgency
- blueprint: dataviz-countup
- asset_candidates: assets/track.png — Trade licence stalled at field verification, Day 21 of a 15-day timeline, 6 days over

- focal: assets/track.png
- roles: track = supporting (floating card, cropped to the stalled Trade licence)
- sfx: clock ticks under the count, stamp thud on "6 days over"

Adapt: keep the push-THROUGH signature from dataviz-countup (Problem mode); one instrument: the day counter.
Scene 1 (0.0–1.5s): the stalled Trade licence card (crop of track.png) floats centre-right on parchment; "Your file sits on a desk." types in left in display-sm.
Scene 2 (1.5–3.3s): a huge mono day counter counts DAY 1 → 21 (`counting-dynamic-scale`) on the VO's "Day ten. Day twenty-one", its size growing with the count; a slow continuous push-in under it (`multi-phase-camera`).
Scene 3 (3.3–5.5s): the camera pushes THROUGH the "21" into the card; an ember stamp "6 DAYS OVER" thuds onto the card (spring-pop restrained, `spring-pop-entrance`) and on "someone asks for money" that phrase lands in ember red beneath; hold.

narrativeRole: escalate from confusion to the real cost: delay and the bribe ask.
keyMessage: the delay is where the bribe lives.

## Frame 3 — Meet India Business One

- scene: The splash world assembles: jungle glow, lotus bushes rise from the corners, the seal's paisley ring spins into place around the lotus, the peacock crosses right to left, the tiger settles lower right, the wordmark lands
- voiceover: "That's why we made India Business One. Every licence, every fee, every desk your file sits on."
- duration: 6.747s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/03-intro.html
- type: product_intro
- persuasion: Negative contrast (opacity → clarity)
- beat: relief + curiosity
- blueprint: logo-assemble-lockup
- asset_candidates: assets/seal-ring.webp — seal paisley ring (rotates); assets/seal-core.webp — seal lotus centre; assets/tiger.webp — seated tiger, faces left; assets/peacock.webp — peacock in flight, faces left; assets/bush-left.webp — lotus and banana bush; assets/bush-right.webp — banana and lotus bush; assets/jungle-glow.webp — dark jungle bokeh backdrop

- focal: assets/seal-core.webp
- roles: jungle-glow = background (full-bleed, dim ~60%); seal-ring + seal-core = cutout (centre hero); bush-left / bush-right = supporting (corner framing); tiger = supporting (lower right); peacock = supporting (crosses upper third)
- sfx: soft whoosh as the ring spins in, gentle chime on the wordmark

Adapt: logo-assemble-lockup Product_Intro parts-assembly; keep the signature of the mark coming to exist from parts (ring spins in around the static lotus core), then the lockup holds while the tagline steps through.
Scene 1 (0.0–1.1s): the zoom-through lands into darkness; jungle glow fades up; the two bushes rise from the bottom corners (power3).
Scene 2 (1.1–2.6s): on "Meet India Business One" the lotus core scales up from 0.9 and the paisley ring spins in from −120° to rest around it (`svg-path-draw`-style assembly via rotation); the wordmark "India Business One" (One in marigold) reveals beneath per word. Centered, ~45% of frame.
Scene 3 (2.6–5.7s): the peacock crosses right→left across the upper third once; the tiger settles in lower right; the tagline steps through its three fragments as the VO says them — "Every licence," "every fee," "every desk your file sits on." (swap-in-place, `discrete-text-sequence`); the ring keeps a slow finite turn; hold.

narrativeRole: land the promise (message) by beat 3, in the product's own world.
keyMessage: one place shows all of it.

## Frame 4 — Start with your address

- scene: The landing hero: the address types into the file cover, the sheet resolves State → District → Corporation → Zone → Ward one row at a time; then a push into the ward map with Ward 104 highlighted
- voiceover: "You type in your shop's address, and it tells you your corporation, your zone, your ward."
- duration: 6.009s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-address.html
- type: feature_showcase
- persuasion: Friction reduction
- beat: ease
- blueprint: device-surface-showcase
- asset_candidates: assets/home.png — landing hero with the address sheet resolving the jurisdiction; assets/start.png — ward map with Ward 104 Madhapur highlighted

- focal: assets/home.png
- roles: home = supporting (floating card, the address sheet region); start = supporting (second card, the ward map)
- sfx: soft keyboard taps on the typing, small click per resolved row

Adapt: device-surface-showcase cursorless stepwise-flow; keep the signature of the feature experienced inside its real surface, stepping through screens.
Scene 1 (0.0–1.1s): home.png card enters centred, then a zoom-to-target onto the address sheet (`coordinate-target-zoom`); a caret types "Plot 14, Road No. 36, Madhapur, Hyderabad" into the field on "Type your address".
Scene 2 (1.1–3.0s): on "It finds your exact corporation, zone and ward" the five rows (State, District, Corporation, Zone, Ward) light one by one top to bottom with a marigold keyword glow on Corporation / Zone / Ward as each is spoken (`asr-keyword-glow`).
Scene 3 (3.0–4.6s): scale-swap (`scale-swap-transition`) to the start.png ward map card; Ward 104 Madhapur glows marigold; hold.

narrativeRole: show the first step is as simple as typing where you are.
keyMessage: no guessing which office is yours.

## Frame 5 — Every licence, with its fee

- scene: The permit plan for Sri Lakshmi Bakery; licence rows slide in one by one, each fee lighting as it is named, the official total counts up to ₹6,700
- voiceover: "Then every licence you need, what it really costs, and the rule that says so."
- duration: 6.093s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-plan.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: clarity + control
- blueprint: video-text-pivot
- asset_candidates: assets/plan.png — permit plan, 6 approvals with official fees, total ₹6,700

- focal: assets/plan.png
- roles: plan = supporting (floating card, licence list region)
- sfx: soft tick per row, a warm chime when the total lands

Adapt: video-text-pivot; keep the signature yield — the surface slides aside into the space the hero stat fills.
Scene 1 (0.0–1.2s): plan.png card centred, zoomed onto the licence list; on "Every licence you need" the rows (Trade licence, FSSAI, Shops & Establishments, GST) reveal one by one with a short stagger.
Scene 2 (1.2–2.4s): on "The official fee" each row's fee (₹1,000 · ₹100 · ₹500 · no fee) gets a marigold highlight sweep (`css-marker-patterns`) in sequence.
Scene 3 (2.4–4.0s): on "And the law behind it" the card slides aside left and scales down while a hero mono stat "₹6,700" counts up on the right with the micro-label "OFFICIAL FEES, IN TOTAL" (`counting-dynamic-scale`); beneath it a small line "each with its order and section"; hold.

narrativeRole: replace the hidden fee with a written one.
keyMessage: you know the real price before you go.

## Frame 6 — Which desk has your file

- scene: The file tracker: progress dots fill to Field verification, the stall flag pulses, then the escalation ladder steps in (Day 16 reminder, Day 22 Zonal Commissioner, Day 30 grievance portal, Day 45 RTI)
- voiceover: "You can see whose desk your file is on, and what to do if it gets stuck."
- duration: 5.355s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-track.html
- type: feature_showcase
- persuasion: Risk reversal
- beat: control
- blueprint: device-surface-showcase
- asset_candidates: assets/track.png — file tracker with stall and escalation ladder

- focal: assets/track.png
- roles: track = supporting (floating card, progress + escalation ladder)
- sfx: soft step tick per ladder rung

Adapt: device-surface-showcase static tour with one zoom-to-target; keep the feature-inside-its-surface signature.
Scene 1 (0.0–1.5s): track.png card centred on the Trade licence progress row; on "See which desk holds your file" the progress dots fill left to right to Field verification, which glows ember (`stat-bars-and-fills`).
Scene 2 (1.5–4.1s): on "exactly what to do when it stalls" zoom-to-target down to the escalation ladder; its four rungs (Day 16 reminder, Day 22 Zonal Commissioner, Day 30 grievance portal, Day 45 RTI) light sequentially with marigold markers; hold on the full ladder.

narrativeRole: turn the stalled desk from Frame 2 into a next step.
keyMessage: a stall now has an answer.

## Frame 7 — Report it privately

- scene: The report form: "Asked for money" chip selects, ₹5,000 types in, then a calm title card: "Only the official fee. Nothing to buy. You choose when it's sent."
- voiceover: "And if someone asks you for a bribe, you note it down quietly, and report it when you're ready."
- duration: 5.639s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-report.html
- type: benefit_highlight
- persuasion: Feature-to-benefit translation
- beat: peace of mind
- blueprint: titlecard-reveal
- asset_candidates: assets/report.png — private bribe report form with Kalighat painting

- focal: assets/report.png
- roles: report = supporting (floating card, form region)
- sfx: one soft press on the chip, then near-silence

Adapt: titlecard-reveal with a short surface prelude; keep the signature calm two-line title held still.
Scene 1 (0.0–2.0s): report.png card centred; on "Asked for a bribe?" the "Asked for money" chip presses (`press-release-spring`, restrained) and turns ember; "₹5,000" types into the amount field.
Scene 2 (2.0–5.0s): on "Record it privately" the card blurs back and dims; a calm two-line title slides up and holds: "Only the official fee. Nothing to buy." / "You decide when it's sent." with "You decide" in marigold. Held breather.

narrativeRole: close the loop on the bribe from Frame 2.
keyMessage: you are not alone with it.

## Frame 8 — Free, and built in the open

- scene: Parchment ground; the seal's ring turns as the lockup draws on: seal + "India Business One", then "Free. Open source. Telangana pilot." and the GitHub URL types under it
- voiceover: "It's free, it's open source… come build it with us."
- duration: 5.821s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/08-cta.html
- type: cta
- persuasion: Risk reversal + belonging
- beat: confidence + motivation
- blueprint: logo-assemble-lockup
- asset_candidates: assets/seal-ring.webp — seal paisley ring; assets/seal-core.webp — seal lotus centre

- focal: assets/seal-core.webp
- roles: seal-ring + seal-core = cutout (the mark); no background asset (parchment ground)
- sfx: soft chime on the lockup

Adapt: logo-assemble-lockup Brand_Outro variant; keep the signature mark coming to exist then completing the lockup.
Scene 1 (0.0–1.4s): parchment; the lotus core blooms in and the ring turns into place around it (centre, ~30% of frame); on "India Business One" the wordmark reveals beside it to complete the lockup.
Scene 2 (1.4–3.2s): on "Free, open source" the line "Free · Open source · Telangana pilot" steps in beneath as three micro-label tokens.
Scene 3 (3.2–4.4s): on "built in the open" the URL "github.com/harikanthl/IndiaOne" types in mono inside a marigold pill; the whole lockup holds still, then the final frame fades to parchment.

narrativeRole: leave the brand and the invitation.
keyMessage: it's free, and it's yours to help build.
