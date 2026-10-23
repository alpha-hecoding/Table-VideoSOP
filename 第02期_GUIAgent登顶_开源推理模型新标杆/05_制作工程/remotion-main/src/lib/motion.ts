// 运动工具：曲线与时长取自 DESIGN.md 的 x-video.motion（2026-10-15 确认，30fps 校准）。
// 约定：入场＝淡入 + ≤20px 上浮（默认 14px）；错峰 6-8f；计数 60f；末尾 84f 停稳阅读。
import {interpolate, spring} from 'remotion';

// 三次贝塞尔求解（DESIGN 用 CSS 风格曲线控制点）
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const d = sampleDX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    return sampleY(t);
  };
};

export const EASE = {
  reveal: bezier(0.215, 0.61, 0.355, 1), // 出现／停稳（out cubic）
  travel: bezier(0.25, 0.1, 0.25, 1), // 对象传递（inOut quad）
  settle: bezier(0.215, 0.61, 0.355, 1),
  process: bezier(0.645, 0.045, 0.355, 1), // 需要被看清的过程（inOut cubic）
  linear: (x: number) => x, // 只用于慢路线对象
} as const;

export type Ease = (x: number) => number;

/** 归一化进度：f 在 [start, start+dur] 内 0→1，配 ease 使用 */
export const prog = (f: number, start: number, dur: number, ease: Ease = EASE.reveal) =>
  ease(Math.min(1, Math.max(0, (f - start) / Math.max(1, dur))));

/** 入场：淡入 + 上浮（rise 默认 14px，上限 20px） */
export const enter = (
  f: number,
  start: number,
  opts: {dur?: number; rise?: number; ease?: Ease} = {},
) => {
  const {dur = 16, rise = 14, ease = EASE.reveal} = opts;
  const p = prog(f, start, dur, ease);
  return {opacity: p, transform: `translateY(${(1 - p) * rise}px)`};
};

/** 面板进入：0.98→1 + 淡入（18f） */
export const enterPanel = (f: number, start: number) => {
  const p = prog(f, start, 18, EASE.reveal);
  return {opacity: p, transform: `scale(${0.98 + 0.02 * p})`};
};

/** 错峰起点：chip 6f / panel 8f / card 8f（calibration.followDelaysFrames） */
export const stagger = (base: number, index: number, gap = 8) => base + index * gap;

/** 数据计数：60f 从 0 数到 to；千分位与 + 号不参与计数（格式化在组件里做） */
export const countTo = (
  f: number,
  start: number,
  to: number,
  opts: {dur?: number; ease?: Ease} = {},
) => {
  const {dur = 60, ease = EASE.reveal} = opts;
  return to * prog(f, start, dur, ease);
};

/** 沿线生长：路径先绘（快路 22f／慢路 32f），对象后发；用 strokeDashoffset 实现 */
export const drawPath = (f: number, start: number, dur: number, length: number, ease: Ease = EASE.process) =>
  length * (1 - prog(f, start, dur, ease));

/** 接触反馈：半正弦脉冲 0.4s（12f），幅度 1.05／1.04；换态与脉冲同帧，不做形变 */
export const contactPulse = (f: number, start: number, amp = 1.05) => {
  const dur = 12;
  if (f < start || f > start + dur) return 1;
  const p = (f - start) / dur;
  return 1 + (amp - 1) * Math.sin(Math.PI * p);
};

/** 匀速推进（只允许慢路线：每一步都要被看清） */
export const travelLinear = (f: number, start: number, dur: number, from: number, to: number) =>
  interpolate(f, [start, start + dur], [from, to], {
    easing: EASE.linear,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 对象传递（快路线）：inOut */
export const travel = (f: number, start: number, dur: number, from: number, to: number) =>
  interpolate(f, [start, start + dur], [from, to], {
    easing: EASE.travel,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 需要时用的弹性（本期默认不用 spring；保留给显式批准的场合） */
export const softSpring = (f: number, start: number, config = {damping: 200, stiffness: 80}) =>
  spring({frame: f - start, fps: 30, ...config});
