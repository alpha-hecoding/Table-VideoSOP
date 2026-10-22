// D08 值得深读速览 · 分段组件（动态实现，2026-10-20；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1604f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D08_值得深读速览/ 已确认设计图（设计图_5卡速览帧.png＝终态：5 卡全落＋卡 4 强调态＋芯片；
//   设计图_5卡速览帧_强调态切换前.png＝卡 4 已落位仍默认态的中间态；设计图_5卡速览帧_标注.png＝出处与约束标注）
//   ＋ 设计图_5卡速览帧.html 的版式参数与 _work/measure.json 实测盒（卡组 1744×769，行 1 卡 860×372／行 2 卡 565×372，行列间距 24）。
// 结构：单镜内容帧、固定机位（剧本确认）。轻量章节行（本段头部，版式复用 D05 已确认样例、无标签）→ 5 卡上 2 下 3 逐句入场
//   → 卡 4 在「System 1」词点离散切强调态 → 芯片在「System 2」词点入场 → 卡 5 入场 → 5 卡停稳、焦点留卡 4 强调态。
//   无计数／路径／圆点；运动＝淡入＋上浮 10px／16f＋一次离散换态（DESIGN 已确认语言，对标动态测试01 卡组入场）。
// 重点审查：大段表执行索引 D08（强调对象＝卡 4 Hybrid Reasoning Agents，已在设计图阶段确认；强调态只服务当前焦点）；
//   R5＝秒点按句级锚点对齐（卡 1–5 入场点＝S3–S7 起句，换态／芯片＝S6 内「System 1」「System 2」实测词点，见 ./秒点.ts）。
// 必须保持：候选A 组件参数（lib tokens CARD／CHIP）；5 卡版式同构（三行骨架，卡 4 仅多一行芯片）；一个画面内 tertiary 只服务卡 4。
// 衔接：头部轻量章节行「五、值得深读的研究」归本段（D07 尾部收画面后）；尾部收画面＝5 卡停稳＋卡 4 强调态保持到本段末帧（不淡出），
//   D09 无章卡、直接连续。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Frame} from '../../../remotion-main/src/lib/ui';
import {速览卡, type 卡规格} from './速览卡';
import {EV} from './秒点';

// 必要上屏文字（任务书：论文名＋机构/票数＋一句启发）：逐字取自已确认设计图，内容出处＝定稿 §5.1–5.5
// 出处行按原稿实有字段填（§5.4／§5.5 原稿无机构与票数 → 用页数·图数／研究方法·核心发现，未编造事实）
const CARDS: 卡规格[] = [
  {name: 'Tev', meta: 'UCLA · Nanyun Peng 组', point: '训练关键在奖励设计：稀疏 → 密集', start: EV.k1, span: 3},
  {name: 'TPPO', meta: '71 票 · 数学/代码 +10-15%', point: 'RLHF / RLAIF 的改进方向', start: EV.k2, span: 3},
  {name: 'Vela', meta: 'AllSpark Research · 69 票', point: '人在回路新范式：从用户行为学习', start: EV.k3, span: 2},
  {
    name: 'Hybrid Reasoning Agents',
    meta: '45 页 · 12 图',
    point: '未来 Agent 的标准架构',
    start: EV.k4,
    span: 2,
    hotFrom: EV.hot, // 强调态：3px 边 line→tertiary、底 surface→success（离散单帧）
    chip: {text: 'System 1 + System 2', start: EV.chip}, // 主题回扣；默认态芯片（不新增第二个 tertiary 对象）
  },
  {name: 'DoubtLess', meta: '对比解码 · 加速 2-3 倍', point: '无需重训，现有模型可直接优化', start: EV.k5, span: 2},
];

const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';
const FOOT_RIGHT = '五、值得深读的研究';

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      {/* 轻量章节行（公共组件 ChapterLine，D05 已确认版式、D06–D08 共用；本段实例无标签） */}
      <ChapterLine no="五、" name="值得深读的研究" f={f} start={EV.chap} />

      {/* 5 卡上 2 下 3：盒 1744×769（measure.json 实测 215–983），六列栅格，行列间距 24
          卡 1–2 跨 3 列（860）／卡 3–5 跨 2 列（565）；强调卡卡 4 落在下排中列，卡盒中心 x＝960＝画面正中
          行高写死 372px＝measure.json 实测卡高（用 1fr 1fr 时 769 除不尽 → 下排 373，与设计图差 1px）
          盒高写死 769＝measure.json 实测值：外壳页脚带比设计图 html 矮约 9px，用 flex:1 会把差值摊进行高（同 D05／D07 处理）
          入场逐句驱动（R5）：卡 1–5 起点与卡 4 换态／芯片词点见 ./秒点.ts */}
      <div
        style={{
          flexShrink: 0,
          height: 769,
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: '372px 372px',
          gap: 24,
        }}
      >
        {CARDS.map((spec) => (
          <速览卡 key={spec.name} f={f} spec={spec} />
        ))}
      </div>
    </Frame>
  );
};

export default Segment;
