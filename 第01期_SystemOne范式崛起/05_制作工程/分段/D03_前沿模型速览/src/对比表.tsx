// D03 LFM2.5 四模型对比表＝静态数据面板（已确认：入场外无运动，落定后不换态、不脉冲）
// 几何＝设计图 设计图_LFM2.5对比表.html ＋ _work/measure_LFM2.5对比表.json 实测：
//   表盒 x88 y538 w1744 h403（surface 底·3px line 边·r16·padding 20/28）；列宽 470/260/260/240/1fr；行高 58·行距 8·r10
//   行 1 LFM2.5＝强调态（3px tertiary 边＋success 底，模型名与"2B"tertiary）＝本段唯一强调态·高潮焦点
//   行 2–4＝对照行（system 底）；多模态 实心圆＝支持／空心圆＝不支持；端侧友好度＝5 级扁平评级（填充块数＝稿件⭐数）
// 数据逐字取自稿件 1.2"对比分析"表（数值可回查）；表头注已于 2026-10-19 修正时删除，本实现不含表头注。
// 局部值登记：表内 28px 表头／30px mono 数据／24px 列头 是设计图已确认的局部字号（DESIGN 六级字阶无对应档），交总控与期末复盘登记。
import React from 'react';
import {C, FONT_MONO, OUTLINE, ROUNDED} from '../../../remotion-main/src/lib/tokens';
import {enter, enterPanel} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

type Row = {
  m: string; // 模型名
  total: string; // 总参数
  active: string; // 激活参数
  multimodal: boolean; // 多模态
  stars: number; // 端侧友好度（5 级）
  hot?: boolean;
  start: number;
};

const ROWS: Row[] = [
  {m: 'LFM2.5-24B-A2B', total: '24B', active: '2B', multimodal: true, stars: 5, hot: true, start: EV.tableRow1},
  {m: 'Qwen3.8-27B', total: '27B', active: '27B', multimodal: true, stars: 3, start: EV.tableRow2},
  {m: 'MiniCPM-V 4.7-35B', total: '35B', active: '3B', multimodal: true, stars: 4, start: EV.tableRow3},
  {m: 'Phi-4', total: '14B', active: '14B', multimodal: false, stars: 4, start: EV.tableRow4},
];

const COLS = ['模型', '总参数', '激活参数', '多模态', '端侧友好度'];
const GRID = '470px 260px 260px 240px 1fr';

const Dot: React.FC<{on: boolean; hot?: boolean}> = ({on, hot}) =>
  on ? (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: hot ? C.tertiary : C.primary,
        display: 'inline-block',
      }}
    />
  ) : (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'transparent',
        border: `3px solid ${C.line}`,
        display: 'inline-block',
        boxSizing: 'border-box',
      }}
    />
  );

const Stars: React.FC<{n: number; hot?: boolean}> = ({n, hot}) => (
  <div style={{display: 'flex', gap: 6, justifyContent: 'center'}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          boxSizing: 'border-box',
          background: i < n ? (hot ? C.tertiary : C.primary) : 'transparent',
          border: i < n ? 'none' : `2px solid ${hot ? C.tertiary : C.line}`,
        }}
      />
    ))}
  </div>
);

export const 对比表: React.FC<{f: number}> = ({f}) => (
  <div
    style={{
      marginTop: 32,
      background: C.surface,
      border: `${OUTLINE}px solid ${C.line}`,
      borderRadius: ROUNDED.card,
      padding: '20px 28px',
      boxSizing: 'border-box',
      ...enterPanel(f, EV.tablePanel),
    }}
  >
    {/* 表头＋列头：一次入场（14f）；行按各自词点入场 */}
    <div style={enter(f, EV.tableHead, {dur: 14, rise: 0})}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 36}}>
        <span style={{fontSize: 28, fontWeight: 700, color: C.primary, lineHeight: 1.15}}>端侧大模型对比</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: GRID,
          alignItems: 'center',
          marginTop: 10,
          paddingBottom: 10,
          borderBottom: `2px solid ${C.line}`,
        }}
      >
        {COLS.map((c, i) => (
          <span key={c} style={{fontSize: 24, color: C.secondary, textAlign: i === 0 ? 'left' : 'center'}}>
            {c}
          </span>
        ))}
      </div>
    </div>

    {ROWS.map((r) => (
      <div
        key={r.m}
        style={{
          display: 'grid',
          gridTemplateColumns: GRID,
          alignItems: 'center',
          height: 58,
          marginTop: 8,
          borderRadius: ROUNDED.small,
          boxSizing: 'border-box',
          background: r.hot ? C.success : C.system,
          border: r.hot ? `${OUTLINE}px solid ${C.tertiary}` : 'none',
          ...enter(f, r.start, {dur: 14, rise: 14}),
        }}
      >
        <span style={{fontSize: 26, fontWeight: 700, color: r.hot ? C.tertiary : C.primary}}>{r.m}</span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 30,
            fontWeight: 700,
            color: C.primary,
            textAlign: 'center',
          }}
        >
          {r.total}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 30,
            fontWeight: 700,
            color: r.hot ? C.tertiary : C.primary,
            textAlign: 'center',
          }}
        >
          {r.active}
        </span>
        <span style={{textAlign: 'center'}}>
          <Dot on={r.multimodal} hot={r.hot} />
        </span>
        <Stars n={r.stars} hot={r.hot} />
      </div>
    ))}
  </div>
);
