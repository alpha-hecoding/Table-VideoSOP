#!/usr/bin/python3
# D09 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm> <帧一|帧二|帧三>
# 探针窗口＝_work/measure_*.json（设计图 html 的 #measure 实测盒）外扩的搜索窗。
# 说明：搜索窗上界取 995，避开页脚带与字幕带（预览帧页脚会因字幕让位，两图不一致，不可比）。
import sys

CANVAS = (0xF9, 0xF2, 0xE0)
ACCENT = (0xF2, 0x6B, 0x1D)
LINE = (0xAE, 0xBA, 0xC7)
SUCCESS = (0xFC, 0xE8, 0xD4)

# 帧一：三卡搜索窗（measure 卡盒 88/677/1267,401,565x280 外扩，边界落在 24px 间距内，互不重叠）
CARDS = [
    ('卡1 Jeva', 80, 395, 665, 687),
    ('卡2 Reflex', 669, 395, 1252, 687),
    ('卡3 Tev', 1259, 395, 1840, 687),
]
# 帧一 动手实践芯片行（设计图实测行盒 713–777，芯片盒 727–776）：只取 line 边框 → 芯片盒包围盒
PRACTICE_WIN = (88, 700, 1832, 790)

# 帧二 金句块（measure：kicker 247–277／金句 299–493／出处 507–539／解读 571–612；块 x374–1546）
QUOTE = [
    ('kicker 今日金句', 370, 240, 1600, 285),
    ('金句行1', 370, 293, 1600, 397),
    ('金句行2', 370, 397, 1600, 497),
    ('出处 Fazm Blog', 370, 500, 1600, 545),
    ('解读行', 370, 565, 1600, 620),
]

# 帧三 片尾卡（measure：kicker 143–173／h1 183–280／下划线 294–304／副题 320–358／芯片行 382–431）
TAIL = [
    ('kicker 明日预告', 88, 138, 1832, 180),
    ('h1 期题', 88, 180, 1832, 286),
    ('副题 系列名', 88, 314, 1832, 364),
]
TAIL_UNDERLINE_WIN = (88, 288, 400, 312)
TAIL_CHIPS_WIN = (88, 376, 1832, 436)


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
    """窗口内按行统计文字像素，返回文字行带（起行, 高, x 起, 宽）——用于比对卡内四行／金句四行的位置与文字宽。"""
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


