#!/usr/bin/env python3
# 字幕切句：把 edge-tts 的句级 VTT 切成"单行装得下"的小 cue，并换算成全片帧号。
# 时序来源优先级（2026-10-20 改版，D04 接入说明报项 1 的处理）：
#   1) 各分段 05_制作工程/分段/D0X_*/src/秒点.ts 注释里的「实测」词组边界——分段用 ffmpeg 解码＋20ms RMS 窗
#      或 silencedetect 实测，与画面秒点同源，所以字幕与画面对齐；
#   2) 02_配音/采用/D0X_配音.wav 的语音段边界（本脚本 speech_runs，与分段同一套参数：20ms 窗、
#      噪声底 35 分位＋9dB、间隙 <0.08s 合并）；
#   3) 02_配音/原始/D0X_原始.vtt 原值（最后回退）。
# 为什么要重锚：edge-tts 的句级 VTT 止点与音频实测不一致（D04 第 3 句 VTT 止点 10.648s，音频实际 13.285s；
#   9 段 61 句多数止点偏短 0.5–1.0s），且 VTT 只有句级，句内 cue 只能按权重比例分配，误差会累积。
# 怎么贴锚：秒点.ts 的 S 编号在 D04 与 VTT 句序不一致（D04 的 S3/S4 是呼吸群，VTT 句 3 跨 S3＋S4 前半），
#   所以不按编号对齐，改按「归一化文字流」对齐＝把本段 VTT 文本去空格/标点后拼成一条串，按时间顺序把每个
#   锚的文字定位到这条串上，得到 字符位置→实测时间 的 knot 表；句界与 cue 界都表示成字符位置后查 knot
#   （命中＝实测值，未命中＝相邻 knot 线性插值）。锚文字里的「…」／「——」按首尾片段定位（压缩引用）；
#   锚文字只引用了句子一部分但时间跨度是整句的（如 D03「Liquid AI 发布了…」），止点挂到该句末位，
#   避免把整句时长挂到首个短语上。注释里的（VTT …）对照值、（…估算…）推断值与「尾静音」区间一律剔除。
# 输出：05_制作工程/字幕/字幕_全片.srt（B站上传用）、.vtt、remotion-main/src/lib/subtitles.ts（烧录用）。
# 规则：单行 ≤28 字；优先在强标点处切；不切开英文/数字 token；句内 cue 先按权重比例分配、再吸附到实测锚；
#       最短 1.1s（不足则与相邻合并）；cue 末尾标点去掉，cue 内标点保留。
import os, re, glob, sys, array, math, subprocess

# 对照／回退开关（可叠加）：
#   默认            实测锚 → 语音段 → VTT
#   --no-anchor     跳过秒点.ts 实测锚，只用语音段 → VTT
#   --no-reanchor   跳过语音段层
#   两个都给        纯 VTT 原时序＝2026-10-19 那一版（实测复现 178 条／合计 433.7s），用来做前后对比
NO_ANCHOR = '--no-anchor' in sys.argv
NO_REANCHOR = '--no-reanchor' in sys.argv

ROOT = "/data/work/code/github/alpha-hecoding/Table-VideoSOP/第02期_GUIAgent登顶_开源推理模型新标杆"
FPS = 30
MAX_CHARS = 28          # 26px 单行在 1744px 安全宽度内的保守上限
MIN_DUR = 34.0 / FPS    # 最短时长＝34f≈1.13s（DESIGN componentBehavior.subtitle）
HOLD_GAP = 1.5          # 秒；段内两处 cue 间留白短于此就续挂到下一条起点
                        # （DESIGN：页脚按"字幕块"让位，段内首尾相接的 cue 合成一块。重锚后句间出现
                        #   0.3–1.3s 实测留白，实测最大 1.30s（D05），取 1.5 让每段连成一块，
                        #   与已确认的 D01 成片一致＝页脚只在段间留白出现；调小会引入页脚反复淡入淡出）
STRONG = '，。、；：！？,;:!?—'  # 可切点
WIN = 0.02              # 语音检测窗长（秒）
MERGE_GAP = 0.08        # 短于此的间隙不切分语音段
MIN_SPEECH = 0.10       # 短于此的语音段忽略
ANCHOR_TOL = 2.5        # 句界吸附到语音段间隙的最大距离（秒），超出则保留比例分配值

