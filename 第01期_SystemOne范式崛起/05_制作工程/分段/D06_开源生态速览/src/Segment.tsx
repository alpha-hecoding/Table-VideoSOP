// D06 开源生态速览 · 分段组件（动态实现，2026-10-20；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1660f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D06_开源生态速览/ 已确认设计图（设计图_8格网格帧.png＝终态：8 格全落＋格 1 强调态＋★；
//   设计图_8格网格帧_标注.png＝出处与约束标注；设计图_8格网格帧_第一行四格.png＝"初始：第一行 4 格"中间态参照）
//   ＋ 设计图_8格网格帧.html 的版式参数与 _work/measure_8格网格帧.json 实测盒（网格 1744×769，格 418×372，行列间距 24）。
// 布局＝候选A（8 格一次上屏，4 列×2 行；大段表 D06「布局取候选A」，2026-10-19 全片视觉总览确认）。
//   候选B（4+4 拆两帧）全套保留在 03_视觉设计 内，按任务书不实现。
// 结构：单镜内容帧、固定机位（剧本确认）。轻量章节行（本段头部，版式复用 D05 已确认样例、无标签）→ 8 格逐句入场
//   → 8 格全落停稳、焦点留格 1 星标强调态。无计数／路径／圆点；运动＝淡入＋上浮 10px／16f（DESIGN 已确认语言，对标动态测试01 卡组入场）。
// 重点审查：大段表 R3＝1080p 安全区内一次 8 格的密度与可读性 → 已按候选A 实现，格内三行（名称 26／下载量 46／亮点 26）
//   实测无溢出、全格在安全区内（见接入说明"与设计图的差异"）；R5＝秒点按句级锚点对齐（格 1＝S3 起句、格 2＝S3 内词点、格 3–8＝S4–S9 起句）。
// 必须保持：候选A 组件参数（lib tokens CARD／TYPE／DATA_VALUE）；每格信息密度 ≤ 名称＋1 数据＋1 行；
//   强调态与 ★ 只给格 1，其余 7 格等重、格内无 tertiary（全帧 tertiary＝顶栏 EP＋章节行下划线＋格 1）。
// 衔接：头部轻量章节行「三、开源生态」归本段（D05 尾部收画面后）；尾部收画面＝8 格停稳＋格 1 强调态保持到本段末帧（不淡出），
//   「四、AI 工具与技巧」章节行归 D07 头部。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Frame} from '../../../remotion-main/src/lib/ui';
import {速览格, type 格规格} from './速览格';
import {EV} from './秒点';

// 必要上屏文字（任务书：8 个项目名＋关键下载量）：逐字取自已确认设计图，内容出处＝定稿 §3.1–3.8
// 名称统一去 org 前缀（8 格同规则，格 1 名称实测 328px＝内宽 92%）；数据行统一取下载量（8 格同字段、可比）
const CELLS: 格规格[] = [
  {name: 'MiniCPM-V-4.7-35B-A3B', num: '4,160+', point: 'MoE 多模态，端侧友好', start: EV.k1, hot: true}, // §3.1 原稿带 ⭐
  {name: 'MiniCPM-V-4.7-1B', num: '2,540+', point: '超轻量，手机可跑', start: EV.k2}, // §3.2
  {name: 'Unlimited-OCR', num: '1.15M+', point: '百度出品，无限长文档', start: EV.k3}, // §3.3
  {name: 'LTX-2.5', num: '1.82M+', point: '图像生成视频，动画流畅', start: EV.k4}, // §3.4
  {name: 'drama-3', num: '839', point: '36B 超大规模 TTS', start: EV.k5}, // §3.5
  {name: 'iris-3b', num: '1,130+', point: '轻量图像生成，端侧可跑', start: EV.k6}, // §3.6
  {name: 'clef', num: '18,300+', point: 'Cloudflare 边缘部署优化', start: EV.k7}, // §3.7
  {name: 'embeddinggemma-2', num: '135,000+', point: '0.7B Embedding', start: EV.k8}, // §3.8
];

const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';
const FOOT_RIGHT = '三、开源生态';

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      {/* 轻量章节行（公共组件 ChapterLine，D05 已确认版式、D06–D08 共用；本段实例无标签） */}
      <ChapterLine no="三、" name="开源生态" f={f} start={EV.chap} />

      {/* 8 格 4×2：盒 1744×769（measure_8格网格帧.json 实测 215–983），行列间距 24，格 418×372
          行高写死 372px＝measure 实测卡高（用 1fr 1fr 时 769 除不尽 → 372.375，与设计图取整差）
          盒高写死 769＝measure 实测值：外壳页脚带比设计图 html 矮约 9px，用 flex:1 会把差值摊进行高（同 D05／D07／D08 处理）
          入场逐句驱动（R5）：格 1–8 起点见 ./秒点.ts；格 1 入场即强调态＋★（运动标注默认项，剧本 D06 行 1） */}
      <div
        style={{
          flexShrink: 0,
          height: 769,
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '372px 372px',
          gap: 24,
        }}
      >
        {CELLS.map((spec) => (
          <速览格 key={spec.name} f={f} spec={spec} />
        ))}
      </div>
    </Frame>
  );
};

export default Segment;
