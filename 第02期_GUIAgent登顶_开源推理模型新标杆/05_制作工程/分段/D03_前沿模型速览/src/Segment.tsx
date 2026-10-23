import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, DataCard, Frame, Panel, ResultLabel} from '../../../remotion-main/src/lib/ui';
import {C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '一、前沿模型动态 · 前沿模型速览';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 14) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

/** 阶段 0：前奏与两大趋势总览（0 - 268f） */
const IntroSection: React.FC<{f: number}> = ({f}) => {
  const leadEnter = enter(f, EV.introLead, {dur: 18, rise: 16});
  const t1Enter = enter(f, EV.introTrend1, {dur: 18, rise: 16});
  const t2Enter = enter(f, EV.introTrend2, {dur: 18, rise: 16});
  const cv = converge(f, EV.mmEnter - 14, 14);

  return (
    <div style={{...cv, marginTop: 16}}>
      <div style={{...leadEnter}}>
        <h1 style={{...TYPE.h1, fontSize: 58, margin: 0, color: C.primary, lineHeight: 1.15}}>
          前沿模型速览 · 四项密集动作
        </h1>
        <div style={{...TYPE.subtitle, fontSize: 26, color: C.secondary, marginTop: 10}}>
          全面指向两大核心演进方向：极致降本 与 垂直专用
        </div>
      </div>

      <div style={{display: 'flex', gap: 24, marginTop: 36}}>
        {/* 趋势 1 */}
        <div style={{flex: 1, ...t1Enter}}>
          <Panel f={f} start={EV.introTrend1} style={{height: 460}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div style={{fontSize: 22, color: C.tertiary, fontWeight: 700}}>核心趋势 01</div>
              <div style={{fontSize: 20, color: C.secondary, background: C.system, padding: '3px 10px', borderRadius: 4}}>
                成本突破
              </div>
            </div>
            <div style={{fontSize: 34, fontWeight: 700, color: C.primary, marginBottom: 14}}>
              每 Token 更便宜 · 成本跳水
            </div>
            <div style={{display: 'flex', gap: 14, marginBottom: 20}}>
              <Chip text="降价 70%" hot={true} f={f} start={EV.introTrend1 + 8} />
              <Chip text="分层替代架构" f={f} start={EV.introTrend1 + 14} />
            </div>
            <div style={{background: C.canvas, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`}}>
              <div style={{fontSize: 20, color: C.primary, lineHeight: 1.6}}>
                • MiniMax 推出 M3.1 Flash，输入仅需 ¥1.0 / 百万 Token<br />
                • 在 Agent 架构中担任前置路由与格式化，整体调用成本直接下降 50%~70%
              </div>
            </div>
          </Panel>
        </div>

        {/* 趋势 2 */}
        <div style={{flex: 1, ...t2Enter}}>
          <Panel contrast={true} f={f} start={EV.introTrend2} style={{height: 460}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div style={{fontSize: 22, color: C.tertiary, fontWeight: 700}}>核心趋势 02</div>
              <div style={{fontSize: 20, color: C.primary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                形态突破
              </div>
            </div>
            <div style={{fontSize: 34, fontWeight: 700, color: C.primary, marginBottom: 14}}>
              垂直专用 ＋ 端侧极速轻量化
            </div>
            <div style={{display: 'flex', gap: 14, marginBottom: 20}}>
              <Chip text="消费级文生图 vs 822B" f={f} start={EV.introTrend2 + 8} />
              <Chip text="CPU 实时推理" hot={true} f={f} start={EV.introTrend2 + 14} />
            </div>
            <div style={{background: C.surface, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`}}>
              <div style={{fontSize: 20, color: C.primary, lineHeight: 1.6}}>
                • 上海 AI 实验室 5B 单卡文生图 vs Meta 822B 开源巨无霸<br />
                • Liquid AI 2B 激活端侧液态网络 ＋ Mistral 209M 时序小模型
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

/** 阶段 1：MiniMax M3.1 Flash（269 - 844f） */
const FrameMiniMax: React.FC<{f: number}> = ({f}) => {
  const idEnter = enter(f, EV.mmEnter, {dur: 18, rise: 16});
  const archEnter = enter(f, EV.mmPanelArch, {dur: 20, rise: 16});
  const cv = converge(f, EV.mmConverge, 14);

  return (
    <div style={{...cv, marginTop: 16}}>
      {/* 头部身份区 */}
      <div style={{...idEnter}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <h1 style={{...TYPE.h1, fontSize: 58, margin: 0, color: C.primary, lineHeight: 1.15}}>
            MiniMax M3.1 Flash
          </h1>
          <div style={{...TYPE.subtitle, fontSize: 26, color: C.tertiary, fontWeight: 700}}>
            API 成本跳水 70% · 分层调用降本新方案
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 12}}>
          <Chip text="API 成本直接跳水 70%" hot={true} f={f} start={EV.mmChips} />
          <Chip text="输入 ¥1.0 / 输出 ¥4.0" f={f} start={EV.mmChips + 6} />
          <Chip text="Agent 分层替代架构" f={f} start={EV.mmChips + 12} />
        </div>
      </div>

      {/* 数据卡组（3 列） */}
      <div style={{display: 'flex', gap: 18, marginTop: 20}}>
        <div style={{flex: 1}}>
          <DataCard
            k="API 综合成本"
            value="降价 70%"
            unit=""
            n="成本直接跳水"
            hot={true}
            accentNumber={true}
            f={f}
            start={EV.mmCard70p}
          />
        </div>
        <div style={{flex: 1}}>
          <DataCard
            k="输入价格 (Input)"
            value="¥1.0"
            unit=" /百万 tokens"
            n="低成本意图识别与路由"
            f={f}
            start={EV.mmCardInPrice}
          />
        </div>
        <div style={{flex: 1}}>
          <DataCard
            k="输出价格 (Output)"
            value="¥4.0"
            unit=" /百万 tokens"
            n="低成本格式化抽取"
            f={f}
            start={EV.mmCardOutPrice}
          />
        </div>
      </div>

      {/* Agent 分层调用架构面板 */}
      <div style={{...archEnter, marginTop: 22}}>
        <Panel f={f} start={EV.mmPanelArch} style={{padding: '20px 28px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <div style={{fontSize: 24, fontWeight: 700, color: C.primary}}>
              Agent 架构分层降本方案 (Tiered Routing)
            </div>
            {f >= EV.mmCostSaveBadge && (
              <ResultLabel text="整体调用成本降低 50% ~ 70%" f={f} start={EV.mmCostSaveBadge} />
            )}
          </div>

          <div style={{display: 'flex', gap: 20, alignItems: 'stretch'}}>
            {/* 前置层 */}
            <div
              style={{
                flex: 1,
                background: C.success,
                border: `2px solid ${C.tertiary}`,
                borderRadius: 8,
                padding: '14px 18px',
                ...enter(f, EV.mmTier1, {dur: 16, rise: 10}),
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <span style={{fontSize: 20, fontWeight: 700, color: C.tertiary}}>轻量前置路由层</span>
                <span style={{fontFamily: FONT_MONO, fontSize: 18, color: C.primary, fontWeight: 700}}>M3.1 Flash</span>
              </div>
              <div style={{fontSize: 18, color: C.primary, lineHeight: 1.5}}>
                • 意图识别 (Intent Recognition)<br />
                • 任务路由与请求分发 (Task Routing)<br />
                • 结构化输出与格式化抽取 (Formatting)
              </div>
              <div style={{fontSize: 16, color: C.tertiary, marginTop: 8, fontWeight: 700}}>
                承担 80% 高频浅层 Token · 极低消耗
              </div>
            </div>

            {/* 流程箭头 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: C.secondary,
                fontSize: 20,
                fontWeight: 700,
                padding: '0 8px',
              }}
            >
              <div>分流高难度任务</div>
              <div style={{fontSize: 28, color: C.tertiary}}>➔</div>
            </div>

            {/* 核心层 */}
            <div
              style={{
                flex: 1,
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: '14px 18px',
                ...enter(f, EV.mmTier2, {dur: 16, rise: 10}),
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <span style={{fontSize: 20, fontWeight: 700, color: C.primary}}>核心认知推理层</span>
                <span style={{fontFamily: FONT_MONO, fontSize: 18, color: C.secondary}}>高端推理模型</span>
              </div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 复杂代码生成与执行验证<br />
                • 多步深度逻辑推理与反思修正<br />
                • 关键业务决策与最终审核
              </div>
              <div style={{fontSize: 16, color: C.primary, marginTop: 8, fontWeight: 700}}>
                仅在高价值环节调用 · 杜绝算力浪费
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

/** 阶段 2：多模态双向爆发（846 - 1314f） */
const FrameMultimodal: React.FC<{f: number}> = ({f}) => {
  const leadEnter = enter(f, EV.multiEnter, {dur: 18, rise: 16});
  const mossEnter = enter(f, EV.mossPanel, {dur: 20, rise: 16});
  const museEnter = enter(f, EV.musePanel, {dur: 20, rise: 16});
  const cv = converge(f, EV.multiConverge, 14);

  return (
    <div style={{...cv, marginTop: 16}}>
      {/* 头部 */}
      <div style={{...leadEnter}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <h1 style={{...TYPE.h1, fontSize: 58, margin: 0, color: C.primary, lineHeight: 1.15}}>
            多模态领域双向爆发
          </h1>
          <div style={{...TYPE.subtitle, fontSize: 26, color: C.secondary}}>
            轻量文生图消费级普及 vs 822B 开源巨无霸旗舰
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 12}}>
          <Chip text="多模态双向爆发" f={f} start={EV.multiEnter + 6} />
          <Chip text="消费级单卡微调" hot={true} f={f} start={EV.multiEnter + 12} />
          <Chip text="822B MoE 开源规模纪录" f={f} start={EV.multiEnter + 18} />
        </div>
      </div>

      {/* 左右分栏对照 */}
      <div style={{display: 'flex', gap: 24, marginTop: 26}}>
        {/* 左栏：上海 AI 实验室 MOSS-Image 5B */}
        <div style={{flex: 1, ...mossEnter}}>
          <Panel f={f} start={EV.mossPanel} style={{height: 480, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div>
                <div style={{fontSize: 32, fontWeight: 700, color: C.primary}}>MOSS-Image 5B</div>
                <div style={{fontSize: 20, color: C.secondary, marginTop: 4}}>上海 AI 实验室 · 轻量文生图</div>
              </div>
              <div style={{fontSize: 20, color: C.tertiary, background: C.success, padding: '4px 12px', borderRadius: 4, fontWeight: 700}}>
                消费级友好
              </div>
            </div>

            <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="模型总参数"
                  value="5B"
                  unit=""
                  n="超轻量文生图架构"
                  f={f}
                  start={EV.mossCard5b}
                />
              </div>
              <div style={{flex: 1}}>
                <DataCard
                  k="部署与微调要求"
                  value="消费级单卡"
                  unit=""
                  n="单卡即可微调与生成"
                  hot={true}
                  accentNumber={true}
                  f={f}
                  start={EV.mossCardDeploy}
                />
              </div>
            </div>

            <div style={{background: C.canvas, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`, marginTop: 'auto'}}>
              <div style={{fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 6}}>技术突破要点</div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 打破文生图显存墙：普通消费级显卡（24G）即可完成全量微调与极速生成<br />
                • 个人创作者与边缘设备即开即用，显著降低视觉生成门槛
              </div>
            </div>
          </Panel>
        </div>

        {/* 右栏：Meta Muse Spark 822B */}
        <div style={{flex: 1, ...museEnter}}>
          <Panel contrast={true} f={f} start={EV.musePanel} style={{height: 480, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div>
                <div style={{fontSize: 32, fontWeight: 700, color: C.primary}}>Muse Spark</div>
                <div style={{fontSize: 20, color: C.secondary, marginTop: 4}}>Meta · 开源多模态巨无霸</div>
              </div>
              <div style={{fontSize: 20, color: C.primary, background: C.surface, padding: '4px 12px', borderRadius: 4, fontWeight: 700}}>
                开源旗舰标杆
              </div>
            </div>

            <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="总参数量 (MoE)"
                  value="822B"
                  unit=""
                  n="开源规模新纪录"
                  f={f}
                  start={EV.museCard822b}
                />
              </div>
              <div style={{flex: 1}}>
                <DataCard
                  k="实际激活参数"
                  value="42B"
                  unit=""
                  n="稀疏专家高效推理"
                  accentNumber={true}
                  f={f}
                  start={EV.museCardActive42b}
                />
              </div>
            </div>

            <div style={{background: C.surface, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`, marginTop: 'auto'}}>
              <div style={{fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 6}}>技术突破要点</div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 822B 混合专家架构：激活仅 42B，兼顾超大模型容量与计算效率<br />
                • 具备全面图文理解能力，开源社区在综合能力上全面对标商业旗舰
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

/** 阶段 3：端侧推理与长文记忆（1316 - 1734f） */
const FrameEdge: React.FC<{f: number}> = ({f}) => {
  const leadEnter = enter(f, EV.edgeEnter, {dur: 18, rise: 16});
  const liquidEnter = enter(f, EV.liquidPanel, {dur: 20, rise: 16});
  const tencentEnter = enter(f, EV.tencentPanel, {dur: 20, rise: 16});
  const cv = converge(f, EV.edgeConverge, 14);

  return (
    <div style={{...cv, marginTop: 16}}>
      {/* 头部 */}
      <div style={{...leadEnter}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <h1 style={{...TYPE.h1, fontSize: 58, margin: 0, color: C.primary, lineHeight: 1.15}}>
            端侧极速推理 ＋ 长对话记忆
          </h1>
          <div style={{...TYPE.subtitle, fontSize: 26, color: C.secondary}}>
            液态网络端侧落地 ＋ 专用长上下文记忆架构
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 12}}>
          <Chip text="液态神经网络 (LFM)" f={f} start={EV.edgeEnter + 6} />
          <Chip text="笔记本/手机流畅运行" hot={true} f={f} start={EV.edgeEnter + 12} />
          <Chip text="多轮对话拒绝失忆" f={f} start={EV.edgeEnter + 18} />
        </div>
      </div>

      {/* 左右分栏对照 */}
      <div style={{display: 'flex', gap: 24, marginTop: 26}}>
        {/* 左栏：Liquid AI LFM2.5 */}
        <div style={{flex: 1, ...liquidEnter}}>
          <Panel f={f} start={EV.liquidPanel} style={{height: 480, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div>
                <div style={{fontSize: 32, fontWeight: 700, color: C.primary}}>LFM2.5-24B-A2B</div>
                <div style={{fontSize: 20, color: C.secondary, marginTop: 4}}>Liquid AI · 液态神经网络</div>
              </div>
              <div style={{fontSize: 20, color: C.tertiary, background: C.success, padding: '4px 12px', borderRadius: 4, fontWeight: 700}}>
                非 Transformer
              </div>
            </div>

            <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="总参数量"
                  value="24B"
                  unit=" MoE"
                  n="动态液态网络架构"
                  f={f}
                  start={EV.liquidCard24b}
                />
              </div>
              <div style={{flex: 1}}>
                <DataCard
                  k="实际激活参数"
                  value="2B"
                  unit=""
                  n="端侧超低开销"
                  hot={true}
                  accentNumber={true}
                  f={f}
                  start={EV.liquidCard2b}
                />
              </div>
            </div>

            <div style={{background: C.canvas, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`, marginTop: 'auto'}}>
              <div style={{fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 6}}>端侧落地特性</div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 基于连续时间动态系统构建，推理计算复杂度大幅下降<br />
                • 能在普通笔记本与智能手机上流畅进行高帧率极速推理
              </div>
            </div>
          </Panel>
        </div>

        {/* 右栏：腾讯 Hy-Memory 30B */}
        <div style={{flex: 1, ...tencentEnter}}>
          <Panel contrast={true} f={f} start={EV.tencentPanel} style={{height: 480, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div>
                <div style={{fontSize: 32, fontWeight: 700, color: C.primary}}>Hy-Memory 30B</div>
                <div style={{fontSize: 20, color: C.secondary, marginTop: 4}}>腾讯 · 上下文记忆增强</div>
              </div>
              <div style={{fontSize: 20, color: C.primary, background: C.surface, padding: '4px 12px', borderRadius: 4, fontWeight: 700}}>
                记忆强化
              </div>
            </div>

            <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="模型参数规模"
                  value="30B"
                  unit=""
                  n="长上下文专精模型"
                  accentNumber={true}
                  f={f}
                  start={EV.tencentCard30b}
                />
              </div>
              <div style={{flex: 1}}>
                <DataCard
                  k="核心技术突破"
                  value="长程记忆"
                  unit=""
                  n="多轮对话拒绝失忆"
                  hot={true}
                  f={f}
                  start={EV.tencentCardMemory}
                />
              </div>
            </div>

            <div style={{background: C.surface, padding: '16px 20px', borderRadius: 6, border: `1px solid ${C.line}`, marginTop: 'auto'}}>
              <div style={{fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 6}}>痛点解决要点</div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 专门强化长对话历史记忆，精准保留关键交互状态与指令要求<br />
                • 杜绝多轮交互“失忆”与任务跑偏，为长程复杂 Agent 提供稳定支撑
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

/** 阶段 4：垂直专用极小模型（1736 - 1985f） */
const FrameMistral: React.FC<{f: number}> = ({f}) => {
  const leadEnter = enter(f, EV.mistralEnter, {dur: 18, rise: 16});
  const panelEnter = enter(f, EV.mistralPanel, {dur: 20, rise: 16});
  const cv = converge(f, EV.finalConverge, 16);

  return (
    <div style={{...cv, marginTop: 16}}>
      {/* 头部 */}
      <div style={{...leadEnter}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <h1 style={{...TYPE.h1, fontSize: 58, margin: 0, color: C.primary, lineHeight: 1.15}}>
            Mistral Timestral-209M
          </h1>
          <div style={{...TYPE.subtitle, fontSize: 26, color: C.tertiary, fontWeight: 700}}>
            大厂正式跨界进军 · 百兆级垂直专用小模型
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 12}}>
          <Chip text="仅 209M 超小参数" f={f} start={EV.mistralEnter + 6} />
          <Chip text="CPU 实时运行" hot={true} f={f} start={EV.mistralEnter + 12} />
          <Chip text="时间序列预测专用" f={f} start={EV.mistralEnter + 18} />
        </div>
      </div>

      {/* 全宽焦点面板 */}
      <div style={{...panelEnter, marginTop: 22}}>
        <Panel f={f} start={EV.mistralPanel} style={{padding: '24px 32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <div style={{fontSize: 26, fontWeight: 700, color: C.primary}}>
              Timestral-209M 极小时序预测规格
            </div>
            {f >= EV.mistralBadge && (
              <ResultLabel text="标志大厂正式进军垂直专用小模型" f={f} start={EV.mistralBadge} />
            )}
          </div>

          {/* 3 张数据卡 */}
          <div style={{display: 'flex', gap: 18, marginBottom: 22}}>
            <div style={{flex: 1}}>
              <DataCard
                k="超轻量参数量"
                value="209M"
                unit=""
                n="仅两亿参数专用模型"
                accentNumber={true}
                f={f}
                start={EV.mistralCard209m}
              />
            </div>
            <div style={{flex: 1}}>
              <DataCard
                k="运行硬件门槛"
                value="CPU 实时"
                unit=""
                n="彻底摆脱高端 GPU 依赖"
                hot={true}
                accentNumber={true}
                f={f}
                start={EV.mistralCardCpu}
              />
            </div>
            <div style={{flex: 1}}>
              <DataCard
                k="垂直专精领域"
                value="时序预测"
                unit=""
                n="时间序列专用架构"
                f={f}
                start={EV.mistralCardSpec}
              />
            </div>
          </div>

          {/* 底部两栏分析 */}
          <div style={{display: 'flex', gap: 20}}>
            <div
              style={{
                flex: 1,
                background: C.canvas,
                padding: '16px 20px',
                borderRadius: 6,
                border: `1px solid ${C.line}`,
              }}
            >
              <div style={{fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 6}}>算力与落地颠覆</div>
              <div style={{fontSize: 18, color: C.secondary, lineHeight: 1.5}}>
                • 无需昂贵显卡：直接在普通 CPU 上以毫秒级延迟实现实时预测<br />
                • 极轻硬件负载，能够快速嵌入各类工业物联网设备与终端系统
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: C.success,
                padding: '16px 20px',
                borderRadius: 6,
                border: `1px solid ${C.tertiary}`,
              }}
            >
              <div style={{fontSize: 20, fontWeight: 700, color: C.tertiary, marginBottom: 6}}>行业风向变动</div>
              <div style={{fontSize: 18, color: C.primary, lineHeight: 1.5}}>
                • 顶级模型厂商不再单纯卷大模型体量，而是加速切入高价值专用赛道<br />
                • 针对高频垂直场景推出百兆级小模型，已成为开源生态全新突破口
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 尾部收画面：在 finalConverge 时章节行连同终帧主体淡出上浮，留出干净画布转 D04
  const kickerConverge = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      {/* 顶部章节行：承接 D02，在整个 D03 恒定停稳，直至末尾 z1 收齐 */}
      <div style={{...kickerConverge}}>
        <ChapterLine
          no="01 · "
          name="前沿模型动态"
          tag="四大前沿动态 · 密集演进"
          f={f}
          start={EV.chapLine}
        />
      </div>

      {/* 5 阶段顺次切换 */}
      {f < EV.mmEnter && <IntroSection f={f} />}
      {f >= EV.mmEnter && f < EV.mmConverge + 14 && <FrameMiniMax f={f} />}
      {f >= EV.mmConverge + 14 && f < EV.multiConverge + 14 && <FrameMultimodal f={f} />}
      {f >= EV.multiConverge + 14 && f < EV.edgeConverge + 14 && <FrameEdge f={f} />}
      {f >= EV.edgeConverge + 14 && <FrameMistral f={f} />}
    </Frame>
  );
};

export default Segment;
