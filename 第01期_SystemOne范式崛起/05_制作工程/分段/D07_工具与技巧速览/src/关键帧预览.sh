#!/bin/sh
# D07 关键帧轻预览：用主工程注册的 D07 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝本段秒点表里的关键事件帧。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D07_工具与技巧速览"
WORK="$SEG/_work"

# f40 页脚生长中／f80 章节行收齐·行未入场／f160 行1 入场中／f175 行1 收齐·子芯片未入场
# f215 子芯片1 入场中／f368 4 步子芯片收齐／f482 行2 收齐／f699 行3 收齐／f946 行4 收齐
# f1203 行5 收齐（终态起点）／f1428 本段末帧（5 行停稳，交 D08）
FRAMES="${1:-40,80,160,175,215,368,482,699,946,1203,1428}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D07 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
