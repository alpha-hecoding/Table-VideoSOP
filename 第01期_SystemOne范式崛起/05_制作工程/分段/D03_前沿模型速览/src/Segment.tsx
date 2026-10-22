// D03 前沿模型速览 · 分段组件（动态实现，2026-10-19；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝2267f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D03_前沿模型速览/ 五张已确认设计图（LFM2.5 帧＝初始态／LFM2.5 对比表＝变化态／
//   Qwen 帧／Muse_Wonder 帧／Argon 帧＝速览帧与终帧）＋运动标注里的动态测试01 已校准参数。
// 结构：4 帧同版式（ModelFrame）依次「入场 → 短停稳 → 帧收敛 12f」；LFM2.5 帧内挂对比表（静态数据面板）。
// 重点审查：大段表执行索引 D03＝每卡至多 名称＋1 数据＋1 行文字（4 帧均满足，Argon 帧数据位留空）；
//   R5＝秒点按句级锚点对齐（事件帧全部对齐 VTT 句级＋silencedetect 词组边界）。
// 焦点纪律：任一时刻单一焦点——表停稳期＝对比表行 1（本段唯一 tertiary），其余帧＝该帧标题块＋芯片行。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Frame} from '../../../remotion-main/src/lib/ui';
import {Kicker, ModelFrame, converge, type ModelFrameSpec} from './模型帧';
import {对比表} from './对比表';
import {CONV, EV} from './秒点';

// 必要上屏文字（任务书）：LFM2.5-24B-A2B／Qwen3.8-27B／Muse Wonder／Gemini 4 Argon／24B·2B／7.22M／主动记忆·主动专注
const LFM: ModelFrameSpec = {
  id: 'LFM2.5',
  h1: 'LFM2.5-24B-A2B',
  h1Start: EV.lfmH1,
  lineStart: EV.lfmLine,
  sub: 'Liquid AI',
  subStart: EV.lfmSub,
  dataChip: {
    // 空格位置＝设计图渲染结果（.chip 是 flex 容器：mono 位与后随文字之间的行首空格被剥掉，行尾空格保留）
    parts: [{t: '24B', mono: true}, {t: '总参 · '}, {t: '2B', mono: true}, {t: '激活 · MoE'}],
    start: EV.lfmChipData,
  },
  desc: '端侧大模型新标杆 · 手机/笔记本流畅运行',
  descStart: EV.lfmDesc,
  chips: [
    {parts: [{t: '液态神经网络'}], start: EV.lfmChip1},
    {parts: [{t: '图像/文本多模态输入'}], start: EV.lfmChip2},
  ],
};

const QWEN: ModelFrameSpec = {
  id: 'Qwen',
  h1: 'Qwen3.8-27B',
  h1Start: EV.qH1,
  lineStart: EV.qLine,
  sub: 'Qwen',
  subStart: EV.qSub,
  dataChip: {parts: [{t: '7.22M', mono: true}, {t: '下载'}], start: EV.qChipData},
  desc: 'Qwen 系列持续迭代 · 多模态旗舰',
  descStart: EV.qDesc,
  chips: [
    {parts: [{t: 'Qwen-Image-2.1-Turbo · 图像生成 '}, {t: '+40%', mono: true}], start: EV.qChip1},
    {parts: [{t: 'Qwen3.8-27B · 多模态旗舰'}], start: EV.qChip2},
    {parts: [{t: 'Qwen3.8-Flash-Next 180B · 超大杯旗舰'}], start: EV.qChip3},
  ],
};

const MUSE: ModelFrameSpec = {
  id: 'MuseWonder',
  h1: 'Muse Wonder',
  h1Start: EV.mH1,
  lineStart: EV.mLine,
  sub: 'Meta',
  subStart: EV.mSub,
  dataChip: {parts: [{t: '2026.10.12', mono: true}, {t: '发布'}], start: EV.mChipData},
  desc: '跨对话不再"失忆"，长任务不跑偏',
  descStart: EV.mDesc,
  chips: [
    {parts: [{t: '主动记忆 · 跨对话保留上下文'}], start: EV.mChip1},
    {parts: [{t: '主动专注 · 长任务不跑偏'}], start: EV.mChip2},
  ],
};

// Argon 帧：数据芯片位留空（稿件无已公布数值）＋注释行；版式位与其他三帧一致
const ARGON: ModelFrameSpec = {
  id: 'Gemini4Argon',
  h1: 'Gemini 4 Argon',
  h1Start: EV.aH1,
  lineStart: EV.aLine,
  sub: 'Google',
  subStart: EV.aSub,
  desc: 'Gemini 4 系列新变体',
  descStart: EV.aDesc,
  chips: [{parts: [{t: '针对特定任务优化'}], start: EV.aChip1}, {parts: [{t: '延续多模态能力'}], start: EV.aChip2}],
  note: {text: '细节待官方公布 · 来源：AIFOD 实时新闻', start: EV.aNote},
};

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  // Z1 尾部收画面：章节行＋Argon 帧主体 淡出＋上浮 10px（16f）；收齐后仅留顶栏＋页脚，交 D04 章卡
  const z = converge(f, EV.z1, 16);
  return (
    <Frame
      footerLeft="AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命"
      footerRight="来源：arXiv · HuggingFace"
    >
      {/* 章节行＝段级承接：D02 已停稳态 → 无入场、不重绘；仅 Z1 随全屏撤下 */}
      <Kicker f={f} style={z} />

      {f < EV.t1 + CONV && (
        <ModelFrame f={f} spec={LFM} convergeStart={EV.t1}>
          <对比表 f={f} />
        </ModelFrame>
      )}
      {f >= EV.t1 + CONV && f < EV.t2 + CONV && <ModelFrame f={f} spec={QWEN} convergeStart={EV.t2} />}
      {f >= EV.t2 + CONV && f < EV.t3 + CONV && <ModelFrame f={f} spec={MUSE} convergeStart={EV.t3} />}
      {f >= EV.t3 + CONV && <ModelFrame f={f} spec={ARGON} convergeStart={EV.z1} convergeDur={16} />}
    </Frame>
  );
};

export default Segment;
