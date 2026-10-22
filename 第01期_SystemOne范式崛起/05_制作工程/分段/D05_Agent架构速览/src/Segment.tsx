// D05 Agent 架构速览 · 分段组件（动态实现，2026-10-19；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1389f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D05_Agent架构速览/ 已确认设计图（设计图_4卡速览帧.png＝终态／章节行_设计图.png＝头部章节行版式）
//   ＋ 设计图_4卡速览帧.html 的版式参数与 _work/measure.json 实测盒（卡 860×372、gap 24、章节行 30px＋下划线 120×10）。
// 结构：单镜内容帧、固定机位（剧本确认）。轻量章节行（本段首提，D06–D08 共用版式）→ 4 卡 2×2 逐句入场 → 4 卡全落停稳。
//   无计数／路径／圆点／强调态（速览卡无状态变化，剧本「无单点高潮」）；全部运动＝淡入＋上浮 16f。
// 重点审查：大段表执行索引 D05＝每卡至多 名称＋1 行文字（4 卡均满足，卡内无 tertiary）；
//   R5＝秒点按句级锚点对齐（卡 1–4 入场点＝S3–S6 句起点，章节行＝S2 起句，见 ./秒点.ts）。
// 必须保持：候选A 组件参数（lib tokens CARD）；4 卡版式同构等重。
// 衔接：头部轻量章节行归本段；尾部收画面＝4 卡停稳保持到本段末帧（不淡出），「三、开源生态」章节行归 D06 头部。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Frame} from '../../../remotion-main/src/lib/ui';
import {速览卡, type 卡规格} from './速览卡';
import {EV} from './秒点';

// 必要上屏文字（任务书）：论文名＋一句话定位；逐字取自已确认设计图，内容出处＝定稿 §2.2–2.5
const CARDS: 卡规格[] = [
  {name: 'Self-Evolving Agent Harness', pos: '自进化：从执行中学习，自动更新策略', start: EV.k1},
  {name: 'Harness²', pos: '递归编排：Agent 编排其他 Agent', start: EV.k2},
  {name: 'Pack Light, CarryOn', pos: '上下文管理：封装为对象，按需加载动态压缩', start: EV.k3},
  {name: 'BLADE', pos: '故障归因：审计信息使用，精确定位故障源头', start: EV.k4},
];

const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';
const FOOT_RIGHT = '二、Agent 架构与范式 · 速览';

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT} footerStart={EV.footer}>
      {/* 轻量章节行（公共组件 ChapterLine，版式已确认，D06–D08 共用；仅换章号/名称/标签） */}
      <ChapterLine no="二、" name="Agent 架构与范式" tag="· 速览" f={f} start={EV.chap} />

      {/* 2×2 速览卡组：盒 1744×769（measure.json），gap 24，卡 860×372；入场逐句驱动（R5） */}
      <div
        style={{
          // 盒高写死 769＝measure.json 实测值（设计图 215–984）。外壳页脚带比设计图 html 矮约 9px，
          // 若用 flex:1 会把 9px 摊进两行（卡高 376/377 vs 设计图 372）；固定后 4 卡与设计图逐像素同盒。
          flexShrink: 0,
          height: 769,
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
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
