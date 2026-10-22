# D04 配音词组边界（局部帧）：把 02_配音/采用/D04_配音.wav 解码为 8kHz 单声道，按 20ms 窗取 RMS，
# 输出语音段（起/止秒、局部帧、时长）。用途＝秒点重排时定位词组边界（源 VTT 只有句级，且 D04 第 3 句
# 的 VTT 止点与音频实测差约 2.6s，见接入说明「需总控处理」）。纯标准库＋ffmpeg 管道，不写文件。
import array
import math
import subprocess
import sys

WAV = "/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/02_配音/采用/D04_配音.wav"
FPS = 30
WIN = 0.02  # 窗长（秒）
MIN_SPEECH = 0.10  # 短于此的语音段忽略
MIN_GAP = 0.08  # 短于此的间隙不切分

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", WAV, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
    capture_output=True,
).stdout
if not raw:
    sys.exit("ffmpeg 解码失败")
smp = array.array("h")
smp.frombytes(raw)
sr = 8000
nwin = int(sr * WIN)

rms = []
for i in range(0, len(smp) - nwin, nwin):
    acc = 0
    for j in range(nwin):
        v = smp[i + j] / 32768.0
        acc += v * v
    rms.append(math.sqrt(acc / nwin))

db = [20 * math.log10(v) if v > 1e-9 else -120.0 for v in rms]
floor = sorted(db)[max(1, int(len(db) * 0.35))]  # 噪声底（约 35 分位）
thr = max(-45.0, floor + 9.0)

runs = []
start = None
for k, d in enumerate(db):
    on = d >= thr
    if on and start is None:
        start = k
    elif not on and start is not None:
        runs.append([start, k])
        start = None
if start is not None:
    runs.append([start, len(db)])

# 合并被短间隙切开的语音
merged = []
for r in runs:
    if merged and (r[0] - merged[-1][1]) * WIN < MIN_GAP:
        merged[-1][1] = r[1]
    else:
        merged.append(r)
merged = [r for r in merged if (r[1] - r[0]) * WIN >= MIN_SPEECH]

print(f"# 阈值 {thr:.1f} dBFS（噪声底约 {floor:.1f}） 窗 {WIN}s")
for a, b in merged:
    s, e = a * WIN, b * WIN
    print(f"{s:7.3f}-{e:7.3f}s  f{int(round(s*FPS)):>4}-{int(round(e*FPS)):>4}  {(e-s):5.3f}s")
