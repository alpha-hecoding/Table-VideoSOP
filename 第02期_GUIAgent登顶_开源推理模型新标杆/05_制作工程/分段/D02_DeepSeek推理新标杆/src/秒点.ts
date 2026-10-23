// D02 秒点表 · AI情报 第02期（30fps，局部帧 0＝本段首帧，总长 1510f）
// 依据：02_配音/采用/D02_配音.wav 真实音频与 silence 检测

export const EV = {
  // A 顶部身份区
  chapLine: 6,
  identityCard: 18,

  // B 左侧面板：763B 巨量 MoE 架构
  leftPanelEnter: 240,
  leftChip1: 280,
  leftChip2: 340,
  card763bEnter: 400,
  card763bCount: 420,

  // C 社区数据指标
  metricsEnter: 600,
  metricDlCount: 620,
  metricLikeCount: 650,

  // D 右侧面板：FP8 社区突破
  rightPanelEnter: 790,
  rightChip1: 830,
  rightChip2: 890,

  // E 单卡部署门槛高潮（35.4s 起，对应 f1062）
  deployCardEnter: 1060,
  deployHot: 1140, // 换态＋脉冲：单卡 4090/A100 绿色/橙色确认
  clusterCompare: 1220, // 集群 vs 单卡对比

  // F 终态停稳
  settle: 1400,
  last: 1509,
} as const;
