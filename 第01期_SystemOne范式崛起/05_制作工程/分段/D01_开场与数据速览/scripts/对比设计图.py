#!/usr/bin/env python3
# D01 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
import sys


def load(path):
    with open(path, 'rb') as fh:
        if fh.readline().strip() != b'P6':
            raise SystemExit('not P6: ' + path)
        while True:  # 跳过注释行
            line = fh.readline()
            if line.startswith(b'#'):
                continue
            w, h = map(int, line.split())
            break
        fh.readline()  # maxval
        data = fh.read()
    return w, h, data


def px(data, w, x, y):
    i = (y * w + x) * 3
    return data[i], data[i + 1], data[i + 2]


def near(c, target, tol=28):
    return all(abs(a - b) <= tol for a, b in zip(c, target))


LINE = (0xAE, 0xBA, 0xC7)  # C.line
ACCENT = (0xF2, 0x6B, 0x1D)  # C.tertiary
INK = (0x3E, 0x4A, 0x5A)  # C.primary


def runs_in_row(data, w, y, pred):
    """返回该行满足 pred 的连续段 [start,end)"""
    out, s = [], None
    for x in range(w):
        if pred(px(data, w, x, y)):
            if s is None:
                s = x
        else:
            if s is not None:
                out.append((s, x))
                s = None
    if s is not None:
        out.append((s, w))
    return [r for r in out if r[1] - r[0] >= 3]


def runs_in_col(data, w, h, x, pred):
    out, s = [], None
    for y in range(h):
        if pred(px(data, w, x, y)):
            if s is None:
                s = y
        else:
            if s is not None:
                out.append((s, y))
                s = None
    if s is not None:
        out.append((s, h))
    return [r for r in out if r[1] - r[0] >= 2]


def bbox_of_color(data, w, h, x0, y0, x1, y1, pred):
    minx = miny = 10**9
    maxx = maxy = -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px(data, w, x, y)):
                minx, maxx = min(minx, x), max(maxx, x)
                miny, maxy = min(miny, y), max(maxy, y)
    return None if maxx < 0 else (minx, miny, maxx - minx + 1, maxy - miny + 1)


def report(tag, w, h, data):
    print(f'--- {tag} ---')
    # 下划线（橙色 120x10，y 280-320）
    print('下划线 bbox(x,y,w,h):', bbox_of_color(data, w, h, 80, 270, 400, 330, lambda c: near(c, ACCENT, 40)))
    # h1 文字块（primary，y 170-290）
    print('h1 文字 bbox:', bbox_of_color(data, w, h, 80, 165, 1200, 300, lambda c: near(c, INK, 26)))
    # 芯片行边框（line，y 370-440）
    print('芯片行上下边:', runs_in_col(data, w, h, 100, lambda c: near(c, LINE, 30))[:4])
    # 数据卡：在 y=700 扫描边框（line 或 tertiary）
    cards = runs_in_row(data, w, 700, lambda c: near(c, LINE, 34) or near(c, ACCENT, 40))
    print('y700 卡边框段:', cards)
    # 卡盒上下边（取第一卡左边 x=90 处）
    first = cards[0][0] + 2 if cards else 90
    print(f'卡盒纵向（x={first}）:', runs_in_col(data, w, h, first, lambda c: near(c, LINE, 34) or near(c, ACCENT, 40)))
    # 页脚线（line，y 960-1010）
    print('页脚线 y:', [r for r in runs_in_col(data, w, h, 900, lambda c: near(c, LINE, 30)) if r[0] > 900])


def diff_stats(a, b, w, h, step=8, thr=48):
    """按 8px 网格统计差异块，输出差异块的外接框与占比"""
    blocks, minx = [], 10**9
    miny, maxx, maxy = 10**9, -1, -1
    total = (w // step) * (h // step)
    for by in range(0, h - step, step):
        for bx in range(0, w - step, step):
            n = 0
            for y in range(by, by + step, 2):
                for x in range(bx, bx + step, 2):
                    ca, cb = px(a, w, x, y), px(b, w, x, y)
                    if max(abs(u - v) for u, v in zip(ca, cb)) > thr:
                        n += 1
            if n >= 4:  # 块内 ≥1/4 像素明显不同
                blocks.append((bx, by))
                minx, maxx = min(minx, bx), max(maxx, bx + step)
                miny, maxy = min(miny, by), max(maxy, by + step)
    print(f'差异块 {len(blocks)}/{total} = {len(blocks)/total:.1%}；外接框 x[{minx},{maxx}] y[{miny},{maxy}]')
    # 按 128px 带汇总，定位差异集中在哪些纵向区间
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
