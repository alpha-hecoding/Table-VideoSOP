// 视觉 token：唯一来源是仓库根目录 DESIGN.md（revision 1.0.0，2026-10-15 用户确认）的 front matter。
// 改视觉先改 DESIGN.md，再同步这里；不要在组件里写死颜色或字号。

export const C = {
  primary: '#3E4A5A', // 主文字（蓝灰墨）
  secondary: '#7C8797', // 次要注释
  tertiary: '#F26B1D', // 唯一行动焦点：采用路线、关键数字、结果标签
  canvas: '#F9F2E0', // 暖奶油画布底
  surface: '#FFFFFF', // 白卡片
  line: '#AEBAC7', // 边界
  system: '#DEE5EC', // 对照方面板底
  success: '#FCE8D4', // 已完成／已采用状态填充
} as const;

export const FONT_ZH = "'Noto Sans CJK SC', 'WenQuanYi Zen Hei', sans-serif";
export const FONT_MONO = "'JetBrains Mono NF', monospace";

// 六级字阶（1920x1080 基准画布）
export const TYPE = {
  h1: {fontFamily: FONT_ZH, fontSize: 88, fontWeight: 700, lineHeight: 1.1, letterSpacing: 3},
  h2: {fontFamily: FONT_ZH, fontSize: 42, fontWeight: 700, lineHeight: 1.15, letterSpacing: 0},
  subtitle: {fontFamily: FONT_ZH, fontSize: 30, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0},
  body: {fontFamily: FONT_ZH, fontSize: 26, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0},
  label: {fontFamily: FONT_ZH, fontSize: 24, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0},
  metadata: {fontFamily: FONT_MONO, fontSize: 26, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0},
} as const;

// 已确认样本里的局部值：只在这些组件里用，不外推
export const LOCAL = {
  cardKeyNote: 23, // 数据卡 k/n 行（候选A + 测试01）
  footer: 23, // 页脚（DESIGN components.footer）
  kickerTracking: 4, // kicker 字距
  h1Tracking: 3, // h1 字距（已确认值，不是通用规则）
  resultLabelTracking: 2,
  brand: 44, // 顶栏系列名（候选A 实测；DESIGN 尚未登记，期末复盘统一补）
  brandEp: 28,
  brandTracking: 2, // 顶栏系列名字距（候选A 实测）
  topDate: 26,
} as const;

export const SPACE = {xs: 2, sm: 14, md: 22, lg: 32, xl: 44, section: 60} as const;
export const ROUNDED = {small: 10, card: 16} as const;
export const OUTLINE = 3; // 描边线宽（扁平，无阴影无渐变）

// 画布与安全区（x-video.canvas）
export const CANVAS = {width: 1920, height: 1080, fps: 30} as const;
export const SAFE = {top: 60, right: 88, bottom: 44, left: 88} as const;

// 组件接口（DESIGN components）
export const CARD = {
  background: C.surface,
  color: C.primary,
  border: `${OUTLINE}px solid ${C.line}`,
  radius: ROUNDED.card,
  padding: '18px 28px',
  // 盒高＝已确认设计图实测值（D01 终帧／D02 数据卡组 145–149；内容自适应会撑到 159）
  height: 149,
  boxSizing: 'border-box' as const,
} as const;

export const PANEL = {
  mainBackground: C.surface,
  mainBorder: `${OUTLINE}px solid ${C.line}`,
  contrastBackground: C.system,
  contrastBorder: 'none',
  radius: ROUNDED.card,
  padding: '26px 34px',
} as const;

export const CHIP = {
  background: C.surface,
  border: `2px solid ${C.line}`,
  hotBorder: `2px solid ${C.tertiary}`,
  hotBackground: C.success,
  radius: ROUNDED.small,
  padding: '6px 18px',
} as const;

export const RESULT_LABEL = {
  background: C.tertiary,
  color: C.canvas,
  radius: ROUNDED.small,
  padding: '5px 18px',
  fontSize: 24, // 以 DESIGN 为准；测试01 代码是 22px，差异已登记
} as const;

export const DATA_VALUE = {fontFamily: FONT_MONO, fontSize: 46, fontWeight: 700} as const;

// 图形语法（x-video.graphics）
export const GRAPHIC = {
  pathFast: {stroke: C.tertiary, width: 7, dash: undefined as number[] | undefined},
  pathSlow: {stroke: C.primary, width: 6, dash: [16, 12]},
  arrow: {width: 30, height: 34},
  nodeBox: {background: C.surface, border: `${OUTLINE}px solid ${C.line}`, radius: ROUNDED.small},
  dot: 10,
} as const;
