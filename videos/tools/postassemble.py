#!/usr/bin/env python3
"""Fix-ups to run on index.html after EVERY assemble-index.mjs (it overwrites them).

  python3 postassemble.py <project_dir>

1. tags each narration <audio id="el-NN-*-voice"> with data-audio-group="voiceover" (needed by carve.mjs)
2. marks the caption div data-track-kind="captions" (lint warning otherwise)
3. clamps any SFX clip that runs past the root duration (lint warning otherwise)

Then run:  node ~/.claude/skills/hyperframes-audio/scripts/carve.mjs --comp ./index.html
"""
import re, sys, os

p = os.path.join(sys.argv[1] if len(sys.argv) > 1 else ".", "index.html")
s = open(p).read()
s, nv = re.subn(r'(?<!data-audio-group="voiceover" )id="(el-\d\d-[a-z0-9-]+-voice)"', r'data-audio-group="voiceover" id="\1"', s)
if 'data-track-kind="captions"' not in s:
    s = re.sub(r'(<div\s+)(id="el-captions")', r'\1data-track-kind="captions" \2', s, count=1)
root = float(re.search(r'data-duration="([\d.]+)"', s).group(1))


def clamp(m):
    tag = m.group(0)
    st = float(re.search(r'data-start="([\d.]+)"', tag).group(1))
    d = float(re.search(r'data-duration="([\d.]+)"', tag).group(1))
    return re.sub(r'data-duration="[\d.]+"', f'data-duration="{root - st:.3f}"', tag) if st + d > root + 1e-3 else tag


s = re.sub(r'<audio[^>]*id="el-sfx-\d+"[^>]*>', clamp, s, flags=re.S)
open(p, "w").write(s)
print(f"✓ postassemble: {nv} voice clip(s) grouped, captions marked, SFX clamped to {root}s")
