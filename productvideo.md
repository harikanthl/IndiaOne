# Product videos — playbook for agents

How to make a product/promo video for this project (or any web app on this machine) with
HyperFrames, cheaply and without repeating the mistakes of the first run
(`videos/india-business-one-promo/`, Oct 2026: 8 frames, 49s, rendered v1→v3).

**Read this file instead of re-reading the whole HyperFrames skill tree.** The workflow is
`/product-launch-video`; this file is its streamlined, machine-specific version. Open the skill
references only when something here doesn't cover the case.

---

## 0. Budget rules (the first run cost ~10% of a session window — most of it avoidable)

| Cost driver | Rule |
|---|---|
| Frame workers (~100k tokens each) | **5–6 frames, not 8.** Merge adjacent demo beats. If more beats are needed, give one worker 2 frames from a single read of `_role.md`. |
| Workers hunting for missing things | Stage **fonts, screenshots, measured crop boxes** before dispatch and put them in the dispatch context (template in §5). |
| Reading skill references | Use §3's command list. Only read `visual-design.md` / `motion-language.md` if writing shot sequences from scratch. |
| Review | One contact sheet per pass, at cue points only (`snapshot --at …`). Don't re-snapshot unchanged frames. |
| Narration rewrites | Never rebuild frames for a new script — **retime** them (§6). |
| Questions | Ask the 4 brief questions in ONE `AskUserQuestion` call (§2). |

---

## 1. Machine prerequisites (already set up — just verify)