# F0 与段帧数：唯一来源 05_制作工程/总装排点.md v1（改排点先改那里，再同步这里）
F0 = {'D01': (0, 1328), 'D02': (1368, 1510), 'D03': (2893, 2004), 'D04': (4912, 1462), 'D05': (6389, 1476), 'D06': (7880, 1646), 'D07': (9541, 1516), 'D08': (11072, 1715), 'D09': (12802, 1558)}

TOKEN = re.compile(r'[A-Za-z0-9][A-Za-z0-9.\-+/%]*')
KEEP = re.compile(r'[0-9A-Za-z\u4e00-\u9fff]')


def norm(s):
    """归一化：只留 CJK 与拉丁字母数字，用于把实测锚贴到 VTT 文本上。"""
    return ''.join(c for c in s if KEEP.match(c))


def parse_vtt(path):
    cues = []
    for block in re.split(r'\n\s*\n', open(path, encoding='utf-8').read()):
        m = re.search(r'(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)', block)
        if not m:
            continue
        g = list(map(int, m.groups()))
        start = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000.0
        end = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000.0
        text = ' '.join(l.strip() for l in block.split('\n')
                        if l.strip() and '-->' not in l and not re.fullmatch(r'\d+', l.strip()))
        if text:
            cues.append((start, end, text))
    return cues


def miaodian_region(path):
    """取 秒点.ts 里「配音词组边界／句级边界」那段注释（到 节拍／接力 之前），不读代码区。"""
    head = []
    for l in open(path, encoding='utf-8'):
        if l.startswith('export '):
            break
        head.append(l.rstrip('\n'))
    txt = '\n'.join(head)
    i = txt.find('边界（秒')
    if i < 0:
        return ''
    j = min(x for x in (txt.find('\n// 节拍', i), txt.find('\n// 三帧接力', i), len(txt)) if x >= i)
    return txt[i:j]


def clean_region(block):
    """剔掉不可信／非实测的值：（VTT …）对照、（…估算…）推断、尾静音区间。"""
    out = []
    for line in block.split('\n'):
        line = re.sub(r'（[^（）]*VTT[^（）]*）', '', line)
        line = re.sub(r'（[^（）]*估算[^（）]*）', '', line)
        line = re.sub(r'尾静音\s+\d+\.\d+[–-]\d+\.\d+(｜f\d+[–-]f?\d+)?', '', line)
        out.append(line)
    return '\n'.join(out)


def parse_miaodian(path):
    """秒点.ts → [(起秒, 止秒, 锚文字)]，按时间排序；帧写法换算成秒；去重。
    三种写法分开处理：
      A 词组级＝「4.734–6.391｜f142–192『中国人民大学的』」→ 秒跨度就是该词组，直接取；
      B 词点级＝「『对比一下：』f610–624」→ 只有帧，换算成秒；
      C 句级行＝「S4 20.346–32.651｜f610–980『对比一下：』f610–624」→ 秒跨度是整句而不是该词组，
        特征是「」后紧跟帧号；这种秒跨度用负向前瞻跳过，整句起／止改由 B 的首个与末个词点给出。
    压缩引用（锚文字带「…」或「——」，只写首尾）跨度仍是整句，保留，按首尾片段定位。"""
    blk = clean_region(miaodian_region(path))
    blk = re.sub(r'\n//', ' ', blk)          # 续行并入上一行（D04 的连续语流跨行）
    out = []
    for a, b, t in re.findall(
            r'(\d+\.\d+)[–-](\d+\.\d+)(?:｜f\d+[–-]f?\d+)?\s*(?:连续语流)?'
            r'「([^」]*)」(?!\s*≈?f\d+[–-]f?\d+)', blk):
        out.append((float(a), float(b), t))
    for t, fa, fb in re.findall(r'「([^」]*)」≈?f(\d+)[–-]f?(\d+)', blk):
        out.append((int(fa) / FPS, int(fb) / FPS, t))
    seen, ded = set(), []
    for a, b, t in sorted(out, key=lambda x: x[0]):
        k = (round(a, 3), round(b, 3), norm(t))
        if k in seen or not norm(t):
            continue
        seen.add(k)
        ded.append((a, b, t))
    return ded


