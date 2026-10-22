// D02 双路时间对比（左＝System 1 直觉直线路／右＝System 2 CoT 折线慢路）
// 构图与几何＝已确认设计图 03_视觉设计/D02_JevaSystemOne范式/设计图_双路对比帧.html（＋设计图_数据卡组.html 终态），
//   SVG viewBox 0 0 880 150 与 viewBox 内坐标逐值照抄设计图，不另立尺寸。
// 运动参数＝动态测试01 已校准值（DESIGN x-video.motion.calibration）：路径先绘（左 22f out cubic／右 32f inOut cubic）
//   → 双点同刻出发（左 18f inOut quad／右 34f 匀速）→ 接触脉冲 12f（1.05／1.04）＋接触后 4f 同帧离散换态
//   → 结果标签接触后 6f。R1：画面时间差是展示节奏，不是 3-5× 数据。
// 为什么不用 lib Panel：它用 enter(rise 0) 而非已校准的 enterPanel（0.98→1＋淡入 18f）；差异已写接入说明交总控。
import React from 'react';
import {C, FONT_MONO, FONT_ZH, GRAPHIC, OUTLINE, PANEL, ROUNDED} from '../../../remotion-main/src/lib/tokens';
import {EASE, contactPulse, enter, enterPanel, prog, travel, travelLinear} from '../../../remotion-main/src/lib/motion';
import {Chip, ResultLabel} from '../../../remotion-main/src/lib/ui';
import {EV} from './秒点';

// 淡入（线性，同测试01 fade）
const fade = (f: number, start: number, dur: number) => prog(f, start, dur, EASE.linear);

