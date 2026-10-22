#!/bin/sh
# 用 headless Chrome 渲染 D06 设计图为 1920×1080 PNG
# 两版布局候选（重点审查 R3，用户在设计图阶段拍板）：8 格一次上屏 ／ 4+4 拆两帧
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D06_开源生态速览"
WORK="$BASE/05_制作工程/分段/D06_开源生态速览/_work"

mkdir -p "$WORK"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080"

# 测量：格盒/行盒/真实文字宽与溢出标志/安全区自检
# 注意：只匹配 pre 输出行（标记后紧跟 JSON 左花括号），避免把 <script> 源码行混入
echo "---- measure（候选A：8 格一次上屏） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_8格网格帧.html#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure_8格网格帧.json"
grep -E '"(name|point|innerW|nameW|dataW|pointW|nameOverflow|dataOverflow|pointOverflow|gridBottom|footBottom|frameScrollOverflow)"' "$WORK/measure_8格网格帧.json" | head -60
echo
echo "---- measure（候选B：4+4 拆两帧·第一帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_4加4拆两帧.html#measure1" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure_4加4第一帧.json"
grep -E '"(name|point|innerW|nameW|dataW|pointW|nameOverflow|dataOverflow|pointOverflow|gridBottom|footBottom|frameScrollOverflow)"' "$WORK/measure_4加4第一帧.json" | head -40
echo
echo "---- measure（候选B：4+4 拆两帧·第二帧） ----"
google-chrome $CHROME_ARGS --dump-dom "file://$DESIGN/设计图_4加4拆两帧.html#measure2" 2>/dev/null \
  | grep -o 'MEASURE_JSON{.*END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' | /usr/bin/python3 -m json.tool > "$WORK/measure_4加4第二帧.json"
grep -E '"(name|point|innerW|nameW|dataW|pointW|nameOverflow|dataOverflow|pointOverflow|text|hot|w|gridBottom|footBottom|frameScrollOverflow)"' "$WORK/measure_4加4第二帧.json" | head -60
echo

# 候选A：8 格一次上屏（终态：8 格全落＋格 1 强调态＋★）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_8格网格帧.png" "file://$DESIGN/设计图_8格网格帧.html" 2>/dev/null
# 候选A（定稿出处＋入场帧＋约束标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_8格网格帧_标注.png" "file://$DESIGN/设计图_8格网格帧.html#annot" 2>/dev/null
# 候选A（中间态：剧本"初始：第一行 4 格"，第二行未入场）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_8格网格帧_第一行四格.png" "file://$DESIGN/设计图_8格网格帧.html#row1" 2>/dev/null
# 候选A（候选·未确认：强调态延后到末格落定后）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_8格网格帧_强调态延后候选.png" "file://$DESIGN/设计图_8格网格帧.html#late" 2>/dev/null

# 候选B：4+4 拆两帧·第一帧（§3.1–3.4，格 1 强调态＋★）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4加4拆两帧_第一帧.png" "file://$DESIGN/设计图_4加4拆两帧.html" 2>/dev/null
# 候选B·第一帧（标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4加4拆两帧_第一帧_标注.png" "file://$DESIGN/设计图_4加4拆两帧.html#annot" 2>/dev/null
# 候选B·第二帧（§3.5–3.8＋已读芯片行，星标芯片保持强调态）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4加4拆两帧_第二帧.png" "file://$DESIGN/设计图_4加4拆两帧.html#f2" 2>/dev/null
# 候选B·第二帧（标注版）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4加4拆两帧_第二帧_标注.png" "file://$DESIGN/设计图_4加4拆两帧.html#annot2" 2>/dev/null
# 候选B·第二帧（候选·未确认：不带已读芯片行）
google-chrome $CHROME_ARGS --screenshot="$DESIGN/设计图_4加4拆两帧_第二帧_无芯片行候选.png" "file://$DESIGN/设计图_4加4拆两帧.html#f2plain" 2>/dev/null

echo "done"
