#!/bin/sh
# 用 headless Chrome 渲染 D09 设计图为 1920×1080 PNG（三态：必读卡组帧／金句帧／片尾卡）
# 用法：sh 渲染设计图.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起"
DESIGN="$BASE/03_视觉设计/D09_收尾学习建议与金句"
WORK="$BASE/05_制作工程/分段/D09_收尾学习建议与金句/_work"

mkdir -p "$WORK"

# --user-data-dir：本段专用 Chrome profile（_work 内，可弃），避免与并行的其他分段渲染共用默认 profile
#   ——共用时偶发启动失败并写出空 PNG/空 measure
PROFILE="$WORK/.chrome-profile"
CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --user-data-dir=$PROFILE"

measure() {
  # $1=html $2=输出 json
  # 只取 pre 里的 JSON（'MEASURE_JSON{'）；DOM 里脚本源码也含该标记，用 '{' 与 '}END_JSON' 卡死边界
  google-chrome $CHROME_ARGS --dump-dom "file://$1#measure" 2>/dev/null \
    | grep -o 'MEASURE_JSON{.*}END_JSON' | sed 's/^MEASURE_JSON//; s/END_JSON$//' > "$2"
  echo "---- $2 ----"
  cat "$2"
  echo
}

shot() {
  # $1=输出 png $2=html $3=hash（可空）
  google-chrome $CHROME_ARGS --screenshot="$1" "file://$2$3" 2>/dev/null
}

# 测量：三帧关键尺寸、真实文字宽、溢出标志、安全区自检
measure "$DESIGN/设计图_必读卡组帧.html" "$WORK/measure_必读卡组帧.json"
measure "$DESIGN/设计图_金句帧.html" "$WORK/measure_金句帧.json"
measure "$DESIGN/设计图_片尾卡.html" "$WORK/measure_片尾卡.json"

# 帧一：必读 3 卡＋动手实践芯片（终态／标注／候选）
shot "$DESIGN/设计图_必读卡组帧.png" "$DESIGN/设计图_必读卡组帧.html" ""
shot "$DESIGN/设计图_必读卡组帧_标注.png" "$DESIGN/设计图_必读卡组帧.html" "#annot"
shot "$DESIGN/设计图_必读卡组帧_关注方向候选.png" "$DESIGN/设计图_必读卡组帧.html" "#alt"

# 帧二：金句帧（终态／标注／解读入场前中间态／文字居中候选）
shot "$DESIGN/设计图_金句帧.png" "$DESIGN/设计图_金句帧.html" ""
shot "$DESIGN/设计图_金句帧_标注.png" "$DESIGN/设计图_金句帧.html" "#annot"
shot "$DESIGN/设计图_金句帧_解读入场前.png" "$DESIGN/设计图_金句帧.html" "#pre"
shot "$DESIGN/设计图_金句帧_居中对齐候选.png" "$DESIGN/设计图_金句帧.html" "#center"

# 帧三：片尾卡（终态／标注／带页脚候选）
shot "$DESIGN/设计图_片尾卡.png" "$DESIGN/设计图_片尾卡.html" ""
shot "$DESIGN/设计图_片尾卡_标注.png" "$DESIGN/设计图_片尾卡.html" "#annot"
shot "$DESIGN/设计图_片尾卡_带页脚候选.png" "$DESIGN/设计图_片尾卡.html" "#foot"

echo "done"
