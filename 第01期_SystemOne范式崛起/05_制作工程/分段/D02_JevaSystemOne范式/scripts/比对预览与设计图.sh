#!/bin/sh
# D02 预览帧 ↔ 已确认设计图：几何扫描（对比设计图.py）＋全图差值图＋分带差值图＋SSIM／PSNR。
# 用法：sh scripts/比对预览与设计图.sh <预览png> <设计图png> <输出前缀> [带 y:高 ...]
#   带参数例：390:410 ＝ 从 y390 起高 410 的横带，另出 <前缀>_带N_diff.png。
# 输出：段目录 _work/<前缀>_diff.png、<前缀>_带N_diff.png；几何与指标打到 stdout。
set -e

SEG="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程/分段/D02_JevaSystemOne范式"
WORK="$SEG/_work"
PREV="$1"
REF="$2"
OUT="$3"
shift 3

mkdir -p "$WORK"

# 1) 几何与颜色角色扫描（纯标准库，输入 rgb24 PPM）
ffmpeg -y -loglevel error -i "$PREV" -f image2 -c:v ppm "$WORK/_ppm_prev.ppm"
ffmpeg -y -loglevel error -i "$REF" -f image2 -c:v ppm "$WORK/_ppm_ref.ppm"
/usr/bin/python3 "$SEG/scripts/对比设计图.py" "$WORK/_ppm_prev.ppm" "$WORK/_ppm_ref.ppm"

# 2) 全图差值图＋SSIM／PSNR
ffmpeg -y -loglevel error -i "$PREV" -i "$REF" -filter_complex "blend=all_mode=difference" "$WORK/${OUT}_diff.png"
ffmpeg -loglevel info -i "$PREV" -i "$REF" -lavfi "[0:v][1:v]ssim" -f null - 2>&1 | grep -o 'SSIM R:.*' | tail -1
ffmpeg -loglevel info -i "$PREV" -i "$REF" -lavfi "[0:v][1:v]psnr" -f null - 2>&1 | grep -o 'average:[A-Za-z0-9.]*' | tail -1

# 3) 分带差值图（定位残差落在哪一带）
n=0
for band in "$@"; do
  n=$((n + 1))
  ffmpeg -y -loglevel error -i "$PREV" -i "$REF" \
    -filter_complex "blend=all_mode=difference,crop=in_w:${band#*:}:0:${band%%:*}" \
    "$WORK/${OUT}_带${n}_diff.png"
  ffmpeg -loglevel info -i "$PREV" -i "$REF" \
    -lavfi "crop=in_w:${band#*:}:0:${band%%:*}[a];crop=in_w:${band#*:}:0:${band%%:*}[b];[a][b]ssim" -f null - 2>&1 \
    | grep -o 'SSIM R:.*' | tail -1 | sed "s/^/带 $band /"
done
echo "done -> $WORK/${OUT}_diff.png"
