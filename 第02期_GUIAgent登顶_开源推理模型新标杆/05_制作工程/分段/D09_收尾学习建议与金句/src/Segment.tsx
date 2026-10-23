import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, Frame} from '../../../remotion-main/src/lib/ui';
import {C, CARD, CHIP, FONT_MONO, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';

type AdviceCardSpec = {
  no: string;
  name: string;
  point: string;
  focus: string;
  duration: string;
  tag: string;
  start: number;
  chipStart: number;
};

const ADVICE_CARDS: AdviceCardSpec[] = [
  {
    no: '建议 01',
    name: '部署 DeepSeek FP8',
    point: '单张 24G 显卡实测 763B',
    focus: '重点：DeepInfer 框架 ＋ 动态批处理',
    duration: '1-2 小时',
    tag: 'RTX 4090 / A100 可跑',
    start: EV.card1Enter,
    chipStart: EV.card1Chip,
  },
  {
    no: '建议 02',
    name: '精读 Focused GUI Agent',
    point: '全模态动态聚焦架构',
    focus: '重点：UI 树与视觉按任务动态加权',
    duration: '2-3 小时',
    tag: 'HuggingFace Top 1',
    start: EV.card2Enter,
    chipStart: EV.card2Chip,
  },
  {
    no: '建议 03',
    name: '实验 M3.1 分层路由',
    point: '分层 Agent 架构实测',
    focus: '重点：意图路由分层，成本降 50-70%',
    duration: '3-4 小时',
    tag: '成本跳水 70%',
    start: EV.card3Enter,
    chipStart: EV.card3Chip,
  },
];

const PRACTICE_TAGS = [
  {text: '单卡跑 763B MoE', start: EV.practiceChip1},
  {text: '落地多模态动态聚焦', start: EV.practiceChip2},
  {text: '构建分层降本链路', start: EV.practiceChip3},
];

const TOMORROW_CHIPS = [
  {text: 'NeurIPS 2026 论文精选解读', start: EV.outroChip1},
  {text: '长周期 Agent 工程化护栏', start: EV.outroChip2},
  {text: '文末查看 12+ 完整开源资源', start: EV.outroChip3},
];

/** 帧一：建议卡组帧（0 - 1060f） */
const CardsView: React.FC<{f: number}> = ({f}) => {
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <ChapterLine
          no="06 · "
          name="今日行动指南"
          tag="给技术人的三项立即可做实操建议"
          f={f}
          start={EV.chapLine}
        />
        {f >= EV.introLead && (
          <div style={{marginBottom: 4}}>
            <Chip text="实操检验 · 论文精读 · 分层降本" hot={true} f={f} start={EV.introLead} />
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginTop: 28,
          marginBottom: 16,
          maxHeight: 460,
        }}
      >
        {ADVICE_CARDS.map((card) => {
          const s = enter(f, card.start, {dur: 18, rise: 12});
          return (
            <div
              key={card.no}
              style={{
                ...CARD,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px 28px',
                ...s,
              }}
            >
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <span style={{fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: C.secondary}}>
                    {card.no}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.tertiary,
                      background: '#FDF1E8',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {card.duration}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.primary,
                    lineHeight: 1.25,
                    marginBottom: 10,
                  }}
                >
                  {card.name}
                </div>
                <div style={{fontSize: 17, fontWeight: 700, color: C.primary, marginBottom: 8}}>
                  {card.point}
                </div>
                <div style={{fontSize: 15, color: C.secondary, lineHeight: 1.4}}>
                  {card.focus}
                </div>
              </div>

              <div style={{display: 'flex', gap: 8, marginTop: 12}}>
                <Chip text={card.tag} hot={true} f={f} start={card.chipStart} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 下方实践速览芯片行 */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12}}>
        <div
          style={{
            ...enter(f, EV.introLead, {dur: 16, rise: 8}),
            fontSize: TYPE.body.fontSize,
            fontWeight: 700,
            color: C.secondary,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          核心收获
        </div>
        <div style={{display: 'flex', gap: 12}}>
          {PRACTICE_TAGS.map((p) => (
            <Chip key={p.text} text={p.text} f={f} start={p.start} />
          ))}
        </div>
      </div>
    </div>
  );
};

/** 帧二：金句帧（1061 - 1407f，重点审查 R6 保证停稳阅读 ≥3.5s） */
const QuoteView: React.FC<{f: number}> = ({f}) => {
  const kicker = enter(f, EV.kickerQuote, {dur: 16, rise: 12});
  const line1 = enter(f, EV.quoteLine1, {dur: 20, rise: 16});
  const line2 = enter(f, EV.quoteLine2, {dur: 20, rise: 16});
  const source = enter(f, EV.quoteSource, {dur: 16, rise: 10});

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
      }}
    >
      <div style={{maxWidth: 1480, width: '100%', display: 'flex', flexDirection: 'column'}}>
        {/* kicker */}
        <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 30, ...kicker}}>
          <div style={{width: 18, height: 18, background: C.tertiary, flexShrink: 0}} />
          <div
            style={{
              fontSize: TYPE.subtitle.fontSize,
              color: C.secondary,
              letterSpacing: LOCAL.kickerTracking,
              lineHeight: 1,
            }}
          >
            今日总结金句 · 范式演进
          </div>
        </div>

        {/* 金句大字 */}
        <div
          style={{
            marginTop: 32,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 2,
            lineHeight: 1.25,
            color: C.primary,
            ...line1,
          }}
        >
          “行业共识正从追求‘参数更大’，全面转向‘每 token 更便宜’；”
        </div>

        {/* 解读大字 */}
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.45,
            color: C.secondary,
            ...line2,
          }}
        >
          多模态动态聚焦与工程化护栏，正在让 Agent 真正跨越从实验 Demo 到可靠生产的鸿沟。
        </div>

        {/* 出处 */}
        <div
          style={{
            marginTop: 36,
            fontFamily: FONT_MONO,
            fontSize: 22,
            color: C.tertiary,
            fontWeight: 700,
            ...source,
          }}
        >
          —— AI 情报 · 第 02 期思考总结
        </div>
      </div>
    </div>
  );
};

