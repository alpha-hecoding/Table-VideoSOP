#!/bin/sh
# 用 headless Chrome 渲染 D08 设计图为 1920×1080 PNG（5 卡终态／标注版／强调态切换前中间态）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D08_值得深读速览"
WORK="$BASE/05_制作工程/分段/D08_值得深读速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：5 卡速览帧关键尺寸 JSON（行盒/卡盒/文字宽度与溢出标志/安全区自检）
# 注意：只匹配 pre 输出行（标记后紧跟 JSON 左花括号），避免把 <script> 源码行混入
echo "---- measure（5 卡速览帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_5卡速览帧.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure.json"
cat "$WORK/measure.json"
echo

# 5 卡速览帧（干净版：5 卡全落＋卡 4 强调态＋芯片的终态）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5卡速览帧.png" "file://$DESIGN/设计图_5卡速览帧.html" 2>/dev/null
# 5 卡速览帧（定稿出处＋入场帧＋约束标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5卡速览帧_标注.png" "file://$DESIGN/设计图_5卡速览帧.html#annot" 2>/dev/null
# 5 卡速览帧（强调态切换前中间态：卡 4 默认态、芯片未出现）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5卡速览帧_强调态切换前.png" "file://$DESIGN/设计图_5卡速览帧.html#pre" 2>/dev/null
# 5 卡速览帧（候选·未确认：芯片切 result-label 语言）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5卡速览帧_芯片强调态候选.png" "file://$DESIGN/设计图_5卡速览帧.html#chipalt" 2>/dev/null
# 5 卡速览帧（候选·未确认：上 3 下 2 布局，强调卡卡盒更宽）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5卡速览帧_上3下2候选.png" "file://$DESIGN/设计图_5卡速览帧.html#alt" 2>/dev/null

echo "done"
