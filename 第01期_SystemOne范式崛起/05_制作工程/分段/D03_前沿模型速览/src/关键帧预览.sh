#!/bin/sh
# D03 关键帧轻预览：用主工程注册的 D03 槽位抽 still（局部帧），不整段重渲染（整段渲染归总控）。
# 用法：sh 关键帧预览.sh [帧号列表，逗号分隔]；默认＝接入说明「已实现事件帧」里挑出的 13 帧
#   （f470 已于 2026-10-20 的 U1 抽查重渲过，不在默认列表内，需要时显式传入）。
# 输出：段目录 _work/预览_fNN.png（Remotion 每次调用都要重新打包，故按帧循环）。
set -e

BASE="/data/work/code/github/alpha-hecoding/Table-VideoSOP/第01期_SystemOne范式崛起/05_制作工程"
SEG="$BASE/分段/D03_前沿模型速览"
WORK="$SEG/_work"

# f30 段首承接（顶栏／kicker 恒定，无入场）／f160 h1 入场中（147–167）／f230 定位语入场（221–235）
# f470 标题块停稳读（426–610，↔设计图_LFM2.5帧；本轮不重跑）
# f700 对比表行 2 已成立（行 2 在 640–654，行 3 未入）／f900 对比表停稳高潮（804–984，↔设计图_LFM2.5对比表）
# f990 T1 帧收敛中（984–996）／f1000 Qwen 帧 h1 入场初（S5 起 f998）
# f1350 Qwen 帧停稳（1346–1466，↔设计图_Qwen帧）／f1500 Muse 帧入场中（日期≈f1500）
# f1720 Muse 帧停稳（1708–2022，↔设计图_Muse_Wonder帧）／f2150 Argon 帧入场中（芯片 2120–2136 后）
# f2230 Argon 帧停稳终态（2214–2246，↔设计图_Argon帧）／f2262 Z1 收画面末帧（只剩顶栏＋页脚）
FRAMES="${1:-30,160,230,700,900,990,1000,1350,1500,1720,2150,2230,2262}"

mkdir -p "$WORK"

# Remotion 的 still 每次调用都要重新打包，故按帧循环；每批并发 3，避免同时开太多 headless 浏览器。
i=0
for fr in $(echo "$FRAMES" | tr ',' ' '); do
  (
    cd "$BASE/remotion-main"
    npx remotion still D03 "$WORK/_tmp_f$fr.png" --frame="$fr" >/dev/null 2>&1
    mv "$WORK/_tmp_f$fr.png" "$WORK/预览_f$fr.png"
    echo "ok f$fr"
  ) &
  i=$((i + 1))
  if [ "$((i % 3))" -eq 0 ]; then wait; fi
done
wait
echo "done"
