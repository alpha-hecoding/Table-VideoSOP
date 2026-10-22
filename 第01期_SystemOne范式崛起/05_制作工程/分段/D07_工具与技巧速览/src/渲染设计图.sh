#!/bin/sh
# 用 headless Chrome 渲染 D07 设计图为 1920×1080 PNG（5 行清单帧：终态／标注／子芯片入场前／强调态候选）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D07_工具与技巧速览"
WORK="$BASE/05_制作工程/分段/D07_工具与技巧速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：5 行清单帧关键尺寸 JSON（安全区／行盒／名称与要点溢出标志／子芯片行宽）
# 注意：只匹配 pre 输出行（标记后紧跟 JSON 左花括号），避免把 <script> 源码行混入
echo "---- measure（5 行清单帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_5行清单帧.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure.json"
cat "$WORK/measure.json"
echo

# 终态（5 行全落＋子芯片已出现，本段停稳帧）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5行清单帧.png" "file://$DESIGN/设计图_5行清单帧.html" 2>/dev/null
# 标注版（定稿出处＋入场帧＋版式与焦点纪律）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5行清单帧_标注.png" "file://$DESIGN/设计图_5行清单帧.html#annot" 2>/dev/null
# 子芯片入场瞬间（行 1 高度已预留 → 版式不跳；对应局部 6–22f）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5行清单帧_子芯片入场前.png" "file://$DESIGN/设计图_5行清单帧.html#pre" 2>/dev/null
# 候选（未确认）：4 步子芯片切强调态，交用户拍板
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_5行清单帧_子芯片强调态候选.png" "file://$DESIGN/设计图_5行清单帧.html#emph" 2>/dev/null

echo "done"