def locate(anchors, V):
    """把锚按时间顺序定位到归一化文本流 V。
    返回 (starts, ends, knots, miss)：starts[字符位]＝该处语音起点（同位取最早），
    ends[字符位]＝该处语音止点（同位取最晚）；knots＝两表合并的单调点列，供插值。
    句界／cue 界都按字符位查表，查不到再插值——不能混在一张表里查，否则同一字符位上
    "上一句的止点"会盖掉"下一句的起点"，实测会整体偏早约 0.5s。"""
    starts, ends, cur, miss = {}, {}, 0, []
    for a, b, raw in anchors:
        parts = [p for p in re.split(r'…|——', raw) if norm(p)]
        head = norm(parts[0])
        tail = norm(parts[-1]) if len(parts) > 1 else head
        if len(parts) > 1:
            p0 = V.find(head, cur)
            q = V.find(tail, p0 + len(head)) if p0 >= 0 else -1
            p1 = q + len(tail) if q >= 0 else -1
        else:
            p0 = V.find(head, cur)
            p1 = p0 + len(head)
        if p0 < 0 or p1 < 0:
            miss.append(raw)
            continue
        if p0 not in starts or a < starts[p0]:
            starts[p0] = a
        if p1 not in ends or b > ends[p1]:
            ends[p1] = b
        cur = max(cur, p0)
    knots = sorted(set(list(starts.items()) + list(ends.items())))
    return starts, ends, knots, miss


def knot_lookup(knots, pos, exact=None):
    """字符位置 → 时间。返回 (时间, 是否实测命中)；未命中按相邻 knot 线性插值。
    exact＝starts／ends 表：句起查 starts、句止与 cue 界查 ends。"""
    if exact is not None and pos in exact:
        return exact[pos], True
    if not knots:
        return None, False
    if pos < knots[0][0]:
        return knots[0][1], False
    if pos > knots[-1][0]:
        return knots[-1][1], False
    for i in range(1, len(knots)):
        if knots[i][0] >= pos:
            p0, t0 = knots[i - 1]
            p1, t1 = knots[i]
            if p1 == p0:
                return t1, False
            return t0 + (t1 - t0) * (pos - p0) / (p1 - p0), False
    return knots[-1][1], False


def weight(s):
    """朗读权重：CJK 字 1.0，拉丁/数字串按 0.55/字符（说得更快），空白 0.3。"""
    w = 0.0
    for ch in s:
        if ch.isspace():
            w += 0.3
        elif ord(ch) < 128:
            w += 0.55
        else:
            w += 1.0
    return w


def speech_runs(wav_path):
    """把配音解码成 8kHz 单声道，按 20ms 窗取 RMS，返回语音段 [(起秒, 止秒)]。"""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav_path, '-ac', '1', '-ar', '8000',
                          '-f', 's16le', '-'], capture_output=True).stdout
    if not raw:
        sys.exit('ffmpeg 解码失败：%s' % wav_path)
    smp = array.array('h')
    smp.frombytes(raw)
    sr = 8000
    nwin = int(sr * WIN)
    db = []
    for i in range(0, len(smp) - nwin, nwin):
        acc = 0.0
        for j in range(nwin):
            v = smp[i + j] / 32768.0
            acc += v * v
        r = math.sqrt(acc / nwin)
        db.append(20 * math.log10(r) if r > 1e-9 else -120.0)
    floor = sorted(db)[max(1, int(len(db) * 0.35))]
    thr = max(-45.0, floor + 9.0)
    out, st = [], None
    for k, d in enumerate(db):
        on = d >= thr
        if on and st is None:
            st = k
        elif not on and st is not None:
            out.append([st * WIN, k * WIN])
            st = None
    if st is not None:
        out.append([st * WIN, len(db) * WIN])
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < MERGE_GAP:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return [r for r in merged if r[1] - r[0] >= MIN_SPEECH]


