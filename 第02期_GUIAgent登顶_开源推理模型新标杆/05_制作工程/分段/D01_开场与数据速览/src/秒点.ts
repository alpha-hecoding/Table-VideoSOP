// D01 秒点表 · AI情报 第02期（30fps，局部帧 0＝本段首帧，总长 1328f）
// 依据：02_配音/采用/D01_配音.wav 真实音频与 silence 检测

export const EV = {
  // A 标题块
  kicker: 6,
  h1: 14,
  underline: 24,
  sub: 32,

  // B 看点芯片（随配音关键词推进入场）
  chip1: 180, // GUI Agent 架构全模态聚焦
  chip2: 490, // 开源推理标杆 DeepSeek 763B
  chip3: 660, // 单卡消费级显卡可跑

  // C 页脚（进入数据大盘前）
  footer: 720,

  // D 数据卡组（6 张卡，2 行 × 3 列）
  // Row 1: 学术论文
  card1Enter: 815,
  card1Count: 830, // 321 篇
  card2Enter: 960,
  card2Count: 975, // 249 篇
  card3Enter: 1035,
  card3Count: 1045, // 159 篇

  // Row 2: 顶会与重磅模型
  card4Enter: 1080,
  card4Count: 1095, // NeurIPS 9000+
  card5Enter: 1145,
  card5Count: 1155, // HF Top 1 224 票
  card5Accent: 1215, // 换态＋脉冲
  card6Enter: 1200,
  card6Count: 1210, // HF 下载榜首 42.1K
  card6Accent: 1265, // 换态＋脉冲

  // E 终态
  settle: 1270,
  last: 1327,
} as const;
