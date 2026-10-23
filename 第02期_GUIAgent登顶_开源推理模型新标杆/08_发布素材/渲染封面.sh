#!/bin/sh
# 渲染第02期封面（1920×1200，B站 16:10）：无头 Chrome 出干净 PNG＋几何测量 JSON。
# 用法：sh 渲染封面.sh
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第02期_GUIAgent登顶_开源推理模型新标杆/08_发布素材"
SRC="$BASE/封面_候选A_16x10.html"

CHROME_ARGS="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1200"

google-chrome $CHROME_ARGS --screenshot="$BASE/封面_候选A_16x10.png" "file://$SRC" 2>/dev/null
google-chrome $CHROME_ARGS --dump-dom "file://$SRC#measure" 2>/dev/null \
  | grep -o 'MEASURE_JSON.*END_JSON' | head -1 | sed 's/MEASURE_JSON//; s/END_JSON//' > "$BASE/_measure.json"

identify "$BASE/封面_候选A_16x10.png"
du -h "$BASE/封面_候选A_16x10.png"
echo "measure → $BASE/_measure.json"