/** 帧三：片尾卡（1408 - 1557f，像素级对齐 D01 标题块规范） */
const OutroView: React.FC<{f: number}> = ({f}) => {
  const kicker = enter(f, EV.outroKicker, {dur: 16, rise: 10});
  const title = enter(f, EV.outroTitle, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.outroUnderline, 16);
  const subtitle = enter(f, EV.outroSubtitle, {dur: 16, rise: 14});
  const note = enter(f, EV.outroNote, {dur: 16, rise: 8});

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* 顶部标题区（对齐 D01） */}
      <div style={{...kicker, display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, height: 30}}>
        <div style={{width: 18, height: 18, background: C.tertiary}} />
        <div style={{fontSize: 30, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
          下期预告 · 明日关注
        </div>
      </div>

      <div style={{...TYPE.h1, color: C.primary, ...title, marginTop: 10}}>
        AI 情报 · 下期见
      </div>

      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />

      <div style={{...TYPE.subtitle, color: C.secondary, ...subtitle, marginTop: 16}}>
        NeurIPS 2026 前沿解读 ＋ Agent 工程化实践
      </div>

      {/* 预告芯片行 */}
      <div style={{display: 'flex', gap: 14, marginTop: 36, height: 49}}>
        {TOMORROW_CHIPS.map((c) => (
          <Chip key={c.text} text={c.text} f={f} start={c.start} />
        ))}
      </div>

      {/* 底部提示 */}
      <div
        style={{
          marginTop: 64,
          fontSize: 22,
          color: C.secondary,
          lineHeight: 1.4,
          ...note,
        }}
      >
        完整资源链接已整理在文末 · 欢迎关注与交流
      </div>
    </div>
  );
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  const isCards = f < EV.cutToQuote;
  const isQuote = f >= EV.cutToQuote && f < EV.cutToOutro;
  const isOutro = f >= EV.cutToOutro;

  return (
    <Frame
      footerLeft={isOutro ? undefined : FOOT_LEFT}
      footerRight={isOutro ? undefined : isQuote ? '今日金句 · 范式演进' : '六、今日行动指南'}
    >
      {isCards && <CardsView f={f} />}
      {isQuote && <QuoteView f={f} />}
      {isOutro && <OutroView f={f} />}
    </Frame>
  );
};

export default Segment;
