// D09 收尾 学习建议与金句 · 分段组件（动态实现，2026-10-20；替换总控生成的占位桩）
// 契约：默认导出一个组件，渲染 1920x1080 内容帧；useCurrentFrame() 返回局部帧（0＝本段第一帧）。
// 本段帧数＝1351f（＝已采用配音时长）；秒点＝按已采用配音重排后的正式值，集中在 ./秒点.ts（段内不读全片 F0）。
// 画面依据：03_视觉设计/D09_收尾学习建议与金句/ 三张已确认设计图（必读卡组帧／金句帧／片尾卡，2026-10-19 全片视觉总览 v1
//   用户「全部默认」）＋ 各自 _标注.png ＋ 段内 _work/measure_*.json 实测盒。候选帧（关注方向上屏／金句文字居中／片尾卡带页脚）
//   未被采用 → 本段按默认实现：关注方向不上屏、金句块水平居中＋文字左对齐、片尾卡不带页脚。
// 结构：三态接力＝三个内容帧（帧一 必读卡组帧 f0–781 → 帧二 金句帧 f782–1045 → 帧三 片尾卡 f1046–1350），
//   全片固定机位、无运镜（剧本统一约定）；帧间硬切（本期首次实装的跨帧语言，2026-10-19 随总览确认并登记 DESIGN 待验证），
//   切点两侧均为停稳终态；顶栏跨三帧恒定承接、不重做入场（外壳 Frame）；页脚在帧一／帧二存在，片尾卡按已确认版式不带页脚。
// 秒点（R5）：必读 3 卡按 S3 内「Jeva／Agent-Reflex／Tev」实测词点入场；时长芯片随卡错峰 6f；实践 3 芯片按 S4 内逐项词点；
//   金句帧入场锚在「今日金句」起句，两行按朗读词点，解读行按「模型会不断更新迭代」词点；片尾卡按「明日预告」起句＋预告三项词点。
// 重点审查：R6＝金句帧阅读停稳 141f、片尾停稳 127f（均 ≥已确认档 108f）；R4＝片尾卡标题块与 D01 标题帧逐项同值（kicker mt28／
//   h1 88·700·字距3·mt10／下划线 120×10·mt14／副题 30·mt16／芯片行 mt24·gap14）；R5＝秒点按句级锚点对齐（见 ./秒点.ts）。
// 必须保持：候选A 组件参数走 lib tokens（CARD／CHIP／TYPE）；金句英文用 metadata 字体（JetBrains Mono NF）；
//   阅读停稳按 DESIGN 2.8s 基准（金句 108f／片尾 108f 已确认档）；焦点纪律＝帧一 tertiary 两处（顶栏 EP＋章节行下划线）、
//   帧二两处（EP＋kicker 橙方块）、帧三三处（EP＋kicker 橙方块＋下划线，与 D01 标题帧同数量同位置）。
// 衔接：起始承接 D08「主题回扣」焦点（无章卡、直接连续，章节行随本段首帧进入）；结束＝片尾卡停稳 → 全片结束。
// 共享实现只读引用主工程：../../../remotion-main/src/lib/{tokens,motion,ui}；段内不复制一份。
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Frame} from '../../../remotion-main/src/lib/ui';
import {C, FONT_MONO, LOCAL, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter, prog} from '../../../remotion-main/src/lib/motion';
import {必读卡, type 卡规格} from './必读卡';
import {芯片, 混排} from './文字';
import {ENTER, EV, 在帧, 帧一, 帧三, 帧二} from './秒点';

