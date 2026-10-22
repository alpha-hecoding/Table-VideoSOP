// D01 开场与数据速览 · 分段组件（动态实现，2026-10-19）
// 2026-10-20 按总控公告返修两处：数据卡改回 lib DataCard（强调态已补齐）；页脚改回外壳 Frame 的 footerStart。
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝880f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；不要在段内复制一份。
// 画面依据：03_视觉设计/D01_开场与数据速览/设计图_标题帧.png（早期态）＋设计图_终帧.png（终态）
//           ＋ 01_公共资产/版式模板/标题帧_开场.html（系列开场帧模板，结构不改，R4）。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Chip, DataCard, Frame} from '../../../remotion-main/src/lib/ui';
import {C, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {contactPulse, countTo, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

// 上屏文案＝设计图已确认值（看点五项压缩文案、五卡 k/v/n 文案），不改结构、配色与组件参数
const CHIPS = [
  'Jeva 登顶 HuggingFace',
  'Liquid AI 发布 LFM2.5',
  'NeurIPS 2026 收录 9000+ 篇',
  'Muse Wonder 主动记忆',
  'MiniCPM-V · Qwen3.8',
];

type CardSpec = {
  k: string; // 指标名（23px 次级）
  to: number; // 计数终值
  unit: string; // 单位（不参与计数）
  n: string; // 注释行（23px 次级）
  plus?: boolean; // 「＋」随计满出现，不参与计数
  accentNumber?: boolean; // 数值 tertiary（总览四-3：266 与 9,000+ 双强调保留）
  enter: number; // 入场起始帧
  count: number; // 计数起始帧（60f）
};

// 行内顺序＝设计图终帧的卡序（852／385／862／266 票／9,000+）；入场顺序由配音词点决定（卡4 最早）
const CARDS: CardSpec[] = [
  {k: 'arXiv cs.AI 新论文', to: 852, unit: ' 篇', n: '10/14 · ↑ 活跃', enter: EV.card1Enter, count: EV.card1Count},
  {k: 'arXiv cs.CL 新论文', to: 385, unit: ' 篇', n: '10/14 · ↑ 活跃', enter: EV.card2Enter, count: EV.card2Count},
  {k: 'arXiv cs.LG 新论文', to: 862, unit: ' 篇', n: '10/14 · ↑ 活跃', enter: EV.card3Enter, count: EV.card3Count},
  {k: 'HuggingFace · Jeva', to: 266, unit: ' 票', n: '今日 Top 1', enter: EV.card4Enter, count: EV.card4Count},
  {
    k: 'NeurIPS 2026 收录论文',
    to: 9000,
    unit: ' 篇',
    n: '历史新高',
    plus: true,
    accentNumber: true,
    enter: EV.card5Enter,
    count: EV.card5Count,
  },
];

// 千分位只作格式化，不参与计数
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 页脚两栏（来源型口径）：由外壳 Frame 绘制，入场＝线宽 0→100% ＋文字随后淡入（footerStart／footerDur）
const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';
const FOOT_RIGHT = '来源：arXiv · HuggingFace';

const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 标题块（候选A 已确认局部比例：kicker mt28 → h1 mt10 → 下划线 mt14 → 副题 mt16）
  const kicker = enter(f, EV.kicker, {dur: 16, rise: 10});
  const h1 = enter(f, EV.h1, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.underline, 16); // 宽度生长 0→120px
  const sub = enter(f, EV.sub, {dur: 16, rise: 14});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      <div style={{...kicker, display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, height: 30}}>
        <div style={{width: 18, height: 18, background: C.tertiary}} />
        <div style={{fontSize: 30, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
          Agent 架构与范式
        </div>
      </div>

      <div style={{...TYPE.h1, color: C.primary, ...h1, marginTop: 10}}>System One 范式崛起</div>

      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />

      <div style={{...TYPE.subtitle, color: C.secondary, ...sub, marginTop: 16}}>
        Agent 架构迎来反思革命
      </div>

      {/* 看点芯片行：mt24、gap14、单行 5 项；错峰 6f，位置恒定（未入场项占位 opacity 0） */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 24, height: 49}}>
        {CHIPS.map((text, i) => (
          <Chip key={text} text={text} f={f} start={EV.chip0 + i * EV.chipGap} />
        ))}
      </div>

      {/* 数据卡组：设计图实测盒（x88 起、top637、5 卡等大 gap24）；Frame 内层已含左右安全区 88 */}
      <div
        style={{
          position: 'absolute',
          top: 577, // 637（画布）－60（内层 top）
          left: 0,
          right: 0,
          display: 'flex',
          gap: 24,
        }}
      >
        {CARDS.map((c, i) => {
          const hot = i === 3 && f >= EV.card4Accent; // 本段高潮：266 票卡离散换态
          const pulse = i === 3 ? contactPulse(f, EV.card4Accent, 1.05) : 1;
          const done = f >= c.count + 60;
          const value = `${fmt(Math.round(countTo(f, c.count, c.to)))}${c.plus && done ? '+' : ''}`;
          return (
            <div key={c.k} style={{flex: 1, minWidth: 0, transform: `scale(${pulse})`}}>
              <DataCard
                k={c.k}
                value={value}
                unit={c.unit}
                n={c.n}
                hot={hot || undefined}
                accentNumber={c.accentNumber || undefined}
                f={f}
                start={c.enter}
              />
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

export default Segment;
