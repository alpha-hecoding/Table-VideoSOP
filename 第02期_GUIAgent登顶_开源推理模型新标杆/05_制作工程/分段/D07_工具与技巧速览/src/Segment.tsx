import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, Frame} from '../../../remotion-main/src/lib/ui';
import {C, CARD, FONT_MONO} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '四、AI 工具与技巧 · 落地工具与评估门禁';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 16) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 尾部收画面：于 finalConverge 开始 16 帧淡出上浮，预留干净画布平滑接棒 D08
  const cv = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  // 左侧 4 项清单按秒点错峰入场
  const it1 = enter(f, EV.item1Enter, {dur: 16, rise: 10});
  const it2 = enter(f, EV.item2Enter, {dur: 16, rise: 10});
  const it3 = enter(f, EV.item3Enter, {dur: 16, rise: 10});
  const it4 = enter(f, EV.item4Enter, {dur: 16, rise: 10});

  // 右侧三门禁大面板入场
  const gp = enter(f, EV.gatePanelEnter, {dur: 18, rise: 14});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      <div style={{...cv, flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* 轻量章节行 */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <ChapterLine
            no="04 · "
            name="AI 工具与技巧"
            tag="四套工程落地实用工具与加固指南"
            f={f}
            start={EV.chapLine}
          />
          {f >= EV.introBadges && (
            <div style={{marginBottom: 4, display: 'flex', gap: 8}}>
              <Chip text="协议集成 · 推理加速 · 评估门禁 · 护栏双保险" hot={true} f={f} start={EV.introBadges} />
            </div>
          )}
        </div>

        {/* 左右分栏：左侧 4 项工具清单，右侧 AI 评估三门禁数据面板 */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '980px 744px',
            gap: 20,
            marginTop: 18,
            marginBottom: 12,
          }}
        >
          {/* 左侧：4 项工程落地清单 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {/* 项 1：Microsoft Agent Framework + MCP */}
            <div
              style={{
                ...CARD,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                ...it1,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 18, color: C.secondary, fontWeight: 700}}>01</div>
                  <div style={{fontSize: 22, fontWeight: 700, color: C.primary}}>
                    Microsoft Agent Framework + MCP
                  </div>
                </div>
                <div style={{fontSize: 14, color: C.primary, background: C.system, padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  微软官方 · 协议集成
                </div>
              </div>
              <div style={{fontSize: 17, color: C.secondary, margin: '6px 0'}}>
                全面支持本地 Model Context Protocol，标准化协议动态发现与挂载本地工具
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="Python Agent 365" f={f} start={EV.item1Chip1} />
                <Chip text="C# Semantic Kernel" f={f} start={EV.item1Chip1 + 6} />
                <Chip text="本地工具动态挂载" hot={true} f={f} start={EV.item1Impact} />
              </div>
            </div>

            {/* 项 2：DeepSeek DeepInfer 部署实践 */}
            <div
              style={{
                ...CARD,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                ...it2,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 18, color: C.secondary, fontWeight: 700}}>02</div>
                  <div style={{fontSize: 22, fontWeight: 700, color: C.primary}}>
                    DeepInfer MoE 生产级部署调优
                  </div>
                </div>
                <div style={{fontSize: 14, color: C.primary, background: C.system, padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  生产调优 · 吞吐翻倍
                </div>
              </div>
              <div style={{fontSize: 17, color: C.secondary, margin: '6px 0'}}>
                结合 FP8 量化与动态批处理（Dynamic Batching），极致压榨大模型显存吞吐
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="FP8 量化协同" f={f} start={EV.item2Chip1} />
                <Chip text="动态批处理调度" f={f} start={EV.item2Chip1 + 6} />
                <Chip text="显存减半 · 吞吐翻倍" hot={true} f={f} start={EV.item2Impact} />
              </div>
            </div>

            {/* 项 3：AI 功能评估三门禁框架 */}
            <div
              style={{
                ...CARD,
                border: f >= EV.gatePanelEnter ? `2px solid ${C.tertiary}` : CARD.border,
                background: f >= EV.gatePanelEnter ? '#FFFDF8' : CARD.background,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                ...it3,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 18, color: C.tertiary, fontWeight: 700}}>03</div>
                  <div style={{fontSize: 22, fontWeight: 700, color: C.primary}}>
                    AI 功能评估三门禁框架
                  </div>
                </div>
                <div style={{fontSize: 14, color: C.tertiary, background: C.success, padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  核心质检 · 上线硬指标
                </div>
              </div>
              <div style={{fontSize: 17, color: C.secondary, margin: '6px 0'}}>
                上线前严格设置三大卡点门禁，以量化指标杜绝慢吞吐、高成本与幻觉风险
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="延迟门禁" hot={true} f={f} start={EV.gate1Highlight} />
                <Chip text="成本门禁" hot={true} f={f} start={EV.gate2Highlight} />
                <Chip text="可靠性门禁" hot={true} f={f} start={EV.gate3Highlight} />
              </div>
            </div>

            {/* 项 4：Agentic DevOps 护栏设计 */}
            <div
              style={{
                ...CARD,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                ...it4,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 18, color: C.secondary, fontWeight: 700}}>04</div>
                  <div style={{fontSize: 22, fontWeight: 700, color: C.primary}}>
                    Agentic DevOps 护栏与双保险
                  </div>
                </div>
                <div style={{fontSize: 14, color: C.primary, background: C.system, padding: '2px 8px', borderRadius: 4, fontWeight: 700}}>
                  生产安全 · 防御底线
                </div>
              </div>
              <div style={{fontSize: 17, color: C.secondary, margin: '6px 0'}}>
                为自主修复和自动化部署构建安全隔离区，防止 Agent 逃逸与高危失误
              </div>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <Chip text="容器沙箱强隔离" f={f} start={EV.item4Chip1} />
                <Chip text="高危操作人工审核" hot={true} f={f} start={EV.item4Chip1 + 6} />
                <Chip text="自动化部署双保险" f={f} start={EV.item4Chip1 + 12} />
              </div>
            </div>
          </div>

          {/* 右侧：AI 评估三门禁数据大面板（R3 核心焦点） */}
          <div
            style={{
              ...CARD,
              border: `2px solid ${C.tertiary}`,
              boxShadow: '0 8px 24px rgba(242, 107, 29, 0.12)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...gp,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                <div style={{fontSize: 24, fontWeight: 700, color: C.primary}}>
                  AI 功能评估三门禁框架
                </div>
                <div style={{fontSize: 15, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  上线前必过标准
                </div>
              </div>
              <div style={{fontSize: 16, color: C.secondary, marginBottom: 20}}>
                企业级落地量化准绳，拒绝对话 Demo 生硬直接上线
              </div>

              {/* 门禁卡 1：延迟性能门禁 */}
              <div
                style={{
                  background: C.canvas,
                  border: f >= EV.gate1Highlight ? `1.5px solid ${C.tertiary}` : `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '14px 18px',
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{fontSize: 16, color: C.secondary, fontWeight: 700, marginBottom: 4}}>门禁 01 · 性能延迟</div>
                  <div style={{fontSize: 15, color: C.primary}}>高频接口交互保障响应时延</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 32, fontWeight: 800, color: C.tertiary}}>P95 &lt; 2s</div>
                  <div style={{fontSize: 13, color: C.secondary}}>峰值响应门禁</div>
                </div>
              </div>

              {/* 门禁卡 2：成本门禁 */}
              <div
                style={{
                  background: C.canvas,
                  border: f >= EV.gate2Highlight ? `1.5px solid ${C.tertiary}` : `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '14px 18px',
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{fontSize: 16, color: C.secondary, fontWeight: 700, marginBottom: 4}}>门禁 02 · 单次成本</div>
                  <div style={{fontSize: 15, color: C.primary}}>分层替代控制单次调用费用</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 32, fontWeight: 800, color: C.tertiary}}>&lt; ¥0.01</div>
                  <div style={{fontSize: 13, color: C.secondary}}>单次调用上限</div>
                </div>
              </div>

              {/* 门禁卡 3：可靠性门禁 */}
              <div
                style={{
                  background: C.canvas,
                  border: f >= EV.gate3Highlight ? `1.5px solid ${C.tertiary}` : `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{fontSize: 16, color: C.secondary, fontWeight: 700, marginBottom: 4}}>门禁 03 · 可靠覆盖</div>
                  <div style={{fontSize: 15, color: C.primary}}>严防幻觉输出与失序逃逸</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 800, color: C.primary}}>幻觉覆盖率 100%</div>
                  <div style={{fontSize: 13, color: C.secondary}}>安全基准测试</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 16,
                color: C.primary,
                lineHeight: 1.4,
                marginTop: 16,
              }}
            >
              <b>工程准则：</b>三项门禁全部自动化接入 CI/CD 流水线，任何一项超标即自动阻断发布
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
