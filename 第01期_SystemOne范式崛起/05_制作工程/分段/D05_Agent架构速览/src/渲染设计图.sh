#!/bin/sh
# 用 headless Chrome 渲染 D05 设计图为 1920×1080 PNG（4 卡速览帧干净版/标注版＋轻量章节行版式样例）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D05_Agent架构速览"
WORK="$BASE/05_制作工程/分段/D05_Agent架构速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：4 卡速览帧关键尺寸 JSON（章节行/卡片文字宽度与溢出标志/网格与页脚盒子）
# 注意：只匹配 pre 输出行（标记后紧跟 JSON 左花括号），避免把 <script> 源码行混入
echo "---- measure（4 卡速览帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_4卡速览帧.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure.json"
cat "$WORK/measure.json"
echo

# 测量：章节行版式样例关键尺寸 JSON
echo "---- measure（章节行） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/章节行_设计图.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure_章节行.json"
cat "$WORK/measure_章节行.json"
echo

# 4 卡速览帧（干净版：4 卡全落停稳终态）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4卡速览帧.png" "file://$DESIGN/设计图_4卡速览帧.html" 2>/dev/null
# 4 卡速览帧（版式＋运动标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4卡速览帧_标注.png" "file://$DESIGN/设计图_4卡速览帧.html#annot" 2>/dev/null
# 轻量章节行版式样例（干净版：章节行进入瞬间，卡片未入场）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/章节行_设计图.png" "file://$DESIGN/章节行_设计图.html" 2>/dev/null
# 轻量章节行版式样例（版式参数标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/章节行_设计图_标注.png" "file://$DESIGN/章节行_设计图.html#annot" 2>/dev/null

echo "done"
