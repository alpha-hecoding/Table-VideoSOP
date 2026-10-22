#!/usr/bin/env python3
# D04 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm> [章卡]
# 探针区域＝设计图_design.html／章卡_design.html 的实测盒换算到画布坐标（SVG 原点 88,194）。
import sys

CANVAS = (0xF9, 0xF2, 0xE0)
LINE = (0xAE, 0xBA, 0xC7)
ACCENT = (0xF2, 0x6B, 0x1D)

CONTENT_PROBES = [
    ('身份卡行', 88, 125, 1832, 195),
    ('节点-感知', 320, 285, 560, 390),
    ('节点-规划', 1360, 285, 1600, 390),
    ('节点-行动', 1360, 480, 1600, 585),
    ('节点-观察结果', 1360, 660, 1600, 765),
    ('节点-反思模块', 320, 660, 560, 765),
    ('节点-策略更新', 320, 480, 560, 585),
    ('环心文字', 600, 590, 1150, 700),
    ('回环线弧', 400, 300, 1300, 560),
    # 探针下界取 988：页脚线在 y993–995，若把页脚带纳入会污染卡盒 bbox（预览帧页脚可能已让位，两图不一致）
    ('数据卡1', 80, 805, 790, 988),
    ('数据芯片', 800, 805, 1130, 988),
    ('数据卡2', 1130, 805, 1840, 988),
]
CHAPTER_PROBES = [
    ('kicker', 88, 425, 500, 470),
    ('h1', 88, 470, 1100, 600),
    ('下划线', 88, 600, 300, 640),
    ('副题', 88, 640, 900, 700),
]


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


def bbox(data, w, h, x0, y0, x1, y1, pred):
    mnx = mny = 10**9
    mxx = mxy = -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px(data, w, x, y)):
                mnx, mxx = min(mnx, x), max(mxx, x)
                mny, mxy = min(mny, y), max(mxy, y)
    return None if mxx < 0 else (mnx, mny, mxx - mnx + 1, mxy - mny + 1)


def col_runs(data, w, h, x, pred, lo, hi):
    out, s = [], None
    for y in range(lo, hi):
        if pred(px(data, w, x, y)):
            if s is None:
                s = y
        else:
            if s is not None:
                out.append((s, y))
                s = None
    if s is not None:
        out.append((s, hi))
    return out


def report(tag, w, h, data, probes):
    print(f'--- {tag} ---')
    for name, x0, y0, x1, y1 in probes:
        print(f'{name} bbox(x,y,w,h):', bbox(data, w, h, x0, y0, x1, y1, lambda c: not near(c, CANVAS, 22)))
    print('页脚线 y(x=900):', col_runs(data, w, h, 900, lambda c: near(c, LINE, 34), 940, 1060))
    print('tertiary 反思模块边 bbox:', bbox(data, w, h, 320, 660, 560, 765, lambda c: near(c, ACCENT, 40)))


# 2026-10-20 公共层跟随后新增探针：数据卡内三行文字的垂直节奏＋数值行（含单位）bbox。
# 复核口径＝总控公告 2026-10-20「卡盒 149／单位与数值同阶、写在同一行盒内」。
def card_text_rows(tag, w, h, data):
    print(f'--- 数据卡文字带 {tag} ---')
    for name, x in (('卡1 x=200', 200), ('卡2 x=1250', 1250)):
        print(f'{name} 文字带(y起-止):', col_runs(data, w, h, x, lambda c: not near(c, CANVAS, 22), 838, 986))
    for name, x0, x1 in (('卡1 数值行', 116, 760), ('卡2 数值行', 1167, 1810)):
        print(f'{name} bbox:', bbox(data, w, h, x0, 876, x1, 938, lambda c: not near(c, CANVAS, 22)))


def diff_stats(a, b, w, h, step=8, thr=48):
    blocks = []
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
    mnx = min((b[0] for b in blocks), default=-1)
    mxx = max((b[0] + step for b in blocks), default=-1)
    mny = min((b[1] for b in blocks), default=-1)
    mxy = max((b[1] + step for b in blocks), default=-1)
    print(f'差异块 {len(blocks)}/{total} = {len(blocks)/total:.1%}；外接框 x[{mnx},{mxx}] y[{mny},{mxy}]')
    bands = {}
    for bx, by in blocks:
        bands[by // 128] = bands.get(by // 128, 0) + 1
    print('按 y 带（128px）分布:', {k * 128: v for k, v in sorted(bands.items())})


def main():
    pa, pb = sys.argv[1], sys.argv[2]
    probes = CHAPTER_PROBES if len(sys.argv) > 3 and sys.argv[3] == '章卡' else CONTENT_PROBES
    wa, ha, a = load(pa)
    wb, hb, b = load(pb)
    assert (wa, ha) == (wb, hb), f'尺寸不同 {(wa,ha)} vs {(wb,hb)}'
    report('预览', wa, ha, a, probes)
    report('参考设计图', wb, hb, b, probes)
    if probes is CONTENT_PROBES:
        card_text_rows('预览', wa, ha, a)
        card_text_rows('参考设计图', wb, hb, b)
    print('--- 差异 ---')
    diff_stats(a, b, wa, ha)


main()
