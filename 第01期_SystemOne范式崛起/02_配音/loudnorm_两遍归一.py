#!/usr/bin/python3
# 两遍 loudnorm 归一：原始 mp3 → 采用 wav（48kHz 立体声）
# 目标：I=-14 LUFS，TP=-1 dBTP，LRA=11（B站常用目标；改目标只改下面常量）
# 注：edge-tts 原始电平低、峰值余量大，线性增益会超真峰，loudnorm 自动转动态模式；
#     人声 LRA 小，动态模式影响可接受，归一后用 ebur128 复核实际值。
import json, re, subprocess, sys, pathlib

TARGET = dict(I="-14", TP="-1", LRA="11")
BASE = pathlib.Path(__file__).resolve().parent
SEGS = [f"D0{i}" for i in range(1, 10)]

def measure(src: pathlib.Path) -> dict:
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(src),
         "-af", f"loudnorm=I={TARGET['I']}:TP={TARGET['TP']}:LRA={TARGET['LRA']}:print_format=json",
         "-f", "null", "-"],
        capture_output=True, text=True)
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p.stderr)
    if not m:
        raise RuntimeError(f"未取到测量值: {src}\n{p.stderr[-400:]}")
    return json.loads(m.group(0))

def normalize(src: pathlib.Path, dst: pathlib.Path, m: dict):
    af = (f"loudnorm=I={TARGET['I']}:TP={TARGET['TP']}:LRA={TARGET['LRA']}"
          f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
          f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
          f":offset={m.get('target_offset', '0')}:linear=false")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(src),
         "-af", af, "-ar", "48000", "-ac", "2", str(dst)], check=True)

for s in SEGS:
    src = BASE / "原始" / f"{s}_原始.mp3"
    dst = BASE / "采用" / f"{s}_配音.wav"
    m = measure(src)
    normalize(src, dst, m)
    print(f"{s}: 原始 {m['input_i']} LUFS → 目标 {TARGET['I']} LUFS（线性增益）")
