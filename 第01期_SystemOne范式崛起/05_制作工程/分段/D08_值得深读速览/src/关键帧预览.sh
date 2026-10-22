#!/bin/sh
# D08 关键帧轻预览：用主工程注册的 D08 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝本段秒点表里的关键事件帧。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D08_值得深读速览"
WORK="$SEG/_work"

# f20 页脚生长中／f74 章节行收齐·卡未入场／f134 卡1 入场中／f142 卡1 收齐／f447 卡2 收齐／f794 卡3 收齐
# f1038 卡4 收齐仍默认态（＝设计图 强调态切换前.png）／f1125 离散换态帧（芯片未出现）／f1193 芯片收齐（卡 5 未入场）
# f1420 卡5 收齐＝全帧终态（＝设计图 5卡速览帧.png）／f1603 本段末帧（5 卡停稳、卡 4 强调态留焦点，交 D09）
FRAMES="${1:-20,74,134,142,447,794,1038,1125,1193,1420,1603}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D08 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
