#!/bin/sh
# D09 关键帧轻预览：用主工程注册的 D09 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝本段秒点表里的关键事件帧。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D09_收尾学习建议与金句"
WORK="$SEG/_work"

# 帧一：f20 页脚生长中／f104 章节行收齐·卡未入场／f203 卡1 收齐（芯片未出）／f225 卡1 时长芯片收齐
#   f286 卡2 收齐／f393 卡3 收齐／f450 实践标签收齐·芯片未出／f494 实践芯片1 收齐／f579 芯片2 收齐
#   f658 芯片3 收齐＝帧一终态／f781 帧一末帧（停稳 124f，交硬切）
# 帧二：f798 kicker 收齐／f872 金句两行收齐（出处入场中）／f900 出处落稳·解读入场中（中间态对照）／f905 解读收齐＝金句帧终态
#   f1045 帧二末帧（阅读停稳 141f）
# 帧三：f1089 标题块四件＋预告芯片1 收齐／f1139 芯片2 收齐／f1224 芯片3 收齐＝片尾终态／f1350 本段末帧（停稳 127f→全片结束）
FRAMES="${1:-20,104,203,225,286,393,450,494,579,658,781,798,872,900,905,1045,1089,1139,1224,1350}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D09 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
