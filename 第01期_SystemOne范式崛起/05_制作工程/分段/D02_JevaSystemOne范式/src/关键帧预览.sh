#!/bin/sh
# D02 关键帧轻预览：用主工程注册的 D02 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝接入说明「已实现事件帧」里挑出的 12 帧。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D02_JevaSystemOne范式"
WORK="$SEG/_work"

# f30 kicker 入场中／f140 h1 入场中／f230 标题块收齐（↔设计图_论文身份帧）／f330 面板入场中
# f470 感知节点就位／f545 路径绘完／f590 左点接触换态（↔设计图_双路对比帧）／f610 右点到达
# f800 架构芯片收齐（中段静区）／f1100 卡2 计数中／f1210 三卡收齐后／f1281 本段末帧（↔设计图_数据卡组）
FRAMES="${1:-30,140,230,330,470,545,590,610,800,1100,1210,1281}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D02 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
