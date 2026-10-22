// D02 Jeva System One 范式 · 分段组件（动态实现，2026-10-19）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1282f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D02_JevaSystemOne范式/ 三张已确认关键帧（论文身份帧＝初始态／双路对比帧＝变化态／数据卡组＝终帧）
//           ＋ 运动标注里的动态测试01 已校准参数（双路对比、接触换态、计数、停稳）。
// 重点审查：R1＝画面时间差是展示节奏，3-5× 只出现在数据卡文字；R5＝秒点按句级锚点对齐。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Chip, DataCard, Frame} from '../../../remotion-main/src/lib/ui';
import {C, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {countTo, enter, prog} from '../../../remotion-main/src/lib/motion';
import {双路对比} from './双路对比';
import {EV} from './秒点';

// 上屏文字＝设计图已确认值（必要上屏：Jeva: System One Models／新加坡国立大学／266 票今日第一／35B／3-5×／GPT-4 级别）
const H1 = 'Jeva: System One Models';
const SUB = '新加坡国立大学';

type CardSpec = {
  k: string; // 指标名（23px 次级）
  to: number; // 计数终值
  unit: string; // 单位／后缀，不参与计数；前导空格由调用方写进 unit（lib 不再自行加空格）
  n: string; // 注释行（23px 次级）
  suffixAtCountEnd?: boolean; // 后缀随计满出现（"3-5×" 的 "-5×"：不参与计数，也不与计数中的数字拼成"0-5×"）
  accentNumber?: boolean; // 数值 tertiary（设计图_数据卡组：卡2 整条 v 为 tertiary）
  accentUnit?: boolean;
  hot?: boolean; // 强调态：3px tertiary 边＋success 底（卡3 266 票，接住 D01「登顶」焦点、交棒 D03）
  enter: number;
  count: number; // 计数起始帧（60f）
};

// 行内顺序＝设计图终帧卡序（35B／3-5×／266 票）；入场顺序由配音词点决定（3-5× 最早，见接入说明「排点差异」）
const CARDS: CardSpec[] = [
  {k: '模型规模', to: 35, unit: 'B', n: '规模适中 · 适合部署', enter: EV.cardSizeEnter, count: EV.cardSizeCount},
  {
    k: '推理速度（vs CoT）',
    to: 3,
    unit: '-5×',
    n: '达 GPT-4 级别',
    suffixAtCountEnd: true,
    accentNumber: true,
    accentUnit: true,
    enter: EV.cardSpeedEnter,
    count: EV.cardSpeedCount,
  },
  {
    k: 'HuggingFace · Jeva',
    to: 266,
    unit: ' 票',
    n: '今日第一 · 登顶',
    hot: true,
    accentNumber: true,
    enter: EV.cardVotesEnter,
    count: EV.cardVotesCount,
  },
];

const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 标题块＝论文身份卡（候选A 已确认局部比例：kicker mt28 → h1 mt10 → 下划线 mt14 → 副题 mt16）
  const kicker = enter(f, EV.kicker, {dur: 16, rise: 10});
  const h1 = enter(f, EV.h1, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.underline, 16); // 宽度 0→120px
  const sub = enter(f, EV.sub, {dur: 16, rise: 14});

  return (
    <Frame
      footerLeft="AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命"
      footerRight="来源：arXiv · HuggingFace"
    >
      {/* kicker＝轻量章节行（18px 橙方块＋30px·字距4）；版式＝本段设计图提案；章号写法按 U1 统一到原稿 h2 口径（「一、」） */}
      <div style={{...kicker, display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, height: 30}}>
        <div style={{width: 18, height: 18, background: C.tertiary}} />
        <div style={{fontSize: 30, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
          一、前沿模型动态
        </div>
      </div>

      <div
        style={{
          ...TYPE.h1,
          color: C.primary,
          ...h1,
          marginTop: 10,
        }}
      >
        {H1}
      </div>

      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />

      {/* 副题行：who ＋ 概念标签 ＋ 强调态芯片（各自独立入场，槽位恒定，未入场项占位 opacity 0） */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, minHeight: 49}}>
        <div style={{...sub, fontSize: 30, color: C.secondary, lineHeight: 1.25, marginRight: 12}}>{SUB}</div>
        <Chip text="System One 范式" f={f} start={EV.chipConcept} />
        <Chip text="266 票 · 今日第一" hot f={f} start={EV.chipVotes} />
      </div>

      {/* 双路时间对比（左快右慢；R1：时间差是展示节奏，不是 3-5×） */}
      <双路对比 f={f} />

      {/* 数据卡组：设计图实测盒（画布 top821、三卡等大 gap32、高 149）；Frame 内层已含左右安全区 88 */}
      <div
        style={{
          position: 'absolute',
          top: 761, // 821（画布）－60（内层 top）
          left: 0,
          right: 0,
          display: 'flex',
          gap: 32,
          height: 149,
        }}
      >
        {CARDS.map((c) => {
          const done = f >= c.count + 60;
          const value = String(Math.round(countTo(f, c.count, c.to)));
          const unit = c.suffixAtCountEnd && !done ? '' : c.unit;
          return (
            // 外层给 flex:1＝设计图_数据卡组的三卡等宽（gap32→每卡 560）；lib DataCard 自身不定宽
            <div key={c.k} style={{flex: 1, minWidth: 0}}>
              <DataCard
                k={c.k}
                value={value}
                unit={unit}
                n={c.n}
                hot={c.hot || undefined}
                accentNumber={c.accentNumber || undefined}
                accentUnit={c.accentUnit || undefined}
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
