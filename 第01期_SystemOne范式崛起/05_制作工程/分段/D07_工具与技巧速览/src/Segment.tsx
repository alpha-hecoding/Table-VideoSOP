// D07 工具与技巧速览 · 分段组件（动态实现，2026-10-20；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1429f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D07_工具与技巧速览/ 已确认设计图（设计图_5行清单帧.png＝终态：5 行全落＋4 步子芯片已出现；
//   设计图_5行清单帧_子芯片入场前.png＝入场中间态，证明行高已预留）＋ 设计图_5行清单帧.html 的版式参数
//   与 _work/measure.json 实测盒（清单区 1744×769；行 1 高 213／行 2–5 高 125；行间距 14；子芯片行宽 746）。
// 结构：单镜内容帧、固定机位（剧本确认）。轻量章节行（本段头部，版式复用 D05 已确认样例、无标签）→ 单列 5 行逐句入场
//   → 行 1 内 4 步子芯片按逐项朗读出现 → 5 行整幅停稳。无计数／路径／圆点／强调态；运动＝淡入＋上浮 10px／16f＋错峰。
// 重点审查：大段表执行索引 D07（无样片要求：纯列表速览、与 D05／D06 同类型，入场语言已在测试01 验证）；
//   R5＝秒点按句级锚点对齐（行 1–5 入场点＝S3–S7 内该行名称的实测起点，子芯片＝S3 内逐项朗读的实测起点，见 ./秒点.ts）。
// 必须保持：候选A 组件参数（lib tokens CARD／CHIP）；5 行版式同构（序号＋名称＋要点各 1 行，行 1 仅多一行子芯片）。
// 衔接：头部轻量章节行「四、AI 工具与技巧」归本段（D06 尾部收画面后）；尾部收画面＝5 行停稳保持到本段末帧（不淡出），
//   「五、值得深读」章节行归 D08 头部。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Frame} from '../../../remotion-main/src/lib/ui';
import {清单行, type 行规格} from './清单行';
import {EV} from './秒点';

// 必要上屏文字（任务书：技巧名＋要点）：逐字取自已确认设计图，内容出处＝定稿稿件 §4.1–4.5
const ROWS: 行规格[] = [
  {
    no: '4.1',
    name: 'Claude Code 一致性工作流',
    point: '输出不稳定：同样的 prompt 结果不同',
    start: EV.k1,
    chips: [
      {text: '1 Spec 文档', start: EV.chip1},
      {text: '2 版本控制', start: EV.chip2},
      {text: '3 测试驱动', start: EV.chip3},
      {text: '4 上下文管理', start: EV.chip4},
    ],
  },
  {no: '4.2', name: '上下文压缩', point: '/compact 手动触发 · softThresholdTokens 控制自动阈值', start: EV.k2},
  {no: '4.3', name: 'ANTHROPIC_BASE_URL 配置', point: '路由到自定义 API 端点（代理 / 网关）', start: EV.k3},
  {no: '4.4', name: 'GitHub Trending 项目实战', point: '复现 Trending 项目 · 学代码结构 · 贡献 PR', start: EV.k4},
  {no: '4.5', name: 'Paper Digest 论文追踪利器', point: '每日论文摘要 · 会议高亮（NeurIPS 2026 已上线）', start: EV.k5},
];

const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';
const FOOT_RIGHT = '四、AI 工具与技巧';

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      {/* 轻量章节行（公共组件 ChapterLine，D05 已确认版式、D06–D08 共用；本段实例无标签） */}
      <ChapterLine no="四、" name="AI 工具与技巧" f={f} start={EV.chap} />

      {/* 单列 5 行清单：盒 1744×769（measure.json 实测 215–983），行间距 14，行 1 高 213／行 2–5 高 125（1.7fr : 1fr）
          盒高写死 769＝measure.json 实测值：外壳页脚带比设计图 html 矮约 9px，用 flex:1 会把差值摊进行高（同 D05 处理）
          入场逐句驱动（R5）：行 1–5 与 4 步子芯片起点见 ./秒点.ts */}
      <div
        style={{
          flexShrink: 0,
          height: 769,
          marginTop: 20,
          display: 'grid',
          gridTemplateRows: '1.7fr 1fr 1fr 1fr 1fr',
          gap: 14,
        }}
      >
        {ROWS.map((spec) => (
          <清单行 key={spec.no} f={f} spec={spec} />
        ))}
      </div>
    </Frame>
  );
};

export default Segment;
