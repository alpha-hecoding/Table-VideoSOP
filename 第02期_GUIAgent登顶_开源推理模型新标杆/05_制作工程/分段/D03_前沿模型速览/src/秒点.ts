// D03 前沿模型速览 · 秒点表（正式值，AI情报 第02期）
// 时基：30fps，局部帧 0＝本段首帧，总长 2004f（结束帧不含）
// 依据：02_配音/配音说明.md ＋ 05_制作工程/remotion-main/src/lib/subtitles.ts 真实句级与词组时间码

export const EV = {
  // A 顶部轻量章节行与前奏（0 - 268f）
  chapLine: 6,
  introLead: 20,
  introTrend1: 130, // 「全面指向"每 token 更便宜"和"垂直专用"」
  introTrend2: 170,

  // B 第一帧：MiniMax M3.1 Flash（269 - 844f）
  // 配音：
  //   269-377「首先是 MiniMax 发布的 M3.1 Flash」
  //   377-444「API 成本直接跳水 70%」
  //   444-557「输入每百万 token 只要 1 元，输出 4 元」
  //   557-835「在 Agent 架构中，大量意图识别、路由分发和格式化完全可以用它做分层替代，整体调用成本能降低 50% 到 70%」
  mmEnter: 269,
  mmChips: 310,
  mmCard70p: 377, // 成本跳水 70% 强调卡
  mmCardInPrice: 444, // 输入 ¥1.0
  mmCardOutPrice: 480, // 输出 ¥4.0
  mmPanelArch: 557, // Agent 架构分层方案面板
  mmTier1: 590, // 轻量路由层
  mmTier2: 670, // 核心推理层
  mmCostSaveBadge: 750, // 成本降 50%~70% 标签
  mmConverge: 830, // 14f 帧收敛淡出

  // C 第二帧：多模态领域双向爆发（846 - 1314f）
  // 配音：
  //   835-887「多模态领域双向爆发」
  //   887-1021「上海 AI 实验室推出 MOSS-Image 5B 轻量文生图模型」
  //   1021-1091「消费级单卡即可微调与生成」
  //   1091-1225「而 Meta 则推出 822B 参数的开源巨无霸 Muse Spark」
  //   1225-1300「激活 42B，全面对标多模态旗舰」
  multiEnter: 846,
  multiLead: 852,
  mossPanel: 887, // MOSS-Image 5B 左栏入场
  mossCard5b: 920,
  mossCardDeploy: 1021, // 消费级单卡 微调生成
  musePanel: 1091, // Meta Muse Spark 右栏入场
  museCard822b: 1120, // 822B 巨无霸
  museCardActive42b: 1225, // 激活 42B
  multiConverge: 1300, // 14f 帧收敛淡出

  // D 第三帧：端侧极速推理与长文记忆（1316 - 1734f）
  // 配音：
  //   1300-1336「端侧推理方面」
  //   1336-1441「Liquid AI 带来 24B 液态神经网络模型」
  //   1441-1494「实际仅激活 2B 参数」
  //   1494-1573「能在笔记本和手机上极速推理」
  //   1573-1641「腾讯发布 Hy-Memory 30B」
  //   1641-1720「专门强化了长对话上下文记忆」
  edgeEnter: 1316,
  edgeLead: 1320,
  liquidPanel: 1336, // Liquid AI 左栏入场
  liquidCard24b: 1370,
  liquidCard2b: 1441, // 激活 2B
  liquidChipDevice: 1494, // 笔记本与手机极速推理
  tencentPanel: 1573, // 腾讯 Hy-Memory 右栏入场
  tencentCard30b: 1600,
  tencentCardMemory: 1641, // 长对话上下文记忆
  edgeConverge: 1720, // 14f 帧收敛淡出

  // E 第四帧：垂直专用极小模型（1736 - 1985f）
  // 配音：
  //   1720-1754「此外」
  //   1754-1847「Mistral 首次跨界推出 209M 极小时序预测模型 Timestral」
  //   1847-1889「可在 CPU 上实时运行」
  //   1889-1961「标志着大厂正式进军垂直专用小模型」
  mistralEnter: 1736,
  mistralLead: 1740,
  mistralPanel: 1754, // Timestral 面板入场
  mistralCard209m: 1770,
  mistralCardCpu: 1847, // CPU 实时运行
  mistralCardSpec: 1870, // 时序专用
  mistralBadge: 1889, // 大厂正式进军垂直专用小模型
  mistralSettle: 1910, // 停稳阅读区（1910-1965，约 55f 停稳）

  // F 尾部转场与收画面（1965 - 2004f）
  // 任务书：本段负责尾部收画面，下一章章卡归 D04 头部
  finalConverge: 1965, // 16f 章节行＋Timestral 全屏淡出上浮
  last: 2003, // 本段末帧
} as const;