// 上屏文案＝已确认设计图逐字（内容出处＝定稿 §六 必读 1–3／动手实践 1–3／今日金句／明日预告）；反引号＝mono 片段（见 ./文字.tsx）
const CARDS: 卡规格[] = [
  {
    no: '必读 1',
    name: 'Jeva: System One Models',
    point: '理解新范式',
    focus: '重点：`System One` 思维、架构设计',
    chip: '`1-2` 小时',
    start: EV.k1,
    chipStart: EV.ch1,
  },
  {
    no: '必读 2',
    name: 'Agent-Reflex',
    point: '`Agent` 反思机制',
    focus: '重点：`Reflex` 模块设计',
    chip: '`1` 小时',
    start: EV.k2,
    chipStart: EV.ch2,
  },
  {
    no: '必读 3',
    name: 'Tev',
    point: '长程 `Agent` 训练',
    focus: '重点：密集进度奖励设计',
    chip: '`1` 小时',
    start: EV.k3,
    chipStart: EV.ch3,
  },
];

// 动手实践 3 芯片（定稿 §六 实践 1–3；文案按设计图压缩，未改事实）
const PRACTICE = [
  {text: '试用 `LFM2.5-24B-A2B`', start: EV.p1},
  {text: '部署 `MiniCPM-V-4.7`', start: EV.p2},
  {text: '实现 `Agent-Reflex` 反思模块', start: EV.p3},
];

// 明日预告 3 芯片（定稿 §六 明日预告三项，取全称）
const TOMORROW = [
  {text: '`NeurIPS 2026` 会议论文持续更新', start: EV.b5a},
  {text: '更多 `System One` 模型变体可能出现', start: EV.b5b},
  {text: '`Agent` 框架竞争加剧', start: EV.b5c},
];

const FOOT_LEFT = 'AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命';

// kicker＝DESIGN 已确认组件（18px tertiary 方块＋gap14＋30px 次级·字距4）；帧二／帧三各一处，是本帧的 tertiary 焦点之一
const Kicker: React.FC<{text: string; f: number; start: number; marginTop: number}> = ({text, f, start, marginTop}) => {
  const s = enter(f, start, {dur: ENTER, rise: 14});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 30, marginTop, ...s}}>
      <div style={{width: 18, height: 18, background: C.tertiary, flexShrink: 0}} />
      <div style={{fontSize: TYPE.subtitle.fontSize, color: C.secondary, letterSpacing: LOCAL.kickerTracking, lineHeight: 1}}>
        {text}
      </div>
    </div>
  );
};

// 帧一 必读卡组帧：章节行 → 3 卡横排（等宽 565）→ 动手实践标签＋3 芯片
// 主体盒高写死 789＝_work/measure_必读卡组帧.json 实测 main 盒（195–984）：外壳页脚带比设计图 html 矮约 9px，
//   用 flex:1 会把差值摊进居中位置（同 D05／D07／D08 处理）→ 组高 280＋32＋64＝376 居中后卡组落在 y401＝设计图实测值。
// 实践行不写死行高：设计图 .chip 全局规则带 margin-top:14＋align-self:flex-start → 行高自然＝14＋50＝64＝实测值。
const 帧一必读卡组: React.FC<{f: number}> = ({f}) => (
  <>
    <ChapterLine no="六、" name="今日学习建议" f={f} start={EV.chap} />
    <div style={{flexShrink: 0, height: 789, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24}}>
        {CARDS.map((spec) => (
          <必读卡 key={spec.no} f={f} spec={spec} />
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div
          style={{
            ...enter(f, EV.plab, {dur: ENTER, rise: 10}),
            fontSize: TYPE.body.fontSize,
            fontWeight: 700,
            color: C.secondary,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          动手实践
        </div>
        {PRACTICE.map((p) => (
          <div key={p.text} style={{alignSelf: 'flex-start', marginTop: 14}}>
            <芯片 text={p.text} f={f} start={p.start} />
          </div>
        ))}
      </div>
    </div>
  </>
);

// 帧二 金句帧：金句块水平居中（块中心 x960）＋文字左对齐（已确认默认），垂直偏上（stage padding-top 132＝设计图实测）
// 间距只取 DESIGN spacing 阶梯：kicker→金句 md22、金句→出处 sm14、出处→解读 lg32（未套用标题块内部比例）
const 帧二金句: React.FC<{f: number}> = ({f}) => (
  <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 132}}>
    <div style={{width: 'max-content'}}>
      <Kicker text="今日金句" f={f} start={EV.kicker} marginTop={0} />
      {/* 金句＝h1 字阶 88/700·字距3·行高1.1，英文取 metadata 字体（任务书「必须保持」项）；两行为编辑性断行 */}
      <div
        style={{
          marginTop: 22,
          fontFamily: FONT_MONO,
          fontSize: TYPE.h1.fontSize,
          fontWeight: TYPE.h1.fontWeight,
          letterSpacing: LOCAL.h1Tracking,
          lineHeight: TYPE.h1.lineHeight,
          color: C.primary,
          whiteSpace: 'nowrap',
          ...enter(f, EV.q1, {dur: ENTER, rise: 14}),
        }}
      >
        “The harness outlives
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: TYPE.h1.fontSize,
          fontWeight: TYPE.h1.fontWeight,
          letterSpacing: LOCAL.h1Tracking,
          lineHeight: TYPE.h1.lineHeight,
          color: C.primary,
          whiteSpace: 'nowrap',
          ...enter(f, EV.q2, {dur: ENTER, rise: 14}),
        }}
      >
        every model on it.”
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_MONO,
          fontSize: TYPE.metadata.fontSize,
          color: C.secondary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          ...enter(f, EV.src, {dur: ENTER, rise: 14}),
        }}
      >
        —— Fazm Blog
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: TYPE.subtitle.fontSize,
          color: C.primary,
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          ...enter(f, EV.interp, {dur: ENTER, rise: 14}),
        }}
      >
        <混排 text="模型会不断更新迭代，围绕模型的工程框架（`harness`）才是长期价值" />
      </div>
    </div>
  </div>
);