def reanchor(sentences, runs):
    """把句级 VTT 的边界换成按语音实测的边界。sentences＝[(start,end,text)]。"""
    if not runs or len(sentences) < 1:
        return [(s, e) for s, e, _ in sentences]
    speech_total = sum(b - a for a, b in runs)
    cum = []           # 每个语音段的累计语音时间起点
    acc = 0.0
    for a, b in runs:
        cum.append(acc)
        acc += b - a
    gaps = [(runs[k][1] + runs[k + 1][0]) / 2 for k in range(len(runs) - 1)]

    def clock(t_speech):
        """语音时间（只算发声时长）→ 墙上时间。"""
        for k, (a, b) in enumerate(runs):
            if t_speech <= cum[k] + (b - a) or k == len(runs) - 1:
                return a + max(0.0, min(b - a, t_speech - cum[k]))
        return runs[-1][1]

    def snap(t):
        if not gaps:
            return t
        best = min(gaps, key=lambda g: abs(g - t))
        return best if abs(best - t) <= ANCHOR_TOL else t

    ws = [weight(t) for _, _, t in sentences]
    W = sum(ws) or 1.0
    out, acc_w = [], 0.0
    for i, (s, e, t) in enumerate(sentences):
        p0 = speech_total * acc_w / W
        acc_w += ws[i]
        p1 = speech_total * acc_w / W
        st = runs[0][0] if i == 0 else snap(clock(p0))
        en = runs[-1][1] if i == len(sentences) - 1 else snap(clock(p1))
        if en <= st:
            en = clock(p1)
        out.append((st, en))
    return out


def char_len(s):
    """上屏宽度近似：CJK 记 1，拉丁/数字记 0.55（决定单行是否超宽）。"""
    return weight(s)


def split_text(text):
    """按强标点切段，再把超宽段在安全位置二次切分。
    返回 [(chunk, 被剥掉的末尾标点)]；单条上屏时不带末尾标点，合并时还原标点。"""
    parts, buf = [], ''
    for ch in text:
        buf += ch
        if ch in STRONG:
            parts.append(buf)
            buf = ''
    if buf.strip():
        parts.append(buf)
    parts = [p.strip() for p in parts if p.strip()]

    out = []
    for p in parts:
        if char_len(p) <= MAX_CHARS:
            out.append(p)
            continue
        # 二次切：按词/字逐个累加，超过上限就在上一个安全点断开
        cur, piece = '', ''
        pos = 0
        while pos < len(p):
            m = TOKEN.match(p, pos)
            unit = m.group(0) if m else p[pos]
            if char_len(piece + unit) > MAX_CHARS and piece:
                out.append(piece.strip())
                piece = unit
            else:
                piece += unit
            pos += len(unit)
        if piece.strip():
            out.append(piece.strip())
    cleaned = []
    for c in out:
        tail = ''
        while c and c[-1] in STRONG:
            tail = c[-1]
            c = c[:-1].rstrip()
        if c:
            cleaned.append((c, tail))
    return cleaned


def merge_short_forward(cues):
    """读不完的短 cue 向后合并；跨句合并时还原原句标点。"""
    out = []
    i = 0
    while i < len(cues):
        c = dict(cues[i])
        join = joiner(c['text'], c.get('tail', ''))
        while i + 1 < len(cues) and cues[i + 1]['seg'] == c['seg'] \
                and (c['ge'] - c['gs']) / FPS < MIN_DUR \
                and char_len(c['text'] + join + cues[i + 1]['text']) <= MAX_CHARS:
            i += 1
            nxt = cues[i]
            c = dict(c, text=c['text'] + join + nxt['text'], ge=nxt['ge'], join=join)
            c['tail'] = nxt.get('tail', '')
            join = joiner(c['text'], c.get('tail', ''))
        out.append(c)
        i += 1
    return out


def joiner(prev_text, tail):
    """合并两条 cue 时的连接符：有原句标点就还原标点，没有才在拉丁词尾补一个空格。
    （不能"空格＋标点"一起加，实测会写出「iris-3b ，轻量…」这种多余空格。）"""
    if tail:
        return tail
    return ' ' if re.search(r'[A-Za-z0-9]$', prev_text) else ''