// 右折线顶点（＝设计图 path "M180 75 H300 V30 H420 V110 H540 V75 H660"），x 单调不减 → 可按 x 渐进揭示
const PTS: [number, number][] = [
  [180, 75],
  [300, 75],
  [300, 30],
  [420, 30],
  [420, 110],
  [540, 110],
  [540, 75],
  [660, 75],
];
const PATH_R = 'M180 75 H300 V30 H420 V110 H540 V75 H660';
const LEN = (a: [number, number], b: [number, number]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const TOTAL = PTS.slice(1).reduce((s, p, i) => s + LEN(PTS[i], p), 0); // 660 SVG 单位（DESIGN 记 640，取几何实测值）

// t∈[0,1] → 折线上的点（按弧长参数化，供匀速推进）
const pointAt = (t: number): [number, number] => {
  let d = t * TOTAL;
  for (let i = 1; i < PTS.length; i++) {
    const l = LEN(PTS[i - 1], PTS[i]);
    if (d <= l) {
      const r = l === 0 ? 0 : d / l;
      return [PTS[i - 1][0] + (PTS[i][0] - PTS[i - 1][0]) * r, PTS[i - 1][1] + (PTS[i][1] - PTS[i - 1][1]) * r];
    }
    d -= l;
  }
  return PTS[PTS.length - 1];
};

// 圆点：起 4f 淡入、接触后 6f 淡出（测试01 dotL／dotR）
const dotOpacity = (f: number, start: number, end: number) => {
  if (f < start) return 0;
  if (f < start + 4) return (f - start) / 4;
  if (f <= end) return 1;
  if (f < end + 6) return 1 - (f - end) / 6;
  return 0;
};

const boxBase: React.CSSProperties = {
  borderRadius: PANEL.radius,
  padding: PANEL.padding,
  boxSizing: 'border-box',
  flex: 1,
  minWidth: 0,
  height: 398, // 设计图实测面板盒 398 高（_work/measure_双路对比帧.json）
};

const nodeLabel: React.CSSProperties = {fontSize: 30, textAnchor: 'middle', fill: C.primary, fontFamily: FONT_ZH};

// 左面板底行：JEVA 结果标签（接触后 6f）＋架构芯片（S5 词点，落在预留槽位，JEVA 不位移）
const LeftFoot: React.FC<{f: number}> = ({f}) => (
  <>
    <ResultLabel text="JEVA" f={f} start={EV.jeva} />
    <Chip text="第一性原理 · 新型注意力" f={f} start={EV.chipArch} />
  </>
);

export const 双路对比: React.FC<{f: number}> = ({f}) => {
  // 左：System 1（主方，tertiary 只服务本面板）
  const lineLx2 = 210 + 390 * prog(f, EV.pathL, 22, EASE.reveal); // 实线先绘 22f
  const dotLx = travel(f, EV.dot, EV.dotLdur, 215, 612); // 位移 397 SVG 单位＝校准 distancesPx.dotL
  const pulseL = contactPulse(f, EV.contactL, 1.05);
  const stateL = f >= EV.stateL; // 接触后 4f：白框→success 填充＋4px tertiary 边（同帧离散换态，无形变）

  // 右：System 2（对照方，只用 primary／system，不抢焦点）
  const pathR = prog(f, EV.pathR, 32, EASE.process); // 虚线先绘 32f
  const dotRT = travelLinear(f, EV.dot, EV.dotRdur, 0, 1); // 匀速：强调"每一步都走"
  const [dotRx, dotRy] = pointAt(dotRT);
  const pulseR = contactPulse(f, EV.contactR, 1.04);

  return (
    <div style={{display: 'flex', gap: 40, marginTop: 32}}>
      <div
        style={{
          ...boxBase,
          background: PANEL.mainBackground,
          border: PANEL.mainBorder,
          ...enterPanel(f, EV.panelL),
        }}
      >
        <div
          style={{display: 'flex', alignItems: 'baseline', gap: 16, height: 48, ...enter(f, EV.headL, {dur: 14, rise: 8})}}
        >
          <span style={{fontSize: 42, fontWeight: 700, color: C.primary, lineHeight: 1.15}}>快速直觉</span>
          <span style={{fontFamily: FONT_MONO, fontSize: 28, color: C.secondary}}>System 1</span>
        </div>
        <div style={{fontSize: 24, color: C.secondary, marginTop: 4, lineHeight: 1.25, opacity: fade(f, EV.capL, 14)}}>
          一眼看穿的即时推理
        </div>
        <svg
          style={{display: 'block', marginTop: 16, width: '100%'}}
          height={120}
          viewBox="0 0 880 150"
          preserveAspectRatio="xMinYMid meet"
        >
          <g style={{opacity: fade(f, EV.sensL, 14)}}>
            <rect x={20} y={45} width={180} height={60} rx={ROUNDED.small} fill={C.surface} stroke={C.line} strokeWidth={OUTLINE} />
            <text x={110} y={84} fontSize={30} textAnchor="middle" fill={C.primary} fontFamily={FONT_ZH}>
              感知
            </text>
          </g>
          <line x1={210} y1={75} x2={lineLx2} y2={75} stroke={GRAPHIC.pathFast.stroke} strokeWidth={GRAPHIC.pathFast.width} />
          <polygon points="600,75 570,58 570,92" fill={C.tertiary} style={{opacity: fade(f, EV.arrowL, 8)}} />
          <g style={{opacity: fade(f, EV.ansL, 14), transform: `scale(${pulseL})`, transformOrigin: '720px 75px'}}>
            <rect
              x={620}
              y={45}
              width={200}
              height={60}
              rx={ROUNDED.small}
              fill={stateL ? C.success : C.surface}
              stroke={stateL ? C.tertiary : C.line}
              strokeWidth={stateL ? 4 : OUTLINE}
            />
            <text
              x={720}
              y={84}
              fontSize={30}
              textAnchor="middle"
              fill={stateL ? C.tertiary : C.primary}
              fontWeight={stateL ? 700 : 400}
              fontFamily={FONT_ZH}
            >
              答案
            </text>
          </g>
          <circle cx={dotLx} cy={75} r={GRAPHIC.dot} fill={C.tertiary} style={{opacity: dotOpacity(f, EV.dot, EV.contactL)}} />
        </svg>
        {/* 结果标签只在左点实际接触后 6f 出现；芯片落在预留槽位（JEVA 不位移） */}
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, minHeight: 50}}>
          <LeftFoot f={f} />
        </div>
      </div>

      <div
        style={{
          ...boxBase,
          background: PANEL.contrastBackground,
          border: PANEL.contrastBorder,
          ...enterPanel(f, EV.panelR),
        }}
      >
        <div
          style={{display: 'flex', alignItems: 'baseline', gap: 16, height: 48, ...enter(f, EV.headR, {dur: 14, rise: 8})}}
        >
          <span style={{fontSize: 42, fontWeight: 700, color: C.primary, lineHeight: 1.15}}>慢速 CoT</span>
          <span style={{fontFamily: FONT_MONO, fontSize: 28, color: C.secondary}}>System 2</span>
        </div>
        <div style={{fontSize: 24, color: C.secondary, marginTop: 4, lineHeight: 1.25, opacity: fade(f, EV.capR, 14)}}>
          传统 CoT 慢思考路径
        </div>
        <svg
          style={{display: 'block', marginTop: 16, width: '100%'}}
          height={120}
          viewBox="0 0 880 150"
          preserveAspectRatio="xMinYMid meet"
        >
          <g style={{opacity: fade(f, EV.sensR, 14)}}>
            <rect x={20} y={45} width={150} height={60} rx={ROUNDED.small} fill={C.surface} stroke={C.line} strokeWidth={OUTLINE} />
            <text x={95} y={84} fontSize={28} textAnchor="middle" fill={C.primary} fontFamily={FONT_ZH}>
              感知
            </text>
          </g>
          {/* 虚线路径按 x 渐进揭示（x 单调不减）；id 带段名，避免总装时与其他段撞名 */}
          <clipPath id="d02-revealR">
            <rect x={180} y={0} width={480 * pathR} height={150} />
          </clipPath>
          <g clipPath="url(#d02-revealR)">
            <path
              d={PATH_R}
              fill="none"
              stroke={GRAPHIC.pathSlow.stroke}
              strokeWidth={GRAPHIC.pathSlow.width}
              strokeDasharray={GRAPHIC.pathSlow.dash ? GRAPHIC.pathSlow.dash.join(' ') : undefined}
            />
          </g>
          <polygon points="690,75 660,58 660,92" fill={C.primary} style={{opacity: fade(f, EV.arrowR, 8)}} />
          <g style={{opacity: fade(f, EV.ansR, 14), transform: `scale(${pulseR})`, transformOrigin: '780px 75px'}}>
            {/* 对照方不换 success 态：全程白框 */}
            <rect x={700} y={45} width={160} height={60} rx={ROUNDED.small} fill={C.surface} stroke={C.line} strokeWidth={OUTLINE} />
            <text x={780} y={84} fontSize={28} textAnchor="middle" fill={C.primary} fontFamily={FONT_ZH}>
              答案
            </text>
          </g>
          <circle cx={dotRx} cy={dotRy} r={GRAPHIC.dot} fill={C.primary} style={{opacity: dotOpacity(f, EV.dot, EV.contactR)}} />
        </svg>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, minHeight: 50}}>
          {/* 只在右点实际到达后 4f 出现（不在完成前） */}
          <div style={{fontSize: 24, color: C.secondary, lineHeight: 1.25, ...enter(f, EV.capR2, {dur: 14, rise: 8})}}>
            多步推导 · 更慢
          </div>
        </div>
      </div>
    </div>
  );
};
