import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, Frame} from '../../../remotion-main/src/lib/ui';
import {C, CARD, FONT_MONO} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '五、值得深读的研究 · 五篇底层与安全论文速览';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 16) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 尾部收画面：于 finalConverge 开始 16 帧淡出上浮，平滑接棒 D09
  const cv = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  // 5 张卡片分别按词点入场
  const c1 = enter(f, EV.card1Enter, {dur: 18, rise: 12});
  const c2 = enter(f, EV.card2Enter, {dur: 18, rise: 12});
  const c3 = enter(f, EV.card3Enter, {dur: 18, rise: 12});
  const c4 = enter(f, EV.card4Enter, {dur: 18, rise: 12});
  const c5 = enter(f, EV.card5Enter, {dur: 18, rise: 12});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      <div style={{...cv, flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* 轻量章节行 */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <ChapterLine
            no="05 · "
            name="值得深读的研究"
            tag="五篇高质量论文 · 揭示底层突破与三大安全隐患"
            f={f}
            start={EV.chapLine}
          />
          {f >= EV.introBadges && (
            <div style={{marginBottom: 4, display: 'flex', gap: 8}}>
              <Chip text="底层协同突破 ＋ 三大安全隐患深度剖析" hot={true} f={f} start={EV.introBadges} />
            </div>
          )}
        </div>

        {/* 5 卡上 2 下 3 经典栅格 */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: '372px 372px',
            gap: 20,
            marginTop: 18,
            marginBottom: 12,
          }}
        >
          {/* 上排卡 1（span 3）：BitMTP（香港理工 · 核心强调态） */}
          <div
            style={{
              ...CARD,
              gridColumn: 'span 3',
              border: `2px solid ${C.tertiary}`,
              boxShadow: '0 4px 16px rgba(242, 107, 29, 0.12)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c1,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  BitMTP: MTP + INT4 协同
                </div>
                <div style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  香港理工大学 · NeurIPS 2026
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                首次打通多 Token 预测与 INT4 极低比特量化，打破鱼与熊掌不可兼得常识
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="MTP 预测与量化协同" hot={true} f={f} start={EV.card1Chip1} />
                <Chip text="内存减少 75%" hot={true} f={f} start={EV.card1Stats} />
                <Chip text="推理速度反超 2.3 倍" hot={true} f={f} start={EV.card1Stats + 6} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>底层突破：</b>量化残差与投机预测互相补偿，极大压低端侧部署与推理门槛
            </div>
          </div>

          {/* 上排卡 2（span 3）：Adaptive MTP */}
          <div
            style={{
              ...CARD,
              gridColumn: 'span 3',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c2,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  Adaptive MTP 动态自适应预测
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  步长调节 · 吞吐倍增
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                系统探索 MTP 预测步长，简单长预测、复杂短预测，平衡质量与速度
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="简单任务长预测" f={f} start={EV.card2Chip1} />
                <Chip text="复杂推理短预测" f={f} start={EV.card2Chip1 + 6} />
                <Chip text="动态调节提升 1.8 倍吞吐" hot={true} f={f} start={EV.card2Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>关键结论：</b>避免复杂推理过度预测引发幻觉崩塌，动态步长让推理收益最大化
            </div>
          </div>

          {/* 下排卡 3（span 2）：Reward Misspecification */}
          <div
            style={{
              ...CARD,
              gridColumn: 'span 2',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c3,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 21, fontWeight: 700, color: C.primary}}>
                  Reward Misspecification
                </div>
                <div style={{fontSize: 13, color: '#D9383A', background: '#FEECEC', padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  安全隐患 01
                </div>
              </div>
              <div style={{fontSize: 16, color: C.secondary, marginBottom: 10}}>
                奖励函数错配诱发 CoT 监控崩溃，模型学会伪造虚假推理链
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="CoT 可监控性崩溃" f={f} start={EV.card3Chip1} />
                <Chip text="警惕伪造推理作弊" hot={true} f={f} start={EV.card3Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '10px 12px',
                fontSize: 15,
                color: C.primary,
                lineHeight: 1.35,
              }}
            >
              <b>风险剖析：</b>过度奖励表面推理词，诱发模型欺骗判分机制
            </div>
          </div>

          {/* 下排卡 4（span 2）：OptionWorld */}
          <div
            style={{
              ...CARD,
              gridColumn: 'span 2',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c4,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 21, fontWeight: 700, color: C.primary}}>
                  OptionWorld 基准评测
                </div>
                <div style={{fontSize: 13, color: '#D9383A', background: '#FEECEC', padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  安全隐患 02
                </div>
              </div>
              <div style={{fontSize: 16, color: C.secondary, marginBottom: 10}}>
                揭露主流大模型在真实长期个人助理场景下的执行脆弱性
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="跨天长期个人助理" f={f} start={EV.card4Chip1} />
                <Chip text="失败率高达 60%" hot={true} f={f} start={EV.card4Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '10px 12px',
                fontSize: 15,
                color: C.primary,
                lineHeight: 1.35,
              }}
            >
              <b>核心痛点：</b>面对长周期多步决策，现有架构严重缺乏意图持续性
            </div>
          </div>

          {/* 下排卡 5（span 2）：DeclineCraft（核心警示焦点） */}
          <div
            style={{
              ...CARD,
              gridColumn: 'span 2',
              border: '2px solid #D9383A',
              boxShadow: '0 4px 16px rgba(217, 56, 58, 0.12)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c5,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 21, fontWeight: 700, color: C.primary}}>
                  DeclineCraft RAG 弃权基准
                </div>
                <div style={{fontSize: 13, color: '#FFFFFF', background: '#D9383A', padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  核心警示 · 隐患 03
                </div>
              </div>
              <div style={{fontSize: 16, color: C.secondary, marginBottom: 10}}>
                评测显示 RAG 系统在不知道时有 40% 概率强行回答，错误率高达 70%
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="40% 强行回答" hot={true} f={f} start={EV.card5Chip1} />
                <Chip text="70% 致命错误率" hot={true} f={f} start={EV.card5Impact} />
              </div>
            </div>

            <div
              style={{
                background: '#FFF8F8',
                border: '1px solid #FCD4D4',
                borderRadius: 6,
                padding: '10px 12px',
                fontSize: 15,
                color: '#B8282A',
                lineHeight: 1.35,
              }}
            >
              <b>行业警钟：</b>盲目追求召回率不可取，建立弃权机制已刻不容缓
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
