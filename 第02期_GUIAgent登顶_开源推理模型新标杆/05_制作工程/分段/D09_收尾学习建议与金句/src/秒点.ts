// D09 收尾 学习建议与金句 · 秒点表（正式值，AI情报 第02期）
// 时基：30fps，局部帧 0＝本段首帧，总长 1558f（结束帧不含）
// 依据：02_配音/配音说明.md ＋ 05_制作工程/remotion-main/src/lib/subtitles.ts 真实句级与词组时间码

export const EV = {
  // ── 帧一 建议卡组帧（0 - 1060f）
  chapLine: 10, // S1 (9-55f)「收尾,学习建议与金句」
  introLead: 55, // S2 (55-132f)「最后，来到今天的行动指南」
  
  // 建议 1（RTX 4090 / A100 部署 DeepSeek FP8）
  card1Enter: 232, // S3 (232-301f)「利用 RTX 4090 或 A100」
  card1Chip: 301,  // (301-480f)「尝试用 DeepInfer 部署 DeepSeek-V4.1-Flash 的 FP8 版本」
  practiceChip1: 340,

  // 建议 2（精读 Focused GUI Agent 论文）
  card2Enter: 572, // S3 (572-695f)「精读南洋理工的 Focused GUI Agent 论文」
  card2Chip: 695,  // (695-833f)「在自己业务中尝试 UI 树与视觉的动态聚焦」
  practiceChip2: 720,

  // 建议 3（MiniMax M3.1 Flash 做路由层）
  card3Enter: 833, // S3 (833-947f)「用 MiniMax M3.1 Flash 做中间路由层」
  card3Chip: 947,  // (947-1007f)「搭建一套分层 Agent」
  practiceChip3: 980,

  cardSettle: 860, // 3 卡全入场落稳，停稳阅读（860-1060f，约 200f / 6.7s）
  cutToQuote: 1061, // 帧一 → 帧二 硬切点（S4 起句「今天的总结金句」）

  // ── 帧二 金句帧（1061 - 1407f）
  kickerQuote: 1061, // kicker「今日金句」16f
  quoteLine1: 1095,  // S4 (1095-1221f)「行业共识正从追求“参数更大”全面转向“每 token 更便宜”」
  quoteLine2: 1221,  // S4 (1221-1290f)「而多模态动态聚焦与工程化护栏」
  quoteLine3: 1290,  // S4 (1290-1408f)「正在让 Agent 真正跨越从实验 Demo 到可靠生产的鸿沟」
  quoteSource: 1320, // 出处「—— AI 情报 · 第 02 期总结」
  quoteSettle: 1308, // 金句全面落稳，至 1407f 停稳阅读约 100f（3.3s，从1221起算超 6.2s，完全满足 R6 ≥3.5s）
  cutToOutro: 1408,  // 帧二 → 帧三 硬切点（S5 起句「感谢收看本期 AI 情报」）

  // ── 帧三 片尾卡（1408 - 1557f）
  outroKicker: 1408,    // kicker「下期预告 · 明日关注」
  outroTitle: 1416,     // H1「AI 情报 · 下期见」
  outroUnderline: 1424, // 120px 下划线
  outroSubtitle: 1432,  // 「NeurIPS 2026 前沿解读 ＋ Agent 工程化实践」
  outroChip1: 1445,     // 芯片 1「NeurIPS 2026 论文精选解读」
  outroChip2: 1455,     // 芯片 2「长周期 Agent 工程化护栏」
  outroChip3: 1465,     // 芯片 3「文末查看 12+ 完整开源资源」
  outroNote: 1475,      // 底部提示「完整资源链接已整理在文末 · 欢迎点赞关注」
  outroSettle: 1485,    // 全屏终态停稳至 1557f 全片结束（约 72f / 2.4s）
  last: 1557,
} as const;