def build():
    allc = []
    audit = []
    for path in sorted(glob.glob(os.path.join(ROOT, '02_配音/原始/D0?_原始.vtt'))):
        sid = os.path.basename(path)[:3]
        f0, dur = F0[sid]
        seg_end = f0 + dur
        sents = parse_vtt(path)
        wav = os.path.join(ROOT, '02_配音/采用/%s_配音.wav' % sid)

        # 归一化文字流：句界与 cue 界都表示成这条串上的字符位置，才能查 knot
        bounds, pos = [], 0
        for _, _, t in sents:
            n = len(norm(t))
            bounds.append((pos, pos + n))
            pos += n
        V = ''.join(norm(t) for _, _, t in sents)

        starts = ends = knots = None
        miss = []
        md = glob.glob(os.path.join(ROOT, '05_制作工程/分段/%s_*/src/秒点.ts' % sid))
        if md and not NO_ANCHOR:
            starts, ends, knots, miss = locate(parse_miaodian(md[0]), V)

        # 回退层：语音段＋按权重重锚（秒点锚缺失或某句没贴到锚时用）
        runs = speech_runs(wav) if (os.path.exists(wav) and not NO_REANCHOR) else []
        fb = reanchor(sents, runs) if (runs and not NO_REANCHOR) else [(s, e) for s, e, _ in sents]

        for i, (vs, ve, text) in enumerate(sents):
            p0, p1 = bounds[i]
            st, hit_s = knot_lookup(knots, p0, starts)
            en, hit_e = knot_lookup(knots, p1, ends)
            src = []
            if st is None:
                st, src_s = fb[i][0], '语音段' if runs else 'VTT'
            else:
                src_s = '实测锚' if hit_s else '锚插值'
            if en is None:
                en, src_e = fb[i][1], '语音段' if runs else 'VTT'
            else:
                src_e = '实测锚' if hit_e else '锚插值'
            if en <= st:
                st, en, src_s, src_e = fb[i][0], fb[i][1], '语音段/VTT', '语音段/VTT'
            audit.append([sid, text, vs, ve, st, en, src_s, src_e])
            if miss:
                audit.append([sid, '⚠ 未贴上的锚：%s' % ' ／ '.join(x[:16] for x in miss[:5]),
                              vs, ve, st, en, '-', '-'])
                miss = []

            chunks = split_text(text)
            if not chunks:
                continue
            total_w = sum(weight(c) for c, _ in chunks)
            span = en - st
            t = st
            cpos = p0
            for k, (c, tail) in enumerate(chunks):
                cpos += len(norm(c))
                d = span * weight(c) / total_w
                if k == len(chunks) - 1:
                    t2 = en
                else:
                    # cue 界优先吸附到实测锚（与画面秒点同源），否则按权重比例
                    ta, hit = knot_lookup(knots, cpos, ends)
                    t2 = ta if (hit and st < ta < en) else t + d
                allc.append({'seg': sid, 'text': c, 'tail': tail, 'src': (vs, ve), 's': t, 'e': t2,
                             'f0': f0, 'gs': f0 + round(t * FPS), 'ge': f0 + round(t2 * FPS)})
                t = t2

    # 段内约束：不越段、不重叠、最短时长（不足则与前一条合并）
    fixed = []
    for c in allc:
        f0, dur = F0[c['seg']]
        c['gs'] = max(c['gs'], f0)
        c['ge'] = min(c['ge'], f0 + dur)
        if fixed and fixed[-1]['seg'] == c['seg']:
            if c['gs'] < fixed[-1]['ge']:
                c['gs'] = fixed[-1]['ge']
        if c['ge'] - c['gs'] < 2:
            continue
        # 向前合并只允许发生在同一句内部（跨句向前合并会串台词）；跨句短 cue 由 merge_short_forward 向后合并
        if fixed and (c['ge'] - c['gs']) / FPS < MIN_DUR and fixed[-1]['seg'] == c['seg'] \
                and fixed[-1]['src'] == c['src'] \
                and char_len(fixed[-1]['text']
                             + joiner(fixed[-1]['text'], fixed[-1].get('tail', ''))
                             + c['text']) <= MAX_CHARS:
            join = joiner(fixed[-1]['text'], fixed[-1].get('tail', ''))
            fixed[-1]['text'] = fixed[-1]['text'] + join + c['text']
            fixed[-1]['join'] = join
            fixed[-1]['tail'] = c.get('tail', '')
            fixed[-1]['ge'] = c['ge']
            continue
        fixed.append(c)
    fixed = merge_short_forward(fixed)
    # 最短时长兜底：合并会超宽时改借下一条的时间（同段内挪分界，不串台词、不重叠）
    minf = round(MIN_DUR * FPS)
    for i in range(len(fixed) - 1):
        a, b = fixed[i], fixed[i + 1]
        if a['seg'] != b['seg'] or a['ge'] != b['gs']:
            continue
        need = minf - (a['ge'] - a['gs'])
        if need > 0 and (b['ge'] - b['gs']) - need >= minf:
            a['ge'] += need
            b['gs'] += need
    # 短留白续挂：段内相邻 cue 之间留白 < HOLD_GAP 时把前一条止点拉到后一条起点，让字幕在段内连成一块
    # （页脚只让位一次）；留白 ≥HOLD_GAP 的真空档保留，页脚可回。只动止点不动起点，台词顺序不变。
    for i in range(len(fixed) - 1):
        a, b = fixed[i], fixed[i + 1]
        if a['seg'] == b['seg'] and 0 < b['gs'] - a['ge'] < round(HOLD_GAP * FPS):
            a['ge'] = b['gs']
    return fixed, audit


