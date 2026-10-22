#!/usr/bin/env python3
# 核对 D01 页脚的实际可见窗口：外壳 Frame 在字幕出现时把页脚 8f 淡出（footerAlpha），
# 本脚本从主工程 subtitles.ts 读出 D01 的 cue 区间，算出本段 880f 内页脚透明度 >0.5 的帧区间。
# 用法：/usr/bin/python3 scripts/页脚让位窗口.py [页脚入场起始帧] [入场时长]
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]  # 05_制作工程
SRC = ROOT / 'remotion-main' / 'src' / 'lib' / 'subtitles.ts'

DUR = 880  # 本段帧数
start = int(sys.argv[1]) if len(sys.argv) > 1 else 300
dur = int(sys.argv[2]) if len(sys.argv) > 2 else 20

cues = []
for m in re.finditer(r"\{start:\s*(\d+),\s*end:\s*(\d+),\s*seg:\s*'D01',\s*text:\s*'([^']*)'\}", SRC.read_text(encoding='utf-8')):
    cues.append((int(m.group(1)), int(m.group(2)), m.group(3)))
cues.sort()


def alpha(gf: int) -> float:
    for s, e, _ in cues:
        if s <= gf < e:
            return max(0.0, 1 - (gf - s) / 8)
    prev = [e for _, e, _ in cues if e <= gf]
    if prev and gf - max(prev) < 8:
        return min(1.0, (gf - max(prev)) / 8)
    return 1.0


print(f'D01 cue 条数={len(cues)} 覆盖={cues[0][0]}–{max(e for _, e, _ in cues)}（连续无空档＝'
      f'{all(cues[i][1] == cues[i + 1][0] for i in range(len(cues) - 1))}）')

vis = [f for f in range(DUR) if alpha(f) > 0.5]
runs, s = [], None
for f in range(DUR + 1):
    on = f < DUR and alpha(f) > 0.5
    if on and s is None:
        s = f
    elif not on and s is not None:
        runs.append((s, f - 1))
        s = None
print('页脚透明度>0.5 的帧区间:', runs, '合计', len(vis), 'f')

foot_in = list(range(start, start + dur))
lit = [f for f in foot_in if alpha(f) > 0.5]
print(f'页脚入场窗 {start}–{start + dur}：可见 {len(lit)}/{dur} f')
for f in (start, start + dur // 2, start + dur, 822, 856, 879):
    if f < DUR:
        print(f'  f{f}: 页脚 alpha={alpha(f):.3f}')
