// D07 工具与技巧速览 · 秒点表（正式值，AI情报 第02期）
// 时基：30fps，局部帧 0＝本段首帧，总长 1516f（结束帧不含）
// 依据：02_配音/配音说明.md ＋ 05_制作工程/remotion-main/src/lib/subtitles.ts 真实句级与词组时间码

export const EV = {
  // A 顶部轻量章节行与前奏（0 - 202f）
  // 配音：
  //   6-74「工具与技巧速览在工程落地层面」
  //   74-202「今天有四套实用工具与加固指南值得立即接入」
  chapLine: 6,
  introBadges: 74,

  // B 工具 1：微软 Agent Framework + MCP（202 - 674f）
  // 配音：
  //   202-373「第一项是微软 Agent Framework 正式支持本地 MCP 协议集成」
  //   373-540「无论是 Python 的 Agent 365 还是 C# 的 Semantic Kernel」
  //   540-674「都可以通过标准化协议动态发现与挂载本地工具」
  item1Enter: 202,
  item1Chip1: 373, // Agent 365 + Semantic Kernel
  item1Impact: 540, // 标准化协议动态发现与挂载本地工具

  // C 工具 2：DeepSeek DeepInfer 部署实践（674 - 966f）
  // 配音：
  //   674-807「第二项是 DeepSeek DeepInfer 的全套部署实践」
  //   807-897「推荐结合 FP8 量化与动态批处理」
  //   897-966「将显存占用减半、吞吐翻倍」
  item2Enter: 674,
  item2Chip1: 807, // FP8 量化 + 动态批处理
  item2Impact: 897, // 显存减半 · 吞吐翻倍

  // D 工具 3 & 右侧核心焦点：AI 功能评估三门禁框架（966 - 1303f）
  // 配音：
  //   966-1046「第三项是 AI 功能评估三门禁框架」
  //   1046-1162「在上线前严格设置 P95 延迟小于 2 秒的性能门禁」
  //   1162-1238「单次调用低于 1 分钱的成本门禁」
  //   1238-1303「以及覆盖幻觉的可靠性门禁」
  item3Enter: 966,
  gatePanelEnter: 980, // 右侧三门禁大面板入场
  gate1Highlight: 1046, // 门禁 1：P95 < 2s
  gate2Highlight: 1162, // 门禁 2：< ¥0.01
  gate3Highlight: 1238, // 门禁 3：可靠性 / 幻觉率覆盖

  // E 工具 4：Agentic DevOps 护栏设计（1303 - 1486f）
  // 配音：
  //   1303-1377「最后一项是 Agentic DevOps 护栏设计」
  //   1377-1486「为自主修复和自动化部署设置沙箱隔离与人工审核双保险」
  item4Enter: 1303,
  item4Chip1: 1377, // 沙箱隔离 + 人工审核双保险

  // F 终态停稳与尾部转场（1440 - 1516f）
  settle: 1440, // 全屏停稳阅读（1440-1495，约 55f / 1.8s）
  finalConverge: 1495, // 16f 全屏淡出上浮收画面（1495-1515f）
  last: 1515,
} as const;
