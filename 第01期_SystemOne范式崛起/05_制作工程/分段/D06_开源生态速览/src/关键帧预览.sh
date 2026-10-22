#!/bin/sh
# D06 关键帧轻预览：用主工程注册的 D06 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝本段秒点表里的关键事件帧。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D06_开源生态速览"
WORK="$SEG/_work"

# f20 页脚生长中／f80 章节行收齐·格未入场／f152 格1 收齐（强调态＋★）／f393 格2 收齐／f482 格3 收齐
# f726 格4 收齐（剧本"初始：第一行 4 格"）／f939 格5 收齐（第二行起）／f1129 格6 收齐／f1290 格7 收齐
# f1418 格8 收齐（8 格全满，终态起点）／f1659 本段末帧（8 格停稳＋格1 留焦点，尾部收画面交 D07）
FRAMES="${1:-20,80,152,393,482,726,939,1129,1290,1418,1659}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D06 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
