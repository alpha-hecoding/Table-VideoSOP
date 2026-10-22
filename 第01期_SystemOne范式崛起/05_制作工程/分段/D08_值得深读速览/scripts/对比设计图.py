#!/usr/bin/python3
# D08 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
# 探针窗口＝_work/measure.json（设计图_5卡速览帧.html 的 #measure 实测盒）换算的搜索窗。
# 说明：搜索窗上界取 995，避开页脚带与字幕带（预览帧页脚会因字幕让位，两图不一致，不可比）。
import sys

CANVAS = (0xF9, 0xF2, 0xE0)
ACCENT = (0xF2, 0x6B, 0x1D)
LINE = (0xAE, 0xBA, 0xC7)
SUCCESS = (0xFC, 0xE8, 0xD4)

# 5 卡搜索窗（measure.json 卡盒外扩，边界落在 24px 间距内，互不重叠）
CARDS = [
    ('卡1 Tev', 80, 205, 960, 595),
    ('卡2 TPPO', 964, 205, 1840, 595),
    ('卡3 Vela', 80, 601, 665, 995),
    ('卡4 Hybrid', 665, 601, 1254, 995),
    ('卡5 DoubtLess', 1259, 601, 1840, 995),
]
# 卡 4 芯片搜索窗：只取启发行以下的内区（去掉 3px 卡边）——终态下卡边是 tertiary，
# 而出处行（secondary）在 success 底上的抗锯齿过渡色会落进 line 容差，故上界压在启发行之下，避免污染包围盒
CHIP_WIN = (683, 830, 1236, 977)


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


def row_bands(data, w, h, x0, y0, x1, y1, pred):
    """窗口内按行统计文字像素，返回文字行带（起行, 高, x 起, 宽）列表——用于比对卡内三行／芯片行的位置与文字宽。"""
    rows = []
    for y in range(y0, y1):
        xs = [x for x in range(x0, x1) if pred(px(data, w, x, y))]
        if xs:
            rows.append((y, min(xs), max(xs)))
    bands = []
    for y, mnx, mxx in rows:
        if bands and y == bands[-1][1] + 1:
            bands[-1][1] = y
            bands[-1][2] = min(bands[-1][2], mnx)
            bands[-1][3] = max(bands[-1][3], mxx)
        else:
            bands.append([y, y, mnx, mxx])
    return [(a, b - a + 1, mnx, mxx - mnx + 1) for a, b, mnx, mxx in bands]


def diff_blocks(a, w, ha, b, x0, y0, x1, y1, tol=40):
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
    # 文字像素＝足够暗的字形核心：primary(62,74,90)／secondary(124,135,151) 计入；
    # line 边(174,186,199)、tertiary(242,107,29)、画布、卡白、success 底均不计（两图同一判据，可直接比对）
    isDark = lambda c: max(c) < 170

    print('# 卡盒（x, y, w, h）：预览 vs 设计图')
    for name, x0, y0, x1, y1 in CARDS:
        A = bbox(da, wa, ha, x0, y0, x1, y1, notCanvas)
        B = bbox(db, wb, hb, x0, y0, x1, y1, notCanvas)
        print(f'{name:14s} {str(A):24s} {str(B):24s} {"OK" if A == B else "DIFF"}')

    print('# 卡内文字行带（起行, 高）：预览 vs 设计图')
    for name, x0, y0, x1, y1 in CARDS:
        A = row_bands(da, wa, ha, x0 + 6, y0 + 6, x1 - 6, y1 - 6, isDark)
        B = row_bands(db, wb, hb, x0 + 6, y0 + 6, x1 - 6, y1 - 6, isDark)
        print(f'{name:14s} {str(A):48s} {str(B):48s} {"OK" if A == B else "DIFF"}')

    print('# 顶栏／章节行文字包围盒（x, y, w, h）：预览 vs 设计图')
    for nm, x0, y0, x1, y1 in [('顶栏', 88, 60, 1832, 120), ('章节行', 88, 125, 1000, 200)]:
        A = bbox(da, wa, ha, x0, y0, x1, y1, isDark)
        B = bbox(db, wb, hb, x0, y0, x1, y1, isDark)
        print(f'{nm:14s} {str(A):24s} {str(B):24s} {"OK" if A == B else "DIFF"}')

    A = bbox(da, wa, ha, *CHIP_WIN, isLine)
    B = bbox(db, wb, hb, *CHIP_WIN, isLine)
    print(f'{"卡4 芯片盒":12s} {str(A):24s} {str(B):24s} {"OK" if A == B else "DIFF"}')

    print('# 全帧差异（4px 粗采样，窗口 88,60–1832,995：顶栏＋章节行＋卡组区，不含页脚/字幕带）')
    hit, tot, box = diff_blocks(da, wa, ha, db, 88, 60, 1832, 995)
    print(f'差异采样 {hit}/{tot} = {100.0 * hit / tot:.1f}%  包围盒 {box}')

    print('# 分区域差异（同容差，定位差异落在哪一块）')
    for name, x0, y0, x1, y1 in [('顶栏', 88, 60, 1832, 120), ('章节行', 88, 125, 1000, 200)] + [
        (n, x0 + 4, y0 + 4, x1 - 4, y1 - 4) for n, x0, y0, x1, y1 in CARDS
    ]:
        h, t, bx = diff_blocks(da, wa, ha, db, x0, y0, x1, y1)
        print(f'{name:14s} {h:5d}/{t:6d} = {100.0 * h / t:4.1f}%  包围盒 {bx}')

    print('# 颜色角色：各卡内区 tertiary 像素数（焦点纪律：只允许卡 4 有）')
    for name, x0, y0, x1, y1 in CARDS:
        n = sum(1 for y in range(y0 + 4, y1 - 4) for x in range(x0 + 4, x1 - 4) if isAccent(px(da, wa, x, y)))
        m = sum(1 for y in range(y0 + 4, y1 - 4) for x in range(x0 + 4, x1 - 4) if near(px(da, wa, x, y), SUCCESS, 5))
        print(f'{name:14s} 预览 tertiary {n:6d}  success底 {m:6d}')
    for name, x0, y0, x1, y1 in CARDS:
        n = sum(1 for y in range(y0 + 4, y1 - 4) for x in range(x0 + 4, x1 - 4) if isAccent(px(db, wa, x, y)))
        m = sum(1 for y in range(y0 + 4, y1 - 4) for x in range(x0 + 4, x1 - 4) if near(px(db, wa, x, y), SUCCESS, 5))
        print(f'{name:14s} 设计 tertiary {n:6d}  success底 {m:6d}')


if __name__ == '__main__':
    main()