def srt_time(sec):
    ms = int(round(sec * 1000))
    return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms % 3600000 // 60000, ms % 60000 // 1000, ms % 1000)


def main():
    cues, audit = build()
    out_dir = os.path.join(ROOT, '05_制作工程/字幕')
    os.makedirs(out_dir, exist_ok=True)

    srt, vtt = [], ['WEBVTT', '']
    for i, c in enumerate(cues, 1):
        s0, e0 = c['gs'] / FPS, c['ge'] / FPS
        srt.append('%d\n%s --> %s\n%s\n' % (i, srt_time(s0), srt_time(e0), c['text']))
        vtt.append('%02d:%02d:%02d.%03d --> %02d:%02d:%02d.%03d\n%s\n' % (
            int(s0 // 3600), int(s0 % 3600 // 60), int(s0 % 60), int(round(s0 % 1 * 1000)),
            int(e0 // 3600), int(e0 % 3600 // 60), int(e0 % 60), int(round(e0 % 1 * 1000)), c['text']))
    open(os.path.join(out_dir, '字幕_全片.srt'), 'w', encoding='utf-8').write('\n'.join(srt))
    open(os.path.join(out_dir, '字幕_全片.vtt'), 'w', encoding='utf-8').write('\n'.join(vtt))

    ts = ['// 自动生成：05_制作工程/scripts/字幕切句.py（源＝02_配音/原始/*.vtt ＋ 总装排点 F0）',
          '// 单位＝全片帧号（30fps），区间 [start, end)。不要手改本文件；改字幕规则改脚本后重跑。',
          'export type Cue = { start: number; end: number; text: string; seg: string };',
          'export const SUBTITLE_CUES: Cue[] = [']
    for c in cues:
        ts.append("  {start: %d, end: %d, seg: '%s', text: '%s'}," % (
            c['gs'], c['ge'], c['seg'], c['text'].replace("'", "\\'")))
    ts.append('];')
    ts.append('')
    ts.append('export const cueAt = (frame: number): Cue | undefined =>')
    ts.append('  SUBTITLE_CUES.find((c) => frame >= c.start && frame < c.end);')
    ts.append('')
    open(os.path.join(ROOT, '05_制作工程/remotion-main/src/lib/subtitles.ts'), 'w', encoding='utf-8').write('\n'.join(ts))

    lens = [char_len(c['text']) for c in cues]
    durs = [(c['ge'] - c['gs']) / FPS for c in cues]
    print('cue 总数 %d（原句级 61）' % len(cues))
    print('单行宽度上限实测最大 %.1f（上限 %d）' % (max(lens), MAX_CHARS))
    print('时长 min %.2fs / max %.2fs / 合计 %.1fs' % (min(durs), max(durs), sum(durs)))
    per = {}
    for c in cues:
        per[c['seg']] = per.get(c['seg'], 0) + 1
    print('分段：', ' '.join('%s=%d' % (k, per[k]) for k in sorted(per)))
    print('输出：05_制作工程/字幕/字幕_全片.srt｜.vtt｜remotion-main/src/lib/subtitles.ts')
    if audit:
        print('\n句级重锚审计（VTT → 采用值；来源＝该句界取到的时序层级）')
        worst = 0.0
        for sid, t, s, e, ns, ne, ss, se in audit:
            worst = max(worst, abs(ns - s), abs(ne - e))
            print('  %s VTT %7.3f-%7.3f → 采用 %7.3f-%7.3f  Δ起 %+6.3f Δ止 %+6.3f  起[%s] 止[%s] | %s'
                  % (sid, s, e, ns, ne, ns - s, ne - e, ss, se, t[:26]))
        print('  最大 |Δ| %.3fs（相对 VTT 原值）' % worst)
    else:
        print('\n未做重锚（--no-reanchor）：句级时序全部沿用 VTT 原值')


if __name__ == '__main__':
    main()
