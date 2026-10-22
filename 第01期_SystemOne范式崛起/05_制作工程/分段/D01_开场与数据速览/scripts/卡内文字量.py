#!/usr/bin/env python3
# 量数据卡内「数值＋单位」行的字形团块（x 范围／高度），用于核对 lib DataCard 与已确认设计图的取值差异。
# 输入＝ffmpeg 转出的 rgb24 PPM。用法：/usr/bin/python3 scripts/卡内文字量.py <预览.ppm> <参考.ppm> <卡左x> <卡右x> <y起> <y止>
import sys


def load(path):
    with open(path, 'rb') as fh:
        assert fh.readline().strip() == b'P6', 'not P6: ' + path
        while True:
            line = fh.readline()
            if line.startswith(b'#'):
                continue
            w, h = map(int, line.split())
            break
        fh.readline()
        return w, h, fh.read()


def px(d, w, x, y):
    i = (y * w + x) * 3
    return d[i], d[i + 1], d[i + 2]


INK = (0x3E, 0x4A, 0x5A)  # primary
ACC = (0xF2, 0x6B, 0x1D)  # tertiary


def kind(c):
    if all(abs(a - b) <= 40 for a, b in zip(c, INK)):
        return 'ink'
    if all(abs(a - b) <= 40 for a, b in zip(c, ACC)):
        return 'acc'
    return None


def clusters(d, w, x0, x1, y0, y1):
    cols = {}
    for x in range(x0, x1):
        ys = [y for y in range(y0, y1) if kind(px(d, w, x, y))]
        if ys:
            cols[x] = (min(ys), max(ys), {kind(px(d, w, x, y)) for y in ys})
    out, s = [], None
    for x in range(x0, x1):
        if x in cols:
            if s is None:
                s = x
        else:
            if s is not None:
                out.append((s, x - 1))
                s = None
    if s is not None:
        out.append((s, x1 - 1))
    res = []
    for a, b in out:
        if b - a < 3:
            continue
        ys = [cols[x][:2] for x in range(a, b + 1) if x in cols]
        kinds = set()
        for x in range(a, b + 1):
            if x in cols:
                kinds |= cols[x][2]
        res.append((a, b, min(y[0] for y in ys), max(y[1] for y in ys), max(y[1] for y in ys) - min(y[0] for y in ys) + 1, sorted(kinds)))
    return res


wa, ha, a = load(sys.argv[1])
wb, hb, b = load(sys.argv[2])
x0, x1, y0, y1 = (int(v) for v in sys.argv[3:7])
for tag, (w, h, d) in (('预览', (wa, ha, a)), ('参考设计图', (wb, hb, b))):
    print(tag, '数值行团块(x起,x止,y起,y止,高,颜色):')
    for c in clusters(d, w, x0, x1, y0, y1):
        print('   ', c)
