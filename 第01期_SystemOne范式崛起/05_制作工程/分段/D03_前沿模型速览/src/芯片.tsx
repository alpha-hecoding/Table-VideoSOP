// D03 段内芯片（临时实现，2026-10-19）
// 为什么不用 lib Chip：已确认设计图里数据芯片的数字位是 mono 700（.chip .num），lib Chip 只收纯 text 字符串，
//   无法在同一芯片内混排 zh／mono。属公共实现缺口，已写本段接入说明交总控（建议 Chip 收 ReactNode 或 parts）。
// 除混排这一项外，盒子／字阶／颜色角色／入场全部取自同一套 tokens 与 motion，不另立参数。
import React from 'react';
import {CHIP, C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';

export type Part = {t: string; mono?: boolean};

// 版式对齐：设计图 .chip 是 inline-flex＋align-items:center（文字成 flex item，行高＝1.25×26＝32.5，盒高 48.5）；
//   lib Chip 是块级 div＋inline span，行盒会按字体 content area 长到 ≈36，盒高多 3px（实测本段芯片 52 vs 设计图 49）。
//   这里按设计图用 flex＋居中，使盒高与设计图一致；同一问题已写接入说明交总控（lib Chip 同样受影响）。
export const ChipX: React.FC<{
  parts: Part[];
  hot?: boolean;
  f: number;
  start: number;
}> = ({parts, hot, f, start}) => (
  <div
    style={{
      ...CHIP,
      border: hot ? CHIP.hotBorder : CHIP.border,
      background: hot ? CHIP.hotBackground : CHIP.background,
      ...TYPE.body,
      color: hot ? C.tertiary : C.primary,
      fontWeight: hot ? 700 : 400,
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...enter(f, start, {dur: 16, rise: 14}),
    }}
  >
    {parts.map((p, i) =>
      p.mono ? (
        <span key={i} style={{fontFamily: FONT_MONO, fontWeight: 700}}>
          {p.t}
        </span>
      ) : (
        <span key={i}>{p.t}</span>
      ),
    )}
  </div>
);
