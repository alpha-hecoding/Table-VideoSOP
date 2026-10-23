import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, DataCard, Frame, Panel} from '../../../remotion-main/src/lib/ui';
import {C, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {contactPulse, countTo, enter} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '一、前沿模型动态 · DeepSeek-V4.1-Flash';

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 顶部身份入场
  const idEnter = enter(f, EV.identityCard, {dur: 18, rise: 16});

  // 左右面板入场
  const leftPanel = enter(f, EV.leftPanelEnter, {dur: 20, rise: 20});
  const rightPanel = enter(f, EV.rightPanelEnter, {dur: 20, rise: 20});

  // 数值计算
  const p763 = Math.round(countTo(f, EV.card763bCount, 763, 40));
  const p42k = countTo(f, EV.metricDlCount, 42.1, 40).toFixed(1);
  const pLikes = Math.round(countTo(f, EV.metricLikeCount, 2160, 40));
  const pFp8 = Math.round(countTo(f, EV.deployCardEnter + 20, 3460, 40));

  // 高潮状态：单卡部署标签点亮换态与脉冲
  const isDeployHot = f >= EV.deployHot;
  const deployPulse = isDeployHot ? contactPulse(f, EV.deployHot, 1.05) : 1;

  // 部署对比展开
  const compareEnter = enter(f, EV.clusterCompare, {dur: 16, rise: 10});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      {/* 顶部章节行 */}
      <ChapterLine
        no="01 · "
        name="前沿模型动态"
        tag="头号焦点 · 开源推理新标杆"
        f={f}
        start={EV.chapLine}
      />

      {/* 模型身份区 */}
      <div style={{...idEnter, marginTop: 16}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
          <h1 style={{...TYPE.h1, fontSize: 62, margin: 0, color: C.primary, lineHeight: 1.1}}>
            DeepSeek-V4.1-Flash-1017
          </h1>
          <div style={{...TYPE.subtitle, fontSize: 26, color: C.tertiary, fontWeight: 700}}>
            763B 开源推理新标杆
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 14}}>
          <Chip text="763B MoE 混合专家架构" f={f} start={EV.leftChip1} />
          <Chip text="Image-Text-to-Text 多模态" f={f} start={EV.leftChip2} />
          <Chip text="单卡消费级显卡可跑 (FP8)" f={f} start={EV.rightChip1} />
        </div>
      </div>

      {/* 左右分栏核心内容区 */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 0,
          right: 0,
          display: 'flex',
          gap: 28,
        }}
      >
        {/* 左栏：763B 完整模型规格 */}
        <div style={{flex: 1, ...leftPanel}}>
          <Panel f={f} start={EV.leftPanelEnter} style={{height: 520, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
              <div style={{fontSize: 26, fontWeight: 700, color: C.primary}}>
                模型规格与架构特性
              </div>
              <div style={{fontSize: 22, color: C.secondary, background: C.system, padding: '4px 12px', borderRadius: 4}}>
                官方规格
              </div>
            </div>

            <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="总参数量 (MoE)"
                  value={`${p763}B`}
                  unit=""
                  n="大规模混合专家"
                  accentNumber={true}
                  f={f}
                  start={EV.card763bEnter}
                />
              </div>
              <div style={{flex: 1}}>
                <DataCard
                  k="发布 5 天下载量"
                  value={`${p42k}K`}
                  unit=" 次"
                  n={`收获点赞 ${pLikes.toLocaleString()}`}
                  f={f}
                  start={EV.metricsEnter}
                />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '16px 20px',
                marginTop: 'auto',
              }}
            >
              <div style={{fontSize: 22, fontWeight: 700, color: C.primary, marginBottom: 8}}>
                技术突破要点
              </div>
              <div style={{fontSize: 20, color: C.secondary, lineHeight: 1.5}}>
                • 采用稀疏 MoE 架构，实际推理仅激活部分专家，响应大幅提速<br />
                • 多模态原生支持：高质量处理复杂图表、文档与高精度代码<br />
                • 开源趋势榜首：位列 HuggingFace 当周趋势热度第一名
              </div>
            </div>
          </Panel>
        </div>

        {/* 右栏：开源社区 FP8 落地与单卡门槛 */}
        <div style={{flex: 1, ...rightPanel}}>
          <Panel
            contrast={true}
            f={f}
            start={EV.rightPanelEnter}
            style={{height: 520, display: 'flex', flexDirection: 'column'}}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
              <div style={{fontSize: 26, fontWeight: 700, color: C.primary}}>
                开源社区落地突破
              </div>
              <div style={{fontSize: 22, color: C.tertiary, background: C.success, padding: '4px 12px', borderRadius: 4, fontWeight: 700}}>
                3 天极速产出
              </div>
            </div>

            <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <DataCard
                  k="FP8 量化版下载 (3天)"
                  value={`${pFp8.toLocaleString()}`}
                  unit=" 次"
                  n="dealignai 未审查版"
                  f={f}
                  start={EV.rightPanelEnter + 20}
                />
              </div>
              <div style={{flex: 1, transform: `scale(${deployPulse})`}}>
                <DataCard
                  k="单卡运行要求 (FP8)"
                  value="24G 显存"
                  unit=""
                  n="RTX 4090 / A100 80G"
                  hot={isDeployHot}
                  accentNumber={true}
                  f={f}
                  start={EV.deployCardEnter}
                />
              </div>
            </div>

            {/* 部署门槛硬核对比 */}
            <div
              style={{
                ...compareEnter,
                background: C.surface,
                border: `2px solid ${isDeployHot ? C.tertiary : C.line}`,
                borderRadius: 6,
                padding: '16px 20px',
                marginTop: 'auto',
              }}
            >
              <div style={{fontSize: 22, fontWeight: 700, color: C.primary, marginBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
                <span>部署门槛颠覆性对比</span>
                <span style={{color: C.tertiary, fontSize: 20}}>R1 核验通过</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 20}}>
                <div style={{display: 'flex', justifyContent: 'space-between', color: C.secondary}}>
                  <span>原版 763B 全参部署：</span>
                  <span style={{color: '#C0392B', fontWeight: 700}}>需要 8×A100 集群（门槛极高）</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', color: C.primary, fontWeight: 700}}>
                  <span>社区 FP8 量化部署：</span>
                  <span style={{color: '#27AE60'}}>单张 RTX 4090 (24G) 即可直接运行</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
