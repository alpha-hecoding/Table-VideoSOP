#!/bin/sh
# 用 headless Chrome 渲染 D03 设计图为 1920×1080 PNG（同 D01/D02 渲染方式）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D03_前沿模型速览"
WORK="$BASE/05_制作工程/分段/D03_前沿模型速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：各帧关键尺寸 JSON（标题块/芯片行/对比表行溢出与安全区核对）
echo "---- measure ----"
for f in "设计图_LFM2.5帧" "设计图_LFM2.5对比表" "设计图_Qwen帧" "设计图_Muse_Wonder帧" "设计图_Argon帧"; do
  out="$WORK/measure_${f#设计图_}.json"
  google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/$f.html#measure" 2>/dev/null \
    | grep -o 'MEASURE_JSON.*END_JSON' | sed 's/MEASURE_JSON//; s/END_JSON//' > "$out"
  echo "== $f =="
  cat "$out"; echo
done

# 五张设计图（4 个模型帧，LFM2.5 帧含初始态与对比表态）：干净版＋标注版
for f in "设计图_LFM2.5帧" "设计图_LFM2.5对比表" "设计图_Qwen帧" "设计图_Muse_Wonder帧" "设计图_Argon帧"; do
  google-chrome $CHROME_ARGS --screenshot="$DESIGN/$f.png" "file://$DESIGN/$f.html" 2>/dev/null
  google-chrome $CHROME_ARGS --screenshot="$DESIGN/${f}_标注.png" "file://$DESIGN/$f.html#annot" 2>/dev/null
done

echo "done"