// 帧三 片尾卡：标题块与 D01 系列标题帧逐项同值（R4）＋明日预告 3 芯片；不带页脚（已确认默认，与 D01 标题帧一致）
// 实测行盒目标（_work/measure_片尾卡.json）：kicker 143–173／h1 183–280／下划线 294–304／副题 320–358／芯片行 382–431
const 帧三片尾卡: React.FC<{f: number}> = ({f}) => {
  const underlineW = 120 * prog(f, EV.b3, ENTER); // 下划线宽度 0→120px（D01 标题帧已确认语言）
  return (
    <>
      <Kicker text="明日预告" f={f} start={EV.b1} marginTop={28} />
      <div
        style={{
          ...TYPE.h1,
          color: C.primary,
          height: 97,
          marginTop: 10,
          ...enter(f, EV.b2, {dur: ENTER, rise: 14}),
        }}
      >
        System One 范式崛起
      </div>
      <div style={{width: underlineW, height: 10, background: C.tertiary, marginTop: 14}} />
      <div
        style={{
          ...TYPE.subtitle,
          color: C.secondary,
          height: 38,
          marginTop: 16,
          ...enter(f, EV.b4, {dur: ENTER, rise: 14}),
        }}
      >
        <混排 text="AI 情报 · 每日更新 · 第 `01` 期" />
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 24, height: 49}}>
        {TOMORROW.map((c) => (
          <芯片 key={c.text} text={c.text} f={f} start={c.start} />
        ))}
      </div>
    </>
  );
};

const Segment: React.FC = () => {
  const f = useCurrentFrame();
  const 是片尾卡 = 在帧(f, 帧三);
  return (
    <Frame
      // 页脚：帧一／帧二有（章位型右段），片尾卡按已确认版式不带页脚 → 切点处随换帧消失（运动标注 X2）
      footerLeft={是片尾卡 ? undefined : FOOT_LEFT}
      footerRight={是片尾卡 ? undefined : 在帧(f, 帧二) ? '今日金句 · Fazm Blog' : '六、今日学习建议'}
      footerStart={EV.footer}
    >
      {在帧(f, 帧一) && <帧一必读卡组 f={f} />}
      {在帧(f, 帧二) && <帧二金句 f={f} />}
      {是片尾卡 && <帧三片尾卡 f={f} />}
    </Frame>
  );
};

export default Segment;
