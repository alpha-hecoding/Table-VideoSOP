import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Chip, DataCard, Frame, Panel, ResultLabel} from '../../../remotion-main/src/lib/ui';
import {C, FONT_MONO, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {contactPulse, countTo, EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const CHAPTER_KICKER = 'CHAPTER 02';
const CHAPTER_H1 = '二、Agent 架构与范式';
const CHAPTER_SUB = '第二主线 · Agent 架构迎来标杆突破';
const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 16) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

/** 镜 A：章节大卡帧（0 - 214f） */
const ChapterCardFrame: React.FC<{f: number}> = ({f}) => {
  const kicker = enter(f, EV.kicker, {dur: 16, rise: 10});
  const h1 = enter(f, EV.h1, {dur: 20, rise: 20});
  const underlineW = 120 * prog(f, EV.underline, 16);
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
      <div style={{...sub, fontSize: 30, color: C.secondary, lineHeight: 1.25, marginTop: 16, height: 38}}>
        {CHAPTER_SUB}
      </div>
    </div>
  );
};

/** 镜 B：全模态聚焦架构核心画布（214 - 1461f） */
const ArchitectureCanvas: React.FC<{f: number}> = ({f}) => {
  const ident = enter(f, EV.ident, {dur: 16, rise: 14});
  const pVotes = Math.round(countTo(f, EV.countVotes, 224, {dur: 45}));

  // 动态聚焦状态判定
  const isState1 = f >= EV.focusState1 && f < EV.focusState2; // 聚焦 UI 元素树
  const isState2 = f >= EV.focusState2; // 聚焦 屏幕截图
  const pulseState1 = isState1 ? contactPulse(f, EV.focusState1, 1.05) : 1;
  const pulseState2 = isState2 ? contactPulse(f, EV.focusState2, 1.05) : 1;

  // 4 模态卡入场
  const m1 = enter(f, EV.modal1, {dur: 14, rise: 10});
  const m2 = enter(f, EV.modal2, {dur: 14, rise: 10});
  const m3 = enter(f, EV.modal3, {dur: 14, rise: 10});
  const m4 = enter(f, EV.modal4, {dur: 14, rise: 10});

  // 中央选择器与动作输出入场
  const selector = enter(f, EV.selectorEnter, {dur: 18, rise: 14});
  const action = enter(f, EV.actionNodeEnter, {dur: 18, rise: 14});
  const dataRow = enter(f, EV.dataRowEnter, {dur: 16, rise: 12});

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      {/* 顶部论文身份栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
          minHeight: 48,
        }}
      >
        <div style={{...ident, display: 'flex', alignItems: 'baseline', gap: 16}}>
          <span style={{fontSize: 34, fontWeight: 700, color: C.primary}}>
            Focused Omni-Modal GUI Agents
          </span>
          <span style={{fontSize: 24, color: C.secondary}}>
            南洋理工大学 (NTU)
          </span>
        </div>
        <Chip
          text={`🏆 HuggingFace 论文榜首 · ${pVotes} 票`}
          hot={true}
          f={f}
          start={EV.chipVotes}
        />
      </div>

      {/* 中部核心架构流转区（三栏：4模态输入 ➔ 动态选择器 ➔ 动作执行） */}
      <div style={{display: 'flex', gap: 20, marginTop: 18, height: 530}}>
        {/* 左栏：4 大输入模态 */}
        <div style={{flex: 1.15, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 22, fontWeight: 700, color: C.primary, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>全模态输入层 (Omni-Modal)</span>
            {f < EV.archTitle ? (
              <span style={{fontSize: 16, color: '#C0392B', background: C.system, padding: '2px 8px', borderRadius: 4}}>
                传统方案：仅单模态
              </span>
            ) : (
              <span style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                4 模态完整接入
              </span>
            )}
          </div>

          {f < EV.archTitle ? (
            /* 传统单一模态对比态（灰显警告） */
            <Panel
              f={f}
              start={EV.singleModalEnter}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: '2px dashed #C0392B',
                background: '#FFF5F5',
              }}
            >
              <div style={{fontSize: 24, fontWeight: 700, color: '#C0392B', marginBottom: 12}}>
                ⚠️ 传统桌面 GUI Agent 瓶颈
              </div>
              <div style={{fontSize: 18, color: C.primary, lineHeight: 1.6}}>
                • 大多仅依赖<b>单一屏幕截图</b>作为视觉模态输入<br />
                • 极易丢失上下文信息，无法准确辨识复杂控件层级与结构<br />
                • 在复杂桌面交互中频现“看不懂、点不对、漏指令”等致命失误
              </div>
              {f >= EV.singleModalWarning && (
                <div style={{marginTop: 18}}>
                  <ResultLabel text="经常出现看不懂按钮层级或漏掉上下文" f={f} start={EV.singleModalWarning} />
                </div>
              )}
            </Panel>
          ) : (
            /* 4 模态卡片列表 */
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              {/* 模态 1：屏幕截图 */}
              <div
                style={{
                  ...m1,
                  flex: 1,
                  background: isState2 ? C.success : C.surface,
                  border: `${isState2 ? 3 : 2}px solid ${isState2 ? C.tertiary : C.line}`,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transform: `scale(${pulseState2})`,
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{fontSize: 20, fontWeight: 700, color: isState2 ? C.tertiary : C.primary}}>
                    1. 屏幕截图 (Screenshot)
                  </div>
                  <div style={{fontSize: 16, color: C.secondary, marginTop: 2}}>
                    全局视觉布局 · 页面图文渲染与外观
                  </div>
                </div>
                {isState2 && (
                  <div style={{fontSize: 16, fontWeight: 700, color: C.tertiary, background: C.surface, padding: '3px 8px', borderRadius: 4}}>
                    当前聚焦 ●
                  </div>
                )}
              </div>

              {/* 模态 2：UI 元素树 */}
              <div
                style={{
                  ...m2,
                  flex: 1,
                  background: isState1 ? C.success : C.surface,
                  border: `${isState1 ? 3 : 2}px solid ${isState1 ? C.tertiary : C.line}`,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transform: `scale(${pulseState1})`,
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{fontSize: 20, fontWeight: 700, color: isState1 ? C.tertiary : C.primary}}>
                    2. UI 元素树 (DOM / A11y Tree)
                  </div>
                  <div style={{fontSize: 16, color: C.secondary, marginTop: 2}}>
                    控件层次结构 · 绝对坐标与可点击属性
                  </div>
                </div>
                {isState1 && (
                  <div style={{fontSize: 16, fontWeight: 700, color: C.tertiary, background: C.surface, padding: '3px 8px', borderRadius: 4}}>
                    当前聚焦 ●
                  </div>
                )}
              </div>

              {/* 模态 3：用户指令 */}
              <div
                style={{
                  ...m3,
                  flex: 1,
                  background: C.surface,
                  border: `2px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{fontSize: 20, fontWeight: 700, color: C.primary}}>
                    3. 用户指令 (User Instruction)
                  </div>
                  <div style={{fontSize: 16, color: C.secondary, marginTop: 2}}>
                    高层意图目标 · 约束条件与执行需求
                  </div>
                </div>
              </div>

              {/* 模态 4：操作历史 */}
              <div
                style={{
                  ...m4,
                  flex: 1,
                  background: C.surface,
                  border: `2px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{fontSize: 20, fontWeight: 700, color: C.primary}}>
                    4. 操作历史 (Action History)
                  </div>
                  <div style={{fontSize: 16, color: C.secondary, marginTop: 2}}>
                    多轮交互轨迹 · 前序状态与上下文跟踪
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 中栏：动态聚焦选择器（核心创新） */}
        <div style={{flex: 1.25, ...selector}}>
          <Panel
            f={f}
            start={EV.selectorEnter}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: `3px solid ${isState1 || isState2 ? C.tertiary : C.line}`,
              background: isState1 || isState2 ? C.surface : C.system,
              padding: '20px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div style={{fontSize: 24, fontWeight: 700, color: C.primary}}>
                动态聚焦选择器 (Dynamic Focus Selector)
              </div>
              <div style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                核心灵魂机制
              </div>
            </div>

            <div style={{fontSize: 18, color: C.secondary, marginBottom: 16}}>
              模型拒绝盲原生硬拼接全部数据，根据当前任务实时动态加权与自适应聚焦：
            </div>

            {/* 动态切换交互演示盒 */}
            <div
              style={{
                flex: 1,
                background: C.canvas,
                border: `2px solid ${isState1 || isState2 ? C.tertiary : C.line}`,
                borderRadius: 8,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 14,
              }}
            >
              {/* 聚焦场景 1 */}
              <div
                style={{
                  background: isState1 ? C.success : C.surface,
                  border: `2px solid ${isState1 ? C.tertiary : C.line}`,
                  borderRadius: 6,
                  padding: '12px 16px',
                  opacity: isState1 ? 1 : 0.7,
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: 20, fontWeight: 700, color: isState1 ? C.tertiary : C.primary}}>
                    🎯 场景一：定位精准控件
                  </span>
                  <span style={{fontSize: 16, fontWeight: 700, color: isState1 ? C.tertiary : C.secondary}}>
                    主导模态 ➔ UI 元素树
                  </span>
                </div>
                <div style={{fontSize: 16, color: C.secondary, marginTop: 4}}>
                  穿透像素混叠，精准锁定按钮 ID、文本标签与可交互树节点
                </div>
              </div>

              {/* 聚焦场景 2 */}
              <div
                style={{
                  background: isState2 ? C.success : C.surface,
                  border: `2px solid ${isState2 ? C.tertiary : C.line}`,
                  borderRadius: 6,
                  padding: '12px 16px',
                  opacity: isState2 ? 1 : 0.7,
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: 20, fontWeight: 700, color: isState2 ? C.tertiary : C.primary}}>
                    🖼️ 场景二：理解全局图文
                  </span>
                  <span style={{fontSize: 16, fontWeight: 700, color: isState2 ? C.tertiary : C.secondary}}>
                    主导模态 ➔ 屏幕截图
                  </span>
                </div>
                <div style={{fontSize: 16, color: C.secondary, marginTop: 4}}>
                  快速提取复杂排版、图表富视觉信息，把握全局页面上下文
                </div>
              </div>
            </div>

            {f >= EV.selectorBadge && (
              <div style={{marginTop: 14, display: 'flex', justifyContent: 'center'}}>
                <ResultLabel text="按任务自适应分配主导模态 · 杜绝盲目拼接" f={f} start={EV.selectorBadge} />
              </div>
            )}
          </Panel>
        </div>

        {/* 右栏：动作执行与反馈 */}
        <div style={{flex: 1, ...action}}>
          <Panel
            contrast={true}
            f={f}
            start={EV.actionNodeEnter}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{fontSize: 22, fontWeight: 700, color: C.primary, marginBottom: 12}}>
              动作执行与反馈 (Action)
            </div>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: '12px 16px'}}>
                <div style={{fontSize: 18, fontWeight: 700, color: C.primary}}>原子级桌面操作</div>
                <div style={{fontSize: 16, color: C.secondary, marginTop: 4}}>
                  Click / DoubleClick / Type / Drag / Scroll
                </div>
              </div>

              <div style={{background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: '12px 16px'}}>
                <div style={{fontSize: 18, fontWeight: 700, color: C.primary}}>多步长程流转</div>
                <div style={{fontSize: 16, color: C.secondary, marginTop: 4}}>
                  跨窗口、跨应用程序的端到端自动化完成
                </div>
              </div>

              <div
                style={{
                  background: C.success,
                  border: `2px solid ${C.tertiary}`,
                  borderRadius: 6,
                  padding: '14px 16px',
                  marginTop: 'auto',
                }}
              >
                <div style={{fontSize: 18, fontWeight: 700, color: C.tertiary, marginBottom: 4}}>
                  实测鲁棒性表现
                </div>
                <div style={{fontSize: 16, color: C.primary, lineHeight: 1.5}}>
                  复杂桌面评测任务中，动作成功率与抗干扰能力均达当前 SOTA 表现
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* 底部指标卡行 */}
      <div style={{...dataRow, display: 'flex', gap: 20, marginTop: 18, height: 149}}>
        <div style={{flex: 1}}>
          <DataCard
            k="HuggingFace 今日论文榜首"
            value="224"
            unit=" 票"
            n="Focused Omni-Modal GUI"
            hot={true}
            accentNumber={true}
            f={f}
            start={EV.countVotes}
          />
        </div>
        <div style={{flex: 1}}>
          <DataCard
            k="核心技术突破"
            value="4 模态融合"
            unit=""
            n="截图 + UI树 + 指令 + 历史"
            f={f}
            start={EV.cardAccuracy}
          />
        </div>
        <div style={{flex: 1}}>
          <DataCard
            k="基准表现与成效"
            value="大幅提升"
            unit=""
            n="桌面任务准确度与鲁棒性"
            hot={true}
            f={f}
            start={EV.cardAccuracy + 10}
          />
        </div>
      </div>
    </div>
  );
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();
  const inChapter = f < EV.cut;

  // 尾部收画面：于 finalConverge 开始 16 帧淡出上浮，预留干净画布平滑接棒 D05
  const contentCv = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  return (
    <Frame
      footerLeft={FOOT_LEFT}
      footerRight={inChapter ? '二、Agent 架构与范式' : '二、Agent 架构与范式 · Focused GUI Agent'}
    >
      {inChapter ? (
        <ChapterCardFrame f={f} />
      ) : (
        <div style={{...contentCv, flex: 1}}>
          <ArchitectureCanvas f={f} />
        </div>
      )}
    </Frame>
  );
};

export default Segment;
