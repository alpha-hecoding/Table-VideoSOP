// 排点唯一来源：05_制作工程/总装排点.md v1（2026-10-19）。改留白只改 gap 并重算 F0，不改各段内部秒点。
// f0＝全片起始帧（不含终点约定：段占 [f0, f0+dur)）；dur＝该段配音帧数（30fps）。

export type Seg = {
  id: string;
  dir: string; // 分段专属目录（组件在其 src/Segment.tsx）
  f0: number;
  dur: number;
  audio: string; // public/audio 下的 ASCII 名（指向 02_配音/采用/）
};

// 段间留白不再用统一常量：留白＝下一段 f0 －（本段 f0＋dur）。
// 排点 v2（2026-10-19 用户确认）：D01→D02＝40f（让 D01 终态停稳够 84f），其余 15f。

export const SEGMENTS: Seg[] = [
  {id: 'D01', dir: 'D01_开场与数据速览', f0: 0, dur: 880, audio: 'audio/D01.wav'},
  {id: 'D02', dir: 'D02_JevaSystemOne范式', f0: 920, dur: 1282, audio: 'audio/D02.wav'},
  {id: 'D03', dir: 'D03_前沿模型速览', f0: 2217, dur: 2267, audio: 'audio/D03.wav'},
  {id: 'D04', dir: 'D04_AgentReflex反思闭环', f0: 4499, dur: 1191, audio: 'audio/D04.wav'},
  {id: 'D05', dir: 'D05_Agent架构速览', f0: 5705, dur: 1389, audio: 'audio/D05.wav'},
  {id: 'D06', dir: 'D06_开源生态速览', f0: 7109, dur: 1660, audio: 'audio/D06.wav'},
  {id: 'D07', dir: 'D07_工具与技巧速览', f0: 8784, dur: 1429, audio: 'audio/D07.wav'},
  {id: 'D08', dir: 'D08_值得深读速览', f0: 10228, dur: 1604, audio: 'audio/D08.wav'},
  {id: 'D09', dir: 'D09_收尾学习建议与金句', f0: 11847, dur: 1351, audio: 'audio/D09.wav'},
];

export const TOTAL_FRAMES = SEGMENTS[SEGMENTS.length - 1].f0 + SEGMENTS[SEGMENTS.length - 1].dur; // 13198
