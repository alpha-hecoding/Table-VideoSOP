import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, Frame, Panel} from '../../../remotion-main/src/lib/ui';
import {C, CARD, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '二、Agent 架构与范式 · 四篇架构论文速览';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 16) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 尾部收画面：于 finalConverge 开始 16 帧淡出上浮，预留干净画布平滑接棒 D06
  const cv = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  // 4 张卡片分别按词点入场
  const c1 = enter(f, EV.card1Enter, {dur: 18, rise: 14});
  const c2 = enter(f, EV.card2Enter, {dur: 18, rise: 14});
  const c3 = enter(f, EV.card3Enter, {dur: 18, rise: 14});
  const c4 = enter(f, EV.card4Enter, {dur: 18, rise: 14});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      <div style={{...cv, flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* 轻量章节行 */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <ChapterLine
            no="02 · "
            name="Agent 架构与范式"
            tag="四篇核心论文速览 · 从 Demo 走向工程化"
            f={f}
            start={EV.chapLine}
          />
          {f >= EV.introBadge && (
            <div style={{marginBottom: 4}}>
              <Chip text="工程化 · 协议化 · 长期化 · 具身化" hot={true} f={f} start={EV.introBadge} />
            </div>
          )}
        </div>

        {/* 2×2 四宫格速览卡 */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 20,
            marginTop: 18,
            marginBottom: 12,
          }}
        >
          {/* 卡 1（左上）：Cache Engineering for Agents */}
          <div
            style={{
              ...CARD,
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
                  Cache Engineering for Agents
                </div>
                <div style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  缓存工程 · 降本增效
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                系统化解决长上下文带来的调用延迟与费用飙升
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="语义去重" f={f} start={EV.card1Chip1} />
                <Chip text="增量更新" f={f} start={EV.card1Chip2} />
                <Chip text="分层存储" f={f} start={EV.card1Chip2 + 6} />
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
              <b>核心机制：</b>三套组合机制大幅压减冗余 Token，高频调用延迟降低 60%+
            </div>
          </div>

          {/* 卡 2（右上）：Evolving Agent Interfaces */}
          <div
            style={{
              ...CARD,
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
                  Evolving Agent Interfaces
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  接口演化 · 协议自适应
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                打破固定 API 僵化限制，失败中自适应调整调用协议
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="打破固定 API" hot={true} f={f} start={EV.card2Chip1} />
                <Chip text="失败动态反思" f={f} start={EV.card2Impact} />
                <Chip text="自适应工具协议" f={f} start={EV.card2Impact + 6} />
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
              <b>核心机制：</b>工具接口不再静态受限，Agent 自动根据执行反馈动态协商调用格式
            </div>
          </div>

          {/* 卡 3（左下）：FlowState (蚂蚁国际) */}
          <div
            style={{
              ...CARD,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c3,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  FlowState
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  蚂蚁国际 · 状态记忆
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                执行状态即记忆，长周期任务中断后支持无缝热恢复
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="轻量状态快照" f={f} start={EV.card3Chip1} />
                <Chip text="决策意图追踪" f={f} start={EV.card3Chip1 + 6} />
                <Chip text="中断无缝恢复" hot={true} f={f} start={EV.card3Impact} />
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
              <b>核心机制：</b>将执行流程与决策意图快照持久化，多天复杂任务无需从头重算
            </div>
          </div>

          {/* 卡 4（右下）：S-Agent 2.0 */}
          <div
            style={{
              ...CARD,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c4,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  S-Agent 2.0
                </div>
                <div style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  空间推理 · 具身控制
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                将空间推理能力注入代码 Agent，直接驱动实体物理设备
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="3D 物理空间理解" f={f} start={EV.card4Chip1} />
                <Chip text="空间推理注入" f={f} start={EV.card4Chip1 + 6} />
                <Chip text="机械臂/无人机代码" hot={true} f={f} start={EV.card4Impact} />
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
              <b>核心机制：</b>跨越虚拟代码与物理世界鸿沟，生成符合 3D 动力学约束的高精度控制指令
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
