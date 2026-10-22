#!/usr/bin/env python3
# D02 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
import sys


def load(path):
    with open(path, 'rb') as fh:
        if fh.readline().strip() != b'P6':
            raise SystemExit('not P6: ' + path)
        while True:
            line = fh.readline()
            if line.startswith(b'#'):
                continue
            w, h = map(int, line.split())
            break
        fh.readline()
        data = fh.read()
    return w, h, data


def px(data, w, x, y):
    i = (y * w + x) * 3
    return data[i], data[i + 1], data[i + 2]


def near(c, t, tol=28):
    return all(abs(a - b) <= tol for a, b in zip(c, t))


LINE = (0xAE, 0xBA, 0xC7)
ACCENT = (0xF2, 0x6B, 0x1D)
INK = (0x3E, 0x4A, 0x5A)
SYSTEM = (0xDE, 0xE5, 0xEC)
SUCCESS = (0xFC, 0xE8, 0xD4)


def runs_in_row(data, w, y, pred, minlen=3):
    out, s = [], None
    for x in range(w):
        if pred(px(data, w, x, y)):
            if s is None:
                s = x
        elif s is not None:
            out.append((s, x))
            s = None
    if s is not None:
        out.append((s, w))
    return [r for r in out if r[1] - r[0] >= minlen]


def runs_in_col(data, w, h, x, pred, minlen=2):
    out, s = [], None
    for y in range(h):
        if pred(px(data, w, x, y)):
            if s is None:
                s = y
        elif s is not None:
            out.append((s, y))
            s = None
    if s is not None:
        out.append((s, h))
    return [r for r in out if r[1] - r[0] >= minlen]


def bbox(data, w, h, x0, y0, x1, y1, pred):
    mnx = mny = 10**9
    mxx = mxy = -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px(data, w, x, y)):
                mnx, mxx = min(mnx, x), max(mxx, x)
                mny, mxy = min(mny, y), max(mxy, y)
    return None if mxx < 0 else (mnx, mny, mxx - mnx + 1, mxy - mny + 1)


def report(tag, w, h, d):
    print(f'--- {tag} ---')
    # 下划线（橙 120x10，设计图 y294）
    print('下划线 bbox:', bbox(d, w, h, 80, 270, 400, 340, lambda c: near(c, ACCENT, 40)))
    # h1 文字块（primary，设计图 y183-280）
    print('h1 文字 bbox:', bbox(d, w, h, 80, 165, 1300, 300, lambda c: near(c, INK, 26)))
    # 副题行芯片上边（line，设计图 y320-370）
    print('副题行 x=250 纵向 line 段:', [r for r in runs_in_col(d, w, h, 250, lambda c: near(c, LINE, 30)) if 300 < r[0] < 400])
    # 面板盒：左＝白卡＋line 边（x88），右＝system 底（x983）
    print('左面板盒 x=90 纵向:', [r for r in runs_in_col(d, w, h, 90, lambda c: near(c, LINE, 26)) if r[0] > 380])
    print('右面板 system 底 x=1400 纵向:', [r for r in runs_in_col(d, w, h, 1400, lambda c: near(c, SYSTEM, 12)) if r[0] > 380])
    # 左答案盒（success 填充＋tertiary 边，设计图 x620-820 SVG → 画布约 x400-560）
    print('左答案盒 success 底 bbox:', bbox(d, w, h, 380, 520, 620, 660, lambda c: near(c, SUCCESS, 12)))
    # 左直线（tertiary 7px，设计图画布 y≈573）
    print('左直线 y 扫描（x150-560）:', [r for r in runs_in_row(d, w, 573, lambda c: near(c, ACCENT, 40)) if r[1] - r[0] > 20])
    # 右折线（primary 虚线）
    print('右折线 y=573 段:', [r for r in runs_in_row(d, w, 573, lambda c: near(c, INK, 26)) if r[0] > 1000 and r[1] - r[0] > 4])
    # 数据卡盒（设计图 x88/680/1272，top821，w560，h149）
    print('y=900 卡边框段:', runs_in_row(d, w, 900, lambda c: near(c, LINE, 34) or near(c, ACCENT, 40)))
    print('卡1 纵向 x=90:', [r for r in runs_in_col(d, w, h, 90, lambda c: near(c, LINE, 34)) if r[0] > 780])
    print('卡3 纵向 x=1274:', [r for r in runs_in_col(d, w, h, 1274, lambda c: near(c, ACCENT, 40)) if r[0] > 780])
    print('卡3 success 底 bbox:', bbox(d, w, h, 1276, 800, 1836, 990, lambda c: near(c, SUCCESS, 12)))
    # 页脚线（line，设计图 y992）
    print('页脚线 y:', [r for r in runs_in_col(d, w, h, 900, lambda c: near(c, LINE, 30)) if r[0] > 900])


def diff_stats(a, b, w, h, step=8, thr=48):
    blocks, minx, miny, maxx, maxy = [], 10**9, 10**9, -1, -1
    total = (w // step) * (h // step)
    for by in range(0, h - step, step):
        for bx in range(0, w - step, step):
            n = 0
            for y in range(by, by + step, 2):
                for x in range(bx, bx + step, 2):
                    ca, cb = px(a, w, x, y), px(b, w, x, y)
                    if max(abs(u - v) for u, v in zip(ca, cb)) > thr:
                        n += 1
            if n >= 4:
                blocks.append((bx, by))
                minx, maxx = min(minx, bx), max(maxx, bx + step)
                miny, maxy = min(miny, by), max(maxy, by + step)
    print(f'差异块 {len(blocks)}/{total} = {len(blocks)/total:.1%}；外接框 x[{minx},{maxx}] y[{miny},{maxy}]')
    bands = {}
    for bx, by in blocks:
        bands[by // 128] = bands.get(by // 128, 0) + 1
    print('按 y 带（128px）分布:', {k * 128: v for k, v in sorted(bands.items())})


def main():
    pa, pb = sys.argv[1], sys.argv[2]
    wa, ha, a = load(pa)
    wb, hb, b = load(pb)
    assert (wa, ha) == (wb, hb), f'尺寸不同 {(wa,ha)} vs {(wb,hb)}'
    report('预览', wa, ha, a)
    report('参考设计图', wb, hb, b)
    print('--- 差异 ---')
    diff_stats(a, b, wa, ha)


main()