- `npx hyperframes` (pinned per project; first run used 0.8.159). Freshness: `npx hyperframes skills update product-launch-video` (background it — it can take >2 min) — `init` also refreshes skills.
- **HeyGen signed in** (`npx hyperframes auth status`; exits 1 when signed out — that's not an error). Voice + music come from HeyGen. Local Kokoro / MusicGen are **not installed**.
- `ffmpeg` (Homebrew) — trims, `atempo`, loudness checks. Rendering is local: headless Chrome + ffmpeg, GPU encode (~45s for a 49s 1080p video).
- **Python:** use `/usr/bin/python3` for Pillow work. Homebrew's `python3` got upgraded when `fonttools` was installed and has **no Pillow**; Homebrew Python also refuses `pip install` (PEP 668) — install CLI tools with `brew install …`.
- `fonttools` via Homebrew (`fonttools`, `ttx`, `pyftsubset`) — check glyph coverage (e.g. ₹ U+20B9) before trusting a font.
- Chrome extension is often **not connected** — don't depend on it. Screenshots come from `videos/tools/shoot.mjs` (headless Chrome over CDP).

## 2. Intake (one question round)

Ask in a single `AskUserQuestion`: **sell vs show** · **length + destination** (default 45s 16:9) ·
**storyboard review yes/no** · **automation vs companion**. Write `BRIEF.md` right after `init`
(format: `~/.claude/skills/hyperframes/references/brief-format.md`). Record prefs one key per call:

```bash
P=~/.claude/skills/media-use/scripts/prefs.mjs
node $P record --hyperframes . --key aspect --value 1920x1080   # zsh: don't loop with `set -- $kv`, it doesn't word-split
```

**Narration voice (user feedback, important):** write it as **one real person telling what happened to
them** — first person, plain, specific ("When I opened my bakery, it was one licence… then another…").
**Not slogans** ("Every licence. The official fee. And the law behind it." read as AI). Use the
HeyGen voice **Lucian — Conversational & Easygoing** (`049413e41c334753984c294d694afb5c`); announcer
voices sound like ads. There is no Indian-English voice in the HeyGen library (Oct 2026).
Pacing the user liked: voice slowed to 0.92× + 0.5s pause after each line + ~2s hold on the CTA.

## 3. Pipeline — exact commands

```bash
cd ~/Projects/IndiaOne
npx hyperframes init "videos/<name>" --non-interactive --example=blank --skill=product-launch-video
cd videos/<name>            # every command below runs here
SK=~/.claude/skills/product-launch-video/scripts
```

**Capture** (dev server must be running: `cd apps/web && npm run dev`):

```bash
npx hyperframes capture "http://localhost:3000/?splash=0" -o ./capture --json > capture.log 2>&1
```

- `?splash=0` skips the first-visit splash (otherwise the capture is just the splash).
- `devIndicators: false` is set in `apps/web/next.config.ts` so the Next.js "N" badge isn't in shots.
- The capture's asset catalogue for this app is thin (SVGs only). **Add real page screenshots yourself**
  and put every file **flat in `capture/assets/`** — `stage-assets.mjs` does not search subfolders:

```bash
T=../tools/shoot.mjs; O=capture/assets
URL="http://localhost:3000/" node $T light 1920 1080 $O/splash.png 1 2600
for p in "" start plan track offices report; do URL="http://localhost:3000/$p?splash=0" node $T light 1920 1080 $O/${p:-home}.png 1 3500; done
cp ../../apps/web/public/brand/seal*.webp ../../apps/web/public/mascot/*.webp $O/
```

Then append one line per added file to `capture/extracted/asset-descriptions.md` (`- name.png — what it shows`).
Measure crop boxes now (content bbox with Pillow) and keep them for the dispatch context.

**Design:** `node $SK/build-frame.mjs --preset biennale-yellow --hyperframes .` then **hand-fix `frame.md` colors** —
the auto-mapper picks up the site's dark-theme tokens. Use the light theme + splash palette:

```yaml
paper: "#F6F2E9"  paper-deep: "#E6D3A8"  sun: "#F2B33D"  sun-soft: "#F8D58F"
haze: "#D9C18C"   ink: "#1B2A57"         ember: "#B3261E"
```

Replace `__nextjs-Geist Mono` with `JetBrains Mono`. **Fonts:** copy the reference set into the project before dispatch:

```bash
mkdir -p assets/fonts && cp ../india-business-one-promo/assets/fonts/*.woff2 assets/fonts/
# AnekLatin-Variable.woff2 (the site's own file, has ₹, wdth+wght axes), JetBrainsMono-Regular.woff2 (full upstream, has ₹)
```

**Story → audio → frames → finish:**

```bash
# write STORYBOARD.md + SCRIPT.md (formats: hyperframes/references/storyboard-format.md, script-format.md)
node $SK/audio.mjs --script ./SCRIPT.md --storyboard ./STORYBOARD.md --hyperframes . --out ./audio_meta.json \
  --provider heygen --voice 049413e41c334753984c294d694afb5c          # background it
node $SK/stage-assets.mjs --storyboard ./STORYBOARD.md --hyperframes .
node $SK/audio.mjs sync-durations --audio-meta ./audio_meta.json --storyboard ./STORYBOARD.md
node $SK/audio.mjs fetch-sfx --storyboard ./STORYBOARD.md --hyperframes .
```

- After `sync-durations`, **rescale every `Scene n (a–b s)` window** in the storyboard to the synced duration (the draft windows assume the old length).
- **Music:** HeyGen tracks often open quietly. Check 5s windows (`ffmpeg -ss N -t 5 -i track.mp3 -af volumedetect -f null /dev/null`), keep the original as `track.orig.mp3`, trim to a loud section with a 0.6s fade-in, and make sure the trimmed length ≥ the video length.
- `node $SK/frame-packets.mjs --project "$PWD" --storyboard "$PWD/STORYBOARD.md"` — packets cap at 48 KB; if one fails, drop a heavy cited rule (e.g. replace `css-marker-patterns` with a plain "scaleX underline wipe").
- Dispatch workers (§5). When all are back, **normalize fonts** if any worker invented paths: every `url(...woff2)` must point at the two files above.

```bash
sed -i '' 's/^- status: outline/- status: animated/' STORYBOARD.md
node $SK/captions.mjs build --storyboard ./STORYBOARD.md --audio-meta ./audio_meta.json --hyperframes . --out ./caption_groups.json
node $SK/assemble-index.mjs --storyboard ./STORYBOARD.md --hyperframes .
node $SK/transitions.mjs inject --storyboard ./STORYBOARD.md --hyperframes .
node $SK/transitions.mjs verify --storyboard ./STORYBOARD.md --index ./index.html
/usr/bin/python3 ../tools/postassemble.py .            # redo after EVERY assemble
npm ls @hyperframes/core >/dev/null 2>&1 || npm i -D @hyperframes/core
node ~/.claude/skills/hyperframes-audio/scripts/carve.mjs --comp ./index.html
npx hyperframes lint && npx hyperframes check
npx hyperframes snapshot --at <cue points>             # one contact sheet, inspect it
npx hyperframes preview --background                    # Studio at localhost:3002
npx hyperframes render --skill=product-launch-video --quality high --output renders/video-vN.mp4
```

Keep backups (`index.v1.html` etc.) **out of the project root** (`.hyperframes/…bak`) — a second root HTML with
`data-composition-id` is a lint error (duplicate audio).

## 4. House visual style (tell workers; it's what the user signed off)

- Parchment ground, neel-indigo ink, marigold accent, ember only for stall/bribe moments.
- **Screenshots are floating cards with rounded corners (22–28px), a soft two-layer shadow**
  (`0 2px 4px rgba(27,42,87,.06), 0 28px 60px -24px rgba(27,42,87,.35)`), faint border — never sharp boxes.
- **Never crop through content.** Fit the measured content bbox + ≥24px margin inside the card. Camera zoom on a
  screenshot ≤ ~1.25× unless the card is clipped to the target region (`clip-path: inset(... round 14px)` during the zoom).
- Splash world (jungle glow, bushes, peacock flying **right→left** — it faces left, tiger lower right, seal with only
  the paisley **ring** rotating) is the brand's "hero world"; the seal flies/locks up at the end.
- No national emblem, flag or tricolour. Not affiliated with government — never imply official status.

## 5. Worker dispatch template (one `Agent` per frame, all in one message)

```
You are a HyperFrames frame worker. Read in full and follow:
1. <PROJECT_DIR>/.hyperframes/frame-packets/_role.md
2. <PROJECT_DIR>/.hyperframes/frame-packets/<frame_id>.md
3. <PROJECT_DIR>/frame.md

## Dispatch context
- PROJECT_DIR: <abs path> · frame_id: <id> · Confirmed sketch: no · Canvas: 1920×1080
- Captions: enabled — keep all content above y ≤ 900px
- Fonts (already staged, use exactly these): assets/fonts/AnekLatin-Variable.woff2 (font-weight 100 900, font-stretch 75% 125%),
  assets/fonts/JetBrainsMono-Regular.woff2. Both include ₹.
- Prefix ids/classes with a letter (e.g. f04-) — ids starting with a digit trip lint.
- Screenshot <file>: 1920×1080; content bbox x<a>–<b>, y<c>–<d>; <regions you'll zoom to>. Use real figures from it.
- Cards: rounded 22–28px + soft shadow; never crop through content; zoom ≤ 1.25×.
- Time reveals to the word timings in audio_meta.json (voices[].words), not the packet's rough windows.
- Python with Pillow: /usr/bin/python3.
Write only compositions/frames/<frame_id>.html. Never edit STORYBOARD.md. Run `npx hyperframes lint`, fix your errors,
reply in 3 lines (built / deviations / lint).
```

## 6. Revisions without rebuilding

**New script / different voice:** regenerate audio, then retime each frame onto the new word timings:

```bash
cp audio_meta.json audio_meta.v1.json   # BEFORE regenerating — you need the old word times
# re-run audio.mjs …; then per frame, anchors = [[old_word_time, new_word_time], …] for its cue words:
/usr/bin/python3 ../tools/retime.py compositions/frames/02-pain.html <new_voice+pause+overlap> '[[1.96,2.18],[3.03,3.24]]'
```

`new_total` = new voice duration + pause + the transition overlap the assembler added (old file `data-duration` −
old voice duration, ~0.4–0.6s; the last frame has none). Also update the storyboard `- duration:` lines to voice + pause,
rebuild captions, reassemble, `postassemble.py`, carve. Change any on-screen words that quoted the old script.
Audio regeneration **re-downloads the music** — re-trim it.

**Slow down / speed up:** `ffmpeg -i voice-orig/NN.wav -af atempo=0.92 voice/NN.wav` for each line (keep originals in
`assets/voice-orig/`), scale `audio_meta.json` word times + `duration_s` by 1/0.92, multiply each frame's warp
anchors' new column by the same factor (`retime.py` again), add the pause, re-trim the music to cover the new length.

**Fix one frame:** edit `compositions/frames/NN-*.html` directly (it's plain HTML + one GSAP timeline), snapshot
only that frame's cue points, re-render.

## 7. Known traps (each cost a round trip in run 1)

1. Splash blocks capture → `?splash=0`.
2. Next.js dev badge in screenshots → `devIndicators: false` (done).
3. `stage-assets.mjs` only searches `capture/assets`, `capture/assets/{videos,svgs}`, `capture/screenshots` — flat files only.
4. `build-frame.mjs` maps dark-theme tokens → hand-set the palette.
5. No fonts staged → workers each invent paths and fall back to generic sans. Stage first (§3).
6. Fontsource "latin" subsets **lack ₹**; the site's own Anek Latin file and upstream JetBrains Mono have it.
7. Frame-1 packet >48 KB → drop a heavy rule citation.
8. `sync-durations` changes lengths → rescale Scene windows.
9. Root-level backup HTML → `multiple_root_compositions` lint error.
10. `postassemble.py` + carve must be redone after every reassembly.
11. Last-frame CTA must hold ≥2s after the URL finishes, or it's unreadable.
12. Camera zooms on screenshots sliced content at the card edge (frames 4, 6) — clip to the region or zoom less.
13. Brand assets must face the way they move (peacock/tiger face left).
