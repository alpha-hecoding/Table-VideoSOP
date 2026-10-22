// D06 速览格：项目名（mono 26/700）＋ 1 关键数据（下载量：label 24 secondary＋data-value 46/700 mono）＋ 1 行亮点（body 26/400）。
// 版式＝已确认设计图 03_视觉设计/D06_开源生态速览/设计图_8格网格帧.html 实测参数（_work/measure_8格网格帧.json）：
//   格 418×372、候选A 卡片参数（surface 底、3px line 边、r16、padding 18/28）、三行垂直居中、行间距 12px。
// 密度约束（任务书"必须保持"项）：每格 ≤ 名称＋1 数据＋1 行 → 正好三行，无第四行；名称与亮点 white-space:nowrap，
//   实测最长名称 328px／最长亮点 288px ≤ 格内可用宽 356px（measure_8格网格帧.json，溢出标志全 false）。
// 焦点纪律（任务书"必须保持"项）：强调态（3px tertiary 边＋success 底）与 ★ 角标只给星标格（hot）；其余 7 格等重、格内无 tertiary。
// 入场语言＝DESIGN components.card：淡入＋10px 上浮，16f（运动标注 G1–G8；对标动态测试01 卡组入场）。
import React from 'react';
import {CARD, C, DATA_VALUE, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';

export type 格规格 = {
  name: string;
  num: string; // 关键数据＝下载量（8 格同字段，可比）
  point: string;
  start: number;
  hot?: boolean; // 星标项目（原稿 §3.1 带 ⭐）：入场即强调态＋★ 角标，不做换态动画
};

export const 速览格: React.FC<{f: number; spec: 格规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div
      style={{
        ...CARD,
        position: 'relative',
        border: spec.hot ? `3px solid ${C.tertiary}` : CARD.border,
        background: spec.hot ? C.success : CARD.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...s,
      }}
    >
      {spec.hot ? (
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 14,
            fontSize: 26,
            lineHeight: 1.25,
            color: C.tertiary,
          }}
        >
          ★
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
          fontWeight: 700,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {spec.name}
      </div>
      <div style={{marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap'}}>
        <span style={{...TYPE.label, color: C.secondary}}>下载</span>
        <span style={{...DATA_VALUE, lineHeight: 1.1, color: C.primary}}>{spec.num}</span>
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 26,
          fontWeight: 400,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {spec.point}
      </div>
    </div>
  );
};
