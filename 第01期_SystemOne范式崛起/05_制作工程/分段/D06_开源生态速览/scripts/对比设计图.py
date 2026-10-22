#!/usr/bin/env python3
# D06 预览帧 vs 已确认设计图（候选A 8 格网格帧）：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
# 探针区域＝_work/measure_8格网格帧.json（设计图_8格网格帧.html 的 #measure 实测盒）换算的搜索窗。
# 说明：搜索窗上界取 995，避开页脚带与字幕带（预览帧页脚会因字幕让位，两图不一致，不可比）。
import sys

CANVAS = (0xF9, 0xF2, 0xE0)
ACCENT = (0xF2, 0x6B, 0x1D)
SUCCESS = (0xFC, 0xE8, 0xD4)

# 格盒实测（measure_8格网格帧.json）：列左 88/530/972/1414，行上 215/611，格 418×372
COLS = [(80, 518), (518, 960), (960, 1402), (1402, 1840)]
ROWS = [(205, 600), (600, 995)]
CELLS = [
    (f'格{i + 1}', COLS[i % 4], ROWS[i // 4]) for i in range(8)
]

PROBES = [
    ('章节行文字', (88, 1000), (125, 180)),
    ('章节行下划线', (88, 400), (178, 200)),
] + [(name, xr, yr) for name, xr, yr in CELLS]


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


def near(c, t, tol=24):
    return all(abs(a - b) <= tol for a, b in zip(c, t))


def bbox(data, w, h, x0, x1, y0, y1, pred):
    mnx = mny = 10**9
    mxx = mxy = -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px(data, w, x, y)):
                mnx, mxx = min(mnx, x), max(mxx, x)
                mny, mxy = min(mny, y), max(mxy, y)
    return None if mxx < 0 else (mnx, mny, mxx - mnx + 1, mxy - mny + 1)


def diff_blocks(a, w, ha, b, x0, y0, x1, y1, tol=40):
    """两图在窗口内的差异块统计（按 4px 网格粗采样）：返回差异采样数、总数与差异包围盒。"""
    hit = 0
    tot = 0
    box = None
    for y in range(y0, y1, 4):
        for x in range(x0, x1, 4):
            tot += 1
            if any(abs(u - v) > tol for u, v in zip(px(a, w, x, y), px(b, w, x, y))):
                hit += 1
                if box is None:
                    box = [x, y, x, y]
                else:
                    box[0] = min(box[0], x)
                    box[1] = min(box[1], y)
                    box[2] = max(box[2], x)
                    box[3] = max(box[3], y)
    return hit, tot, box


def main():
    pa, pb = sys.argv[1], sys.argv[2]
    wa, ha, da = load(pa)
    wb, hb, db = load(pb)
    if (wa, ha) != (wb, hb):
        raise SystemExit(f'尺寸不一致 {wa}x{ha} vs {wb}x{hb}')

    notCanvas = lambda c: not near(c, CANVAS, 18)
    isAccent = lambda c: near(c, ACCENT, 40) and not near(c, CANVAS, 18)
    isSuccess = lambda c: near(c, SUCCESS, 10)

    print('# 盒（x, y, w, h）：预览 vs 设计图')
    for name, (x0, x1), (y0, y1) in PROBES:
        pred = isAccent if '下划线' in name else notCanvas
        A = bbox(da, wa, ha, x0, x1, y0, y1, pred)
        B = bbox(db, wb, hb, x0, x1, y0, y1, pred)
        flag = 'OK' if A == B else 'DIFF'
        print(f'{name:14s} {str(A):24s} {str(B):24s} {flag}')

    print('# 全帧差异（4px 粗采样，窗口 88,60–1832,995：顶栏＋章节行＋8 格，不含页脚/字幕带）')
    hit, tot, box = diff_blocks(da, wa, ha, db, 88, 60, 1832, 995)
    print(f'差异采样 {hit}/{tot} = {100.0 * hit / tot:.1f}%  包围盒 {box}')

    print('# 分区域差异（同容差，定位差异落在哪一块）')
    regions = [('顶栏', (88, 1832), (60, 120)), ('章节行', (88, 1000), (125, 200))]
    for name, (x0, x1), (y0, y1) in CELLS:
        regions.append((f'{name} 内区', (x0 + 6, x1 - 6), (y0 + 8, y1 - 8)))
    for name, (x0, x1), (y0, y1) in regions:
        h, t, bx = diff_blocks(da, wa, ha, db, x0, y0, x1, y1)
        print(f'{name:12s} {h:5d}/{t:6d} = {100.0 * h / t:4.1f}%  包围盒 {bx}')

    print('# 颜色角色：格内区（不含 3px 边框）tertiary 像素／success 底像素')
    for name, (x0, x1), (y0, y1) in CELLS:
        ix0, ix1, iy0, iy1 = x0 + 12, x1 - 12, y0 + 14, y1 - 14
        na = sum(1 for y in range(iy0, iy1) for x in range(ix0, ix1) if isAccent(px(da, wa, x, y)))
        ns = sum(1 for y in range(iy0, iy1) for x in range(ix0, ix1) if isSuccess(px(da, wa, x, y)))
        print(f'{name:6s} 预览 tertiary={na:6d}  success={ns:6d}')


if __name__ == '__main__':
    main()
