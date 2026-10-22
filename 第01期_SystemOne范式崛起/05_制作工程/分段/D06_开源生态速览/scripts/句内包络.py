# D06 句内包络：逐 20ms 窗打印 dBFS，用于确认词组起点落在哪个实测间隙（句内词点，VTT 只有句级时用）。
# 用法：/usr/bin/python3 scripts/句内包络.py <起秒> <止秒>
# 方法同 D08 段内同名脚本；纯标准库＋ffmpeg 管道，不写文件。
import array
import math
import subprocess
import sys

WAV = "/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/02_配音/采用/D06_配音.wav"
FPS = 30
WIN = 0.02

t0 = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
t1 = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", WAV, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
    capture_output=True,
).stdout
if not raw:
    sys.exit("ffmpeg 解码失败")
smp = array.array("h")
smp.frombytes(raw)
nwin = int(8000 * WIN)

prev = None
for i in range(0, (len(smp) - nwin) // nwin):
    s = i * WIN
    if s < t0:
        continue
    if s > t1:
        break
    acc = 0
    for j in range(nwin):
        v = smp[i * nwin + j] / 32768.0
        acc += v * v
    db = 20 * math.log10(math.sqrt(acc / nwin)) if acc > 1e-12 else -120.0
    on = db >= -30.0
    if on != prev:
        print(f"{s:7.3f}s f{int(round(s*FPS)):5d} {'语音起' if on else '间隙止'}  {db:6.1f} dBFS")
        prev = on