def col_bands(data, w, h, x0, y0, x1, y1, pred):
    """窗口内按列统计，返回横向分段（x 起, 宽）——用于芯片行里逐个芯片的盒宽。"""
    cols = []
    for x in range(x0, x1):
        ys = [y for y in range(y0, y1) if pred(px(data, w, x, y))]
        if ys:
            cols.append((x, min(ys), max(ys)))
    segs = []
    for x, mny, mxy in cols:
        if segs and x == segs[-1][1] + 1:
            segs[-1][1] = x
            segs[-1][2] = min(segs[-1][2], mny)
            segs[-1][3] = max(segs[-1][3], mxy)
        else:
            segs.append([x, x, mny, mxy])
    return [(a, b - a + 1, c, d - c + 1) for a, b, c, d in segs]


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
    if len(sys.argv) != 4 or sys.argv[3] not in ('帧一', '帧二', '帧三'):
        raise SystemExit('用法：对比设计图.py <预览.ppm> <参考.ppm> <帧一|帧二|帧三>')
    pa, pb, mode = sys.argv[1], sys.argv[2], sys.argv[3]
    wa, ha, da = load(pa)
    wb, hb, db = load(pb)
    if (wa, ha) != (wb, hb):
        raise SystemExit(f'尺寸不一致 {wa}x{ha} vs {wb}x{hb}')

    notCanvas = lambda c: not near(c, CANVAS, 18)
    isAccent = lambda c: near(c, ACCENT, 40) and not near(c, CANVAS, 18)
    isLine = lambda c: near(c, LINE, 20) and not near(c, CANVAS, 18) and not near(c, (0xFF, 0xFF, 0xFF), 12)
    isDark = lambda c: max(c) < 170  # 字形核心（primary／secondary）；line 边、tertiary、卡白、success 底不计

    print(f'# 模式：{mode}')
    print('# 顶栏文字包围盒（x, y, w, h）：预览 vs 设计图')
    for nm, x0, y0, x1, y1 in [('顶栏', 88, 60, 1832, 120)]:
        A = bbox(da, wa, ha, x0, y0, x1, y1, isDark)
        B = bbox(db, wb, hb, x0, y0, x1, y1, isDark)
        print(f'{nm:16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')

    if mode == '帧一':
        print('# 卡盒（x, y, w, h）：预览 vs 设计图')
        for name, x0, y0, x1, y1 in CARDS:
            A = bbox(da, wa, ha, x0, y0, x1, y1, notCanvas)
            B = bbox(db, wb, hb, x0, y0, x1, y1, notCanvas)
            print(f'{name:16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        print('# 卡内四行文字带（起行, 高, x 起, 宽）：预览 vs 设计图')
        for name, x0, y0, x1, y1 in CARDS:
            # 窗口取卡内区（去掉 3px 卡边）到卡盒下沿内 16px → 覆盖序号／论文名／定位／重点四行＋时长芯片文字
            A = row_bands(da, wa, ha, x0 + 6, y0 + 6, x1 - 6, y1 - 16, isDark)
            B = row_bands(db, wb, hb, x0 + 6, y0 + 6, x1 - 6, y1 - 16, isDark)
            print(f'{name:16s} {str(A):62s} {str(B):62s} {"OK" if A == B else "DIFF"}')
        print('# 动手实践：标签＋3 芯片盒（按列分段 x 起, 宽, y 起, 高）：预览 vs 设计图')
        A = col_bands(da, wa, ha, *PRACTICE_WIN, lambda c: isLine(c) or isDark(c))
        B = col_bands(db, wb, hb, *PRACTICE_WIN, lambda c: isLine(c) or isDark(c))
        print(f'{"实践行":16s} {str(A):62s} {str(B):62s} {"OK" if A == B else "DIFF"}')
        print('# 章节行文字包围盒：预览 vs 设计图')
        A = bbox(da, wa, ha, 88, 125, 1000, 200, isDark)
        B = bbox(db, wb, hb, 88, 125, 1000, 200, isDark)
        print(f'{"章节行":16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        wins = [('顶栏', 88, 60, 1832, 120), ('章节行', 88, 125, 1000, 200)] + [
            (n, x0 + 4, y0 + 4, x1 - 4, y1 - 4) for n, x0, y0, x1, y1 in CARDS
        ] + [('实践行', 88, 705, 1832, 785)]
    elif mode == '帧二':
        print('# 金句块四件包围盒（x, y, w, h）：预览 vs 设计图')
        for name, x0, y0, x1, y1 in QUOTE:
            A = bbox(da, wa, ha, x0, y0, x1, y1, isDark if 'kicker' not in name else isAccent)
            B = bbox(db, wb, hb, x0, y0, x1, y1, isDark if 'kicker' not in name else isAccent)
            print(f'{name:16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        print('# 金句块整体（含 kicker 橙方块）非画布包围盒：预览 vs 设计图')
        A = bbox(da, wa, ha, 300, 235, 1650, 625, notCanvas)
        B = bbox(db, wb, hb, 300, 235, 1650, 625, notCanvas)
        print(f'{"金句块":16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        wins = [('顶栏', 88, 60, 1832, 120)] + [(n, x0, y0, x1, y1) for n, x0, y0, x1, y1 in QUOTE]
    else:
        print('# 片尾卡标题块四件＋芯片行包围盒（x, y, w, h）：预览 vs 设计图')
        for name, x0, y0, x1, y1 in TAIL:
            A = bbox(da, wa, ha, x0, y0, x1, y1, isDark)
            B = bbox(db, wb, hb, x0, y0, x1, y1, isDark)
            print(f'{name:16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        print('# 下划线 120×10（tertiary）：预览 vs 设计图')
        A = bbox(da, wa, ha, *TAIL_UNDERLINE_WIN, isAccent)
        B = bbox(db, wb, hb, *TAIL_UNDERLINE_WIN, isAccent)
        print(f'{"下划线":16s} {str(A):26s} {str(B):26s} {"OK" if A == B else "DIFF"}')
        print('# 预告 3 芯片盒（按列分段 x 起, 宽, y 起, 高）：预览 vs 设计图')
        A = col_bands(da, wa, ha, *TAIL_CHIPS_WIN, isLine)
        B = col_bands(db, wb, hb, *TAIL_CHIPS_WIN, isLine)
        print(f'{"预告芯片行":16s} {str(A):62s} {str(B):62s} {"OK" if A == B else "DIFF"}')
        wins = [('顶栏', 88, 60, 1832, 120)] + [(n, x0, y0, x1, y1) for n, x0, y0, x1, y1 in TAIL] + [
            ('下划线', 88, 288, 400, 312),
            ('预告芯片行', 88, 378, 1832, 434),
        ]

    print('# 全帧差异（4px 粗采样，窗口 88,60–1832,995：不含页脚／字幕带）')
    hit, tot, box = diff_blocks(da, wa, ha, db, 88, 60, 1832, 995)
    print(f'差异采样 {hit}/{tot} = {100.0 * hit / tot:.1f}%  包围盒 {box}')

    print('# 分区域差异（同容差，定位差异落在哪一块）')
    for name, x0, y0, x1, y1 in wins:
        h, t, bx = diff_blocks(da, wa, ha, db, x0, y0, x1, y1)
        print(f'{name:16s} {h:5d}/{t:6d} = {100.0 * h / t:4.1f}%  包围盒 {bx}')

    print('# 颜色角色：tertiary 像素数（焦点纪律核对；预览／设计图各自）')
    for tag, d, w in (('预览', da, wa), ('设计', db, wb)):
        n = sum(1 for y in range(60, 995) for x in range(88, 1832, 2) if isAccent(px(d, w, x, y)))
        m = sum(1 for y in range(60, 995) for x in range(88, 1832, 2) if near(px(d, w, x, y), SUCCESS, 5))
        print(f'{tag} tertiary 采样 {n:6d}  success 底采样 {m:6d}')


if __name__ == '__main__':
    main()
