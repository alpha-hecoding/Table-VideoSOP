// D04 Agent-Reflex 反思闭环 · 分段组件（动态实现，2026-10-19）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1191f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D04_AgentReflex反思闭环/ 已确认设计图（章卡_设计图.png／设计图_闭环终态.png／
//   设计图_圆点推进态.png ＋ 设计图_design.html、章卡_design.html 的几何与版式参数），SVG viewBox 内坐标逐值照抄。
// 两镜：镜 A 章卡帧 f0–141（本期整章卡首现，本段负责落稳）→ 硬切 → 镜 B 内容帧 f142–1190。
//   硬切＝本期已确认语言（DESIGN componentBehavior.transition，切点两侧均为停稳态）。
// 重点审查：R2＝节点顺序/回环方向/反思模块位置严格照原稿，不增删节点，15-20% 与稿件一致；
//   R5＝秒点按句级锚点对齐；R6＝章卡版式只认候选A 已确认局部值。
// 必须保持：「路径先于对象出发完成」「状态改变与脉冲同帧」（DESIGN componentBehavior.path／contact）。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Chip, DataCard, Frame} from '../../../remotion-main/src/lib/ui';
import {C, FONT_MONO, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {countTo, enter, prog} from '../../../remotion-main/src/lib/motion';
import {闭环图} from './闭环图';
import {EV} from './秒点';

// 上屏文字＝设计图已确认值（必要上屏：Agent-Reflex、中国人民大学、193 票、闭环 4 词、15-20%、WebShop/ALFWorld）
const CHAPTER_KICKER = 'CHAPTER 02';
const CHAPTER_H1 = '二、Agent 架构与范式';
const CHAPTER_SUB = 'Agent 不只是执行，还要在执行后反思结果'; // 定稿 2.1 核心思想句（章卡副题）
const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';

// 镜 A：章卡帧（块体垂直居中＝安全区中心 548；版式参数＝候选A 已确认局部值，R6）
const 章卡帧: React.FC<{f: number}> = ({f}) => {
  const kicker = enter(f, EV.kicker, {dur: 16, rise: 10});
  const h1 = enter(f, EV.h1, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.underline, 16); // 宽度 0→120px
  const sub = enter(f, EV.sub, {dur: 16, rise: 14});
  return (
    <div style={{marginTop: 326}}>
      <div style={{...kicker, display: 'flex', alignItems: 'center', gap: 14, height: 30}}>
        <div style={{width: 18, height: 18, background: C.tertiary}} />
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 30,
            color: C.secondary,
            letterSpacing: LOCAL.kickerTracking,
            lineHeight: 1,
          }}
        >
          {CHAPTER_KICKER}
        </div>
      </div>
      <div style={{...TYPE.h1, color: C.primary, ...h1, marginTop: 10, height: 97}}>{CHAPTER_H1}</div>
      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />
      <div style={{...sub, fontSize: 30, color: C.secondary, lineHeight: 1.25, marginTop: 16, height: 38}}>{CHAPTER_SUB}</div>
    </div>
  );
};

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  const inChapter = f < EV.cut; // 硬切：章卡帧 → 内容帧（切点落在「中国人民大学的」词点）

  // 身份卡（论文名＋机构）与数据行：盒／字阶全部取自 tokens；入场由词点驱动（R5）
  const ident = enter(f, EV.ident, {dur: 16, rise: 14});
  const votesDone = f >= EV.countVotes + 60;
  const liftValue = `15-${Math.round(countTo(f, EV.countLift, 20))}%`; // 「15-」固定，只有 20 参与计数
  const votesValue = String(Math.round(countTo(f, EV.countVotes, 193)));

  return (
    <Frame
      footerLeft={FOOT_LEFT}
      footerRight={inChapter ? '二、Agent 架构与范式' : '二、Agent 架构与范式 · Agent-Reflex'}
      footerStart={EV.footer}
    >
      {inChapter ? (
        <章卡帧 f={f} />
      ) : (
        <>
          {/* 论文身份卡（D02 同型）：定稿 2.1 节原文＋票数芯片；芯片落在「HuggingFace 上 193 票」词点 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              marginTop: 18,
              minHeight: 49,
              fontSize: 30,
              lineHeight: 1.25,
              color: C.secondary,
            }}
          >
            <span style={ident}>
              Agent-Reflex：<b style={{color: C.primary, fontWeight: 700}}>Teaching Language Agents to Act Reflectively</b> · 中国人民大学
            </span>
            <Chip text="HuggingFace 193 票" f={f} start={EV.chipVotes} />
          </div>

          {/* 闭环流程图：6 节点环形＋回环线（R2：顺序/方向/位置照原稿）；盒 1744x620＝设计图实测 */}
          <div style={{marginTop: 12, height: 620}}>
            <闭环图 f={f} />
          </div>

          {/* 数据卡组：15-20%（数值 tertiary）＋WebShop·ALFWorld 芯片＋193 票；行高 149＝设计图实测 */}
          <div style={{marginTop: 16, height: 149, display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{flex: 1, minWidth: 0}}>
              <DataCard
                k="基准提升"
                value={liftValue}
                n="错误恢复显著增强"
                accentNumber
                f={f}
                start={EV.cardLift}
              />
            </div>
            <Chip text="WebShop · ALFWorld" f={f} start={EV.chipBench} />
            <div style={{flex: 1, minWidth: 0}}>
              <DataCard
                k="HuggingFace 热度"
                value={votesValue}
                unit={votesDone ? ' 票' : ''}
                n="Agent-Reflex"
                f={f}
                start={EV.cardVotes}
              />
            </div>
          </div>
        </>
      )}
    </Frame>
  );
};

export default Segment;
