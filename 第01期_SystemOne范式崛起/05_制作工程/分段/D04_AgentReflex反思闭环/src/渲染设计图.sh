#!/bin/sh
# 用 headless Chrome 渲染 D04 设计图为 1920×1080 PNG（内容帧终态/中间态/标注版＋章卡）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D04_AgentReflex反思闭环"
WORK="$BASE/05_制作工程/分段/D04_AgentReflex反思闭环/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：内容帧关键尺寸 JSON（身份卡/节点文字/回环线 bbox/数据卡溢出）
echo "---- measure（内容帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_design.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON.*END_JSON' | sed 's/MEASURE_JSON//; s/END_JSON//' > "$WORK/measure.json"
cat "$WORK/measure.json"
echo

# 测量：章卡关键尺寸 JSON
echo "---- measure（章卡） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/章卡_design.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON.*END_JSON' | sed 's/MEASURE_JSON//; s/END_JSON//' > "$WORK/measure_章卡.json"
cat "$WORK/measure_章卡.json"
echo

# 内容帧终态（干净版：闭环闭合＋数据卡停稳）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_闭环终态.png" "file://$DESIGN/设计图_design.html" 2>/dev/null
# 内容帧终态（布局与运动标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_闭环终态_标注.png" "file://$DESIGN/设计图_design.html#annot" 2>/dev/null
# 圆点推进中间态（圆点至反思模块；策略更新/回环线/数据卡未出现）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_圆点推进态.png" "file://$DESIGN/设计图_design.html#dot" 2>/dev/null
# 章卡（干净版，分隔卡首现）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/章卡_设计图.png" "file://$DESIGN/章卡_design.html" 2>/dev/null
# 章卡（版式参数标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/章卡_设计图_标注.png" "file://$DESIGN/章卡_design.html#annot" 2>/dev/null

echo "done"
