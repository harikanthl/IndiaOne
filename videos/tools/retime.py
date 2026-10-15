#!/usr/bin/env python3
"""Retime a built HyperFrames frame without rebuilding it.

Wraps the frame's registered GSAP timeline in a piecewise-linear time-warp so cues
authored against the OLD voice-over land on the NEW one. Use after re-recording or
slowing narration.

usage:
  python3 retime.py <frame.html> <new_total_s> '<anchors json>'
    anchors: [[old_s, new_s], ...] — a cue word's time in the old take and the new take
             (read both from audio_meta.json words[]). Must increase in both columns.
    new_total_s: new voice duration + pause + the transition overlap the assembler added
             (old file data-duration minus old voice duration; usually 0.4–0.6s).

Idempotent: on an already-warped frame it replaces the anchors / NEW instead of
wrapping twice (anchors are then still relative to the ORIGINAL animation times).
"""
import json, re, sys

f, new_total, anchors = sys.argv[1], float(sys.argv[2]), json.loads(sys.argv[3])
s = open(f).read()
fid = re.search(r'data-composition-id="([^"]+)"', s).group(1)
cur = float(re.search(r'data-composition-id="%s"[^>]*data-duration="([\d.]+)"' % re.escape(fid), s).group(1))

if "var A = [" in s:  # already warped: OLD stays the original animation length
    old = float(re.search(r"OLD = ([\d.]+)", s).group(1))
else:
    old = cur

pts = [(0.0, 0.0)] + [(o, n) for o, n in anchors if 0 < o < old] + [(old, new_total)]
clean = [pts[0]]
for o, n in pts[1:]:
    if o > clean[-1][0] and n > clean[-1][1]:
        clean.append((o, n))
A = json.dumps([[round(o, 3), round(n, 3)] for o, n in clean])

if "var A = [" in s:
    s = re.sub(r"var A = \[.*?\]\];", f"var A = {A};", s, count=1)
    s = re.sub(r"NEW = [\d.]+;", f"NEW = {new_total};", s, count=1)
else:
    wrap = f"""(function (inner) {{
          // Time-warp (videos/tools/retime.py): map new voice cue times onto the original animation.
          var A = {A};
          var OLD = {old}, NEW = {new_total};
          function warp(tn) {{
            for (var i = 1; i < A.length; i++) if (tn <= A[i][1]) {{ var a = A[i - 1], b = A[i]; return a[0] + ((tn - a[1]) * (b[0] - a[0])) / (b[1] - a[1]); }}
            return OLD;
          }}
          var outer = gsap.timeline({{ paused: true }});
          outer.add(inner.tweenFromTo(0, OLD, {{ duration: NEW, ease: function (p) {{ return warp(p * NEW) / OLD; }} }}), 0);
          return outer;
        }})(tl)"""
    s, n = re.subn(r"(window\.__timelines\[[^\]]+\]\s*=\s*)tl;", lambda m: m.group(1) + wrap + ";", s, count=1)
    if n != 1:
        sys.exit("✗ no `window.__timelines[...] = tl;` registration found — wrap by hand")

s = s.replace(f'data-duration="{cur}"', f'data-duration="{new_total}"')
open(f, "w").write(s)
print(f"✓ {fid}: {cur}s → {new_total}s, {len(clean)} anchors")
