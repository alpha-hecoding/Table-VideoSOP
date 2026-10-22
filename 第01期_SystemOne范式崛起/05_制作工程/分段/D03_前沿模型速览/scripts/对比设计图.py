#!/usr/bin/env python3
# D03 预览帧 vs 已确认设计图：几何与颜色角色核对（纯标准库，输入为 ffmpeg 转出的 rgb24 PPM）
# 用法：/usr/bin/python3 scripts/对比设计图.py <预览.ppm> <参考.ppm>
# 取点依据：_work/measure_*.json（设计图实测）＋ 组件里写死的盒参数（表盒／行高／芯片行）。
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


def near(c, t, tol=26):
    return all(abs(a - b) <= tol for a, b in zip(c, t))


CANVAS = (0xF9, 0xF2, 0xE0)
LINE = (0xAE, 0xBA, 0xC7)
ACCENT = (0xF2, 0x6B, 0x1D)
INK = (0x3E, 0x4A, 0x5A)
SYSTEM = (0xDE, 0xE5, 0xEC)
SUCCESS = (0xFC, 0xE8, 0xD4)
WHITE = (0xFF, 0xFF, 0xFF)


def runs(data, w, x, y0, y1, pred):
    """列 x 上 [y0,y1) 内满足 pred 的连续段（起点, 终点不含）。"""
    out, s = [], None
    for y in range(y0, y1):
        if pred(px(data, w, x, y)):
            if s is None:
                s = y
        else:
            if s is not None:
                out.append((s, y))
                s = None
    if s is not None:
        out.append((s, y1))
    return out


def hruns(data, w, x0, x1, y, pred):
    out, s = [], None
    for x in range(x0, x1):
        if pred(px(data, w, x, y)):
            if s is None:
                s = x
        else:
            if s is not None:
                out.append((s, x))
                s = None
    if s is not None:
        out.append((s, x1))
    return out


def report(tag, w, h, data):
    # 标题块：h1 用墨色文字带（x=100..800 行扫描），下划线＝accent 横条
    ink_rows = [y for y in range(150, 320) if any(near(px(data, w, x, y), INK) for x in range(100, 800, 7))]
    h1 = (ink_rows[0], ink_rows[-1] + 1) if ink_rows else None
    ul_y = [y for y in range(280, 320) if hruns(data, w, 88, 400, y, lambda c: near(c, ACCENT))]
    # 下划线宽度（accent 横条最长一段）
    uw = 0
    for y in range(280, 320):
        r = hruns(data, w, 88, 400, y, lambda c: near(c, ACCENT))
        for a, b in r:
            uw = max(uw, b - a)
    # 对比表盒：x=960 列上 surface 白底带 ＋ 3px line 边
    white = runs(data, w, 960, 480, 1000, lambda c: near(c, WHITE, 12))
    box = (white[0][0] - 3, white[-1][1] + 3) if white else None
    # 强调行／对照行
    hot = runs(data, w, 200, 480, 1000, lambda c: near(c, SUCCESS))
    cmp = runs(data, w, 200, 480, 1000, lambda c: near(c, SYSTEM))
    # 要点芯片行：x=100..560 上 surface 白底（芯片盒）在 y420..520
    chip = hruns(data, w, 88, 900, 483, lambda c: near(c, WHITE, 12))
    print(f'== {tag} ==')
    print('  h1 文字带 y', h1)
    print('  下划线 y', (ul_y[0], ul_y[-1] + 1) if ul_y else None, '宽', uw)
    print('  表盒 y', box)
    print('  强调行 y', hot)
    print('  对照行 y', cmp)
    print('  芯片行 y483 白段', chip)


if __name__ == '__main__':
    a, b = sys.argv[1], sys.argv[2]
    for p in (a, b):
        w, h, d = load(p)
        report(p.split('/')[-1], w, h, d)
