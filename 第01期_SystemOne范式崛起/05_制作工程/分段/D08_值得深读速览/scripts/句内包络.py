# D08 句内包络细看：在指定秒区间内逐 20ms 窗打印 dBFS，用于确认词组起点落在哪个实测间隙。
# 用法：/usr/bin/python3 句内包络.py 起始秒 结束秒［更多区间…］
# 方法同 词组边界.py（同一套解码与窗长），只是不切段、直接看包络，避免高阈值把词内切开的误判。
import array
import math
import subprocess
import sys

WAV = "/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/02_配音/采用/D08_配音.wav"
FPS = 30
WIN = 0.02

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


def db_at(k: int) -> float:
    acc = 0.0
    for j in range(nwin):
        v = smp[k * nwin + j] / 32768.0
        acc += v * v
    return 20 * math.log10(math.sqrt(acc / nwin)) if acc > 1e-18 else -120.0


args = [float(a) for a in sys.argv[1:]]
if len(args) < 2 or len(args) % 2:
    sys.exit("用法：句内包络.py 起始秒 结束秒［更多区间…］")

for i in range(0, len(args), 2):
    a, b = args[i], args[i + 1]
    print(f"# {a:.3f}-{b:.3f}s | f{int(round(a*FPS))}-{int(round(b*FPS))}")
    line = []
    nwin_total = int(len(smp) / nwin)
    for k in range(int(a / WIN), min(int(b / WIN), nwin_total)):
        d = db_at(k)
        mark = "#" if d >= -30 else ("+" if d >= -40 else ".")
        line.append(f"f{int(round(k*WIN*FPS)):4d}{mark}{d:6.1f}")
        if len(line) == 5:
            print("  ".join(line))
            line = []
    if line:
        print("  ".join(line))
