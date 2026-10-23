// 排点唯一来源：05_制作工程/总装排点.md v1（2026-10-22）。
// f0＝全片起始帧（不含终点约定：段占 [f0, f0+dur)）；dur＝该段配音帧数（30fps）。

export type Seg = {
  id: string;
  dir: string; // 分段专属目录（组件在其 src/Segment.tsx）
  f0: number;
  dur: number;
  audio: string; // public/audio 下的 ASCII 名（指向 02_配音/采用/）
};

// 段间留白：D01→D02 为 40f（留足 D01 终态停稳），其余段间 15f
export const SEGMENTS: Seg[] = [
  {id: 'D01', dir: 'D01_开场与数据速览', f0: 0, dur: 1328, audio: 'audio/D01.wav'},
  {id: 'D02', dir: 'D02_DeepSeek推理新标杆', f0: 1368, dur: 1510, audio: 'audio/D02.wav'},
  {id: 'D03', dir: 'D03_前沿模型速览', f0: 2893, dur: 2004, audio: 'audio/D03.wav'},
  {id: 'D04', dir: 'D04_FocusedGUI全模态聚焦', f0: 4912, dur: 1462, audio: 'audio/D04.wav'},
  {id: 'D05', dir: 'D05_Agent架构速览', f0: 6389, dur: 1476, audio: 'audio/D05.wav'},
  {id: 'D06', dir: 'D06_开源生态速览', f0: 7880, dur: 1646, audio: 'audio/D06.wav'},
  {id: 'D07', dir: 'D07_工具与技巧速览', f0: 9541, dur: 1516, audio: 'audio/D07.wav'},
  {id: 'D08', dir: 'D08_值得深读速览', f0: 11072, dur: 1715, audio: 'audio/D08.wav'},
  {id: 'D09', dir: 'D09_收尾学习建议与金句', f0: 12802, dur: 1558, audio: 'audio/D09.wav'},
];

export const TOTAL_FRAMES = 14360; // 14360