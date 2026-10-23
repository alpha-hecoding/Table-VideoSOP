import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Chip, DataCard, Frame} from '../../../remotion-main/src/lib/ui';
import {C, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {contactPulse, countTo, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '来源：arXiv · HuggingFace';

type CardSpec = {
  k: string;
  to: number;
  unit: string;
  n: string;
  plus?: boolean;
  isK?: boolean; // 是否以 K 为单位（42.1K）
  accentNumber?: boolean;
  enter: number;
  count: number;
  accentFrame?: number;
};

const ROW1_CARDS: CardSpec[] = [
  {k: 'arXiv cs.AI 人工智能', to: 321, unit: ' 篇', n: '10/22 · ↑ 活跃', enter: EV.card1Enter, count: EV.card1Count},
  {k: 'arXiv cs.LG 机器学习', to: 249, unit: ' 篇', n: '10/22 · ↑ 活跃', enter: EV.card2Enter, count: EV.card2Count},
  {k: 'arXiv cs.CL 计算语言学', to: 159, unit: ' 篇', n: '10/22 · ↑ 活跃', enter: EV.card3Enter, count: EV.card3Count},
];

const ROW2_CARDS: CardSpec[] = [
  {k: 'NeurIPS 2026 录用论文', to: 9000, unit: ' 篇', n: '历史新高', plus: true, enter: EV.card4Enter, count: EV.card4Count},
  {
    k: 'HuggingFace · 今日 Top 1',
    to: 224,
    unit: ' 票',
    n: 'Focused GUI Agent',
    accentNumber: true,
    enter: EV.card5Enter,
    count: EV.card5Count,
    accentFrame: EV.card5Accent,
  },
  {
    k: 'HuggingFace · 下载榜首',
    to: 42.1,
    unit: ' 下载',
    n: 'DeepSeek-V4.1-Flash (5天)',
    isK: true,
    accentNumber: true,
    enter: EV.card6Enter,
    count: EV.card6Count,
    accentFrame: EV.card6Accent,
  },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 标题块
  const kicker = enter(f, EV.kicker, {dur: 16, rise: 10});
  const h1 = enter(f, EV.h1, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.underline, 16);
  const sub = enter(f, EV.sub, {dur: 16, rise: 14});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      {/* 顶部标题区 */}
      <div style={{...kicker, display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, height: 30}}>
        <div style={{width: 18, height: 18, background: C.tertiary}} />
        <div style={{fontSize: 30, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
          今日焦点 · 全模态聚焦与开源推理
        </div>
      </div>

      <div style={{...TYPE.h1, color: C.primary, ...h1, marginTop: 10}}>GUI Agent 登顶</div>

      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />

      <div style={{...TYPE.subtitle, color: C.secondary, ...sub, marginTop: 16}}>
        开源推理模型新标杆 · 全模态聚焦架构与 MoE 部署突破
      </div>

      {/* 看点芯片行：3项芯片随关键词点亮入场 */}
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, height: 49}}>
        <Chip text="Focused GUI Agent · 224 票登顶" f={f} start={EV.chip1} />
        <Chip text="DeepSeek-V4.1-Flash · 763B MoE" f={f} start={EV.chip2} />
        <Chip text="单卡 RTX 4090 / A100 可跑" f={f} start={EV.chip3} />
      </div>

      {/* 数据卡区：2 行 × 3 列 */}
      <div
        style={{
          position: 'absolute',
          top: 480,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Row 1 */}
        <div style={{display: 'flex', gap: 24}}>
          {ROW1_CARDS.map((c) => {
            const val = Math.round(countTo(f, c.count, c.to, 50));
            return (
              <div key={c.k} style={{flex: 1, minWidth: 0}}>
                <DataCard
                  k={c.k}
                  value={fmt(val)}
                  unit={c.unit}
                  n={c.n}
                  f={f}
                  start={c.enter}
                />
              </div>
            );
          })}
        </div>

        {/* Row 2 */}
        <div style={{display: 'flex', gap: 24}}>
          {ROW2_CARDS.map((c) => {
            const isHot = !!c.accentFrame && f >= c.accentFrame;
            const pulse = c.accentFrame ? contactPulse(f, c.accentFrame, 1.05) : 1;
            let valStr = '';
            if (c.isK) {
              const num = countTo(f, c.count, c.to, 50);
              valStr = `${num.toFixed(1)}K`;
            } else {
              const num = Math.round(countTo(f, c.count, c.to, 50));
              valStr = `${fmt(num)}${c.plus && f >= c.count + 50 ? '+' : ''}`;
            }

            return (
              <div key={c.k} style={{flex: 1, minWidth: 0, transform: `scale(${pulse})`}}>
                <DataCard
                  k={c.k}
                  value={valStr}
                  unit={c.unit}
                  n={c.n}
                  hot={isHot}
                  accentNumber={c.accentNumber}
                  f={f}
                  start={c.enter}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
