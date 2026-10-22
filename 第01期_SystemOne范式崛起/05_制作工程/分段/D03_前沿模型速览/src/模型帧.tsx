// D03 模型帧＝本段主角对象：4 帧同版式（任务书"必须保持"），只有内容不同。
// 版式与几何＝已确认设计图 03_视觉设计/D03_前沿模型速览/设计图_{LFM2.5帧|LFM2.5对比表|Qwen帧|Muse_Wonder帧|Argon帧}.html
//   实测值（_work/measure_*.json）：h1 y183 h97／副题行 y320 h49／定位语 y391 h33／要点芯片行 y458 h49／Argon 注释 y530 h30
//   标题块局部比例沿用候选A（kicker mt28 → h1 mt10 → 下划线 mt14 → 副题 mt16 → 定位语 mt22 → 芯片行 mt34）。
// 入场顺序与时长＝运动标注已确认语言（h1 20f／下划线 16f 宽 0→120／副题 16f／数据芯片 16f／定位语 14f 淡入／芯片行 16f 错峰 6f）。
// 帧收敛＝淡出＋上浮 10px，12f（任务书"帧间收敛 12f 让位＋硬切"里的让位语言，同 D01→D02）。
import React from 'react';
import {C, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {ChipX, type Part} from './芯片';

/** 帧收敛：淡出＋上浮 10px */
export const converge = (f: number, start: number, dur: number) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

export type ModelFrameSpec = {
  id: string; // 仅用于调试／标注，不上屏
  h1: string;
  h1Start: number;
  lineStart: number;
  sub: string; // 来源（副题位）
  subStart: number;
  dataChip?: {parts: Part[]; start: number}; // 数据芯片位（Argon 帧留空，版式位保留）
  desc: string; // 定位语（1 行）
  descStart: number;
  chips: {parts: Part[]; start: number}[]; // 要点芯片行（固定位 y458）
  note?: {text: string; start: number}; // 注释行（仅 Argon 帧）
};

export const ModelFrame: React.FC<{
  f: number;
  spec: ModelFrameSpec;
  convergeStart: number;
  convergeDur?: number;
  children?: React.ReactNode; // LFM2.5 帧的对比表（变化态，芯片行不撤换）
}> = ({f, spec, convergeStart, convergeDur = 12, children}) => {
  const cv = converge(f, convergeStart, convergeDur);
  const h1 = enter(f, spec.h1Start, {dur: 20, rise: 20});
  const lineW = 120 * prog(f, spec.lineStart, 16, EASE.reveal);
  const sub = enter(f, spec.subStart, {dur: 16, rise: 14});
  const desc = enter(f, spec.descStart, {dur: 14, rise: 0});
  return (
    <div style={{...cv}}>
      <div style={{...TYPE.h1, color: C.primary, ...h1, marginTop: 10}}>{spec.h1}</div>
      <div style={{width: lineW, height: 10, background: C.tertiary, marginTop: 14}} />

      {/* 副题行：来源 ＋ 数据芯片（各自独立入场，槽位恒定，未入场项占位 opacity 0） */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, minHeight: 49}}>
        <div style={{...sub, fontSize: 30, color: C.secondary, lineHeight: 1.25, marginRight: 12}}>{spec.sub}</div>
        {spec.dataChip ? <ChipX parts={spec.dataChip.parts} f={f} start={spec.dataChip.start} /> : null}
      </div>

      <div style={{...TYPE.body, color: C.primary, ...desc, marginTop: 22}}>{spec.desc}</div>

      <div style={{display: 'flex', gap: 16, marginTop: 34, minHeight: 49}}>
        {spec.chips.map((c, i) => (
          <ChipX key={i} parts={c.parts} f={f} start={c.start} />
        ))}
      </div>

      {spec.note ? (
        <div
          style={{
            ...TYPE.label,
            color: C.secondary,
            ...enter(f, spec.note.start, {dur: 14, rise: 0}),
            marginTop: 24,
          }}
        >
          {spec.note.text}
        </div>
      ) : null}

      {children}
    </div>
  );
};

// 章节行（kicker）＝D02 已确认版式提案（18px 橙方块＋30px·字距4 次级），承接 D02 不重绘；仅 Z1 随全屏撤下
// 章号写法按 U1 统一到原稿 h2 口径「一、前沿模型动态」（2026-10-20 视觉更正，版式与坐标不动）
export const Kicker: React.FC<{f: number; style?: React.CSSProperties}> = ({f: _f, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, height: 30, ...style}}>
    <div style={{width: 18, height: 18, background: C.tertiary}} />
    <div style={{fontSize: 30, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
      一、前沿模型动态
    </div>
  </div>
);
