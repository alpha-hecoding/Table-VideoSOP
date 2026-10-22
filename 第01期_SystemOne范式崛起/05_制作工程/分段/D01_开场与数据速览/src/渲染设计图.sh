#!/bin/sh
# 用 headless Chrome 渲染 D01 设计图为 1920×1080 PNG
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D01_开场与数据速览"
WORK="$BASE/05_制作工程/分段/D01_开场与数据速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：输出关键尺寸 JSON（芯片行宽度、卡片文字溢出检查）
echo "---- measure ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_design.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON.*END_JSON' | sed 's/MEASURE_JSON//; s/END_JSON//' > "$WORK/measure.json"
cat "$WORK/measure.json"
echo

# 终帧（干净版，供与候选A 比对）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_终帧.png" "file://$DESIGN/设计图_design.html" 2>/dev/null
# 终帧（标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_终帧_标注.png" "file://$DESIGN/设计图_design.html#annot" 2>/dev/null
# 标题帧（干净版，系列开场帧模板）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_标题帧.png" "file://$DESIGN/标题帧_design.html" 2>/dev/null
# 标题帧（标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_标题帧_标注.png" "file://$DESIGN/标题帧_design.html#annot" 2>/dev/null

echo "done"
