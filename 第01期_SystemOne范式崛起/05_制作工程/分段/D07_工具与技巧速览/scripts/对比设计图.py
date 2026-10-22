#!/usr/bin/env python3
# D07 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
# 探针区域＝_work/measure.json（设计图_5行清单帧.html 的 #measure 实测盒）换算的搜索窗。
# 说明：搜索窗上界取 995，避开页脚带与字幕带（预览帧页脚会因字幕让位，两图不一致，不可比）。
import sys

CANVAS = (0xF9, 0xF2, 0xE0)
ACCENT = (0xF2, 0x6B, 0x1D)
LINE = (0xAE, 0xBA, 0xC7)

PROBES = [
    ('章节行文字', 88, 125, 1000, 180),
    ('章节行下划线', 88, 178, 400, 200),
    ('行1', 88, 205, 1832, 435),
    ('行2', 88, 435, 1832, 575),
    ('行3', 88, 576, 1832, 714),
    ('行4', 88, 715, 1832, 853),
    ('行5', 88, 854, 1832, 995),
]
# 子芯片组：行 1 内部（避开行 1 自身描边），按 line 描边色取包围盒
CHIP_WIN = (200, 330, 1000, 410)


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


def bbox(data, w, h, x0, y0, x1, y1, pred):
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
    isLine = lambda c: near(c, LINE, 20) and not near(c, CANVAS, 18) and not near(c, (0xFF, 0xFF, 0xFF), 12)

    print('# 盒（x, y, w, h）：预览 vs 设计图')
    for name, x0, y0, x1, y1 in PROBES:
        pred = isAccent if '下划线' in name else notCanvas
        A = bbox(da, wa, ha, x0, y0, x1, y1, pred)
        B = bbox(db, wb, hb, x0, y0, x1, y1, pred)
        flag = 'OK' if A == B else 'DIFF'
        print(f'{name:12s} {str(A):24s} {str(B):24s} {flag}')
    A = bbox(da, wa, ha, *CHIP_WIN, isLine)
    B = bbox(db, wb, hb, *CHIP_WIN, isLine)
    print(f'{"子芯片组":12s} {str(A):24s} {str(B):24s} {"OK" if A == B else "DIFF"}')

    print('# 全帧差异（4px 粗采样，窗口 88,60–1832,995：顶栏＋章节行＋清单区，不含页脚/字幕带）')
    hit, tot, box = diff_blocks(da, wa, ha, db, 88, 60, 1832, 995)
    print(f'差异采样 {hit}/{tot} = {100.0 * hit / tot:.1f}%  包围盒 {box}')

    print('# 分区域差异（同容差，定位差异落在哪一块）')
    for name, x0, y0, x1, y1 in [
        ('顶栏', 88, 60, 1832, 120),
        ('章节行', 88, 125, 1000, 200),
        ('行1 内区', 92, 219, 1828, 424),
        ('子芯片行', 200, 330, 1000, 410),
        ('行2 内区', 92, 445, 1828, 562),
        ('行3 内区', 92, 584, 1828, 701),
        ('行4 内区', 92, 723, 1828, 840),
        ('行5 内区', 92, 862, 1828, 979),
    ]:
        h, t, bx = diff_blocks(da, wa, ha, db, x0, y0, x1, y1)
        print(f'{name:8s} {h:5d}/{t:6d} = {100.0 * h / t:4.1f}%  包围盒 {bx}')

    print('# 颜色角色：各行内区是否出现 tertiary（应无，焦点纪律）')
    for name, x0, y0, x1, y1 in [
        ('行1', 92, 219, 1828, 424),
        ('行2', 92, 445, 1828, 562),
        ('行3', 92, 584, 1828, 701),
        ('行4', 92, 723, 1828, 840),
        ('行5', 92, 862, 1828, 979),
    ]:
        n = sum(1 for y in range(y0, y1) for x in range(x0, x1) if isAccent(px(da, wa, x, y)))
        print(f'{name:6s} 预览帧 tertiary 像素 {n}')


if __name__ == '__main__':
    main()
