// D08 速览卡：论文名（mono 30/700）＋出处行（mono 26/400 secondary）＋一句启发（CJK 26/400）；卡 4 另带主题芯片。
// 版式＝候选A 已确认卡片参数（lib tokens CARD：surface 底、3px line 边、r16、padding 18/28），5 卡同构等重；
//   行距 10／14 与字族分工逐字对齐已确认设计图 03_视觉设计/D08_值得深读速览/设计图_5卡速览帧.html（.name／.meta／.point／.chip）。
// 密度（大段表 D08 行「必要上屏文字＝论文名＋出处行（按原稿实有字段填）＋一句启发」）：每卡三行，卡 4 多一行芯片，骨架不变。
// 焦点纪律（任务书「必须保持」项）：强调态只给卡 4，且只改边框色与底色（3px 不变→卡盒尺寸不变，换态不跳版）；
//   其余 4 卡卡内无 tertiary。芯片用默认态（surface 底＋2px line 边），与 D02「System One 范式」标签同组件同状态。
// 入场语言＝DESIGN components.card／chip：淡入＋10px 上浮，16f（运动标注 K1–K5／CH1）；换态＝离散单帧（DESIGN contact「离散换态」）。
import React from 'react';
import {CARD, CHIP, C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';

// 设计图里英文／数字 token 走 mono 字族（.m 片段），其余走 CJK 字族；切法与设计图一致，故实测盒与设计图同宽。
//   「RLHF / RLAIF」这类由斜杠连接的英文整体成段（设计图 html 里是一个 .m 片段）→ 正则允许段内 " / "，
//   否则会被切成两段、夹在两个 span 之间的空格在渲染时被吞掉（实测 2026-10-20：预览成「RLHF/RLAIF」）。
// mono 片段带 lineHeight:1：mono 与 CJK 混排时两种字体的 ascent／descent 不同，共享基线会把行盒顶高（同 D07 实测结论，
//   根因属公共 token／环境问题，已写接入说明交总控，段内不改 lib）。
const MONO_TOKEN = /\/?[A-Za-z0-9][A-Za-z0-9.\-+/%]*(?: \/ [A-Za-z0-9][A-Za-z0-9.\-+/%]*)*/g;

const 混排: React.FC<{text: string}> = ({text}) => {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MONO_TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <span key={i} style={{fontFamily: FONT_MONO, lineHeight: 1}}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
};

export type 芯片规格 = {text: string; start: number};

// 芯片（卡 4 主题回扣）：DESIGN chip 默认态。盒用 flex＋居中（同 D03 结论：块级 div＋inline span 会让盒高比设计图多 3px）。
// 芯片文字不切 mono：已确认设计图 .chip 整段走 CJK 字族（无 .m 片段，measure.json chipTextW 284 即按 CJK 实测）；
//   且 flex 容器会把纯空白文本节点丢掉（实测 2026-10-20：切 mono 后「System 1 + System 2」渲染成「System1+System2」，盒宽 273）。
const 芯片: React.FC<{f: number; spec: 芯片规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div
      style={{
        ...CHIP,
        ...TYPE.body,
        color: C.primary,
        alignSelf: 'flex-start',
        marginTop: 14,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        ...s,
      }}
    >
      {spec.text}
    </div>
  );
};

export type 卡规格 = {
  name: string;
  meta: string;
  point: string;
  start: number;
  span: number; // 栅格跨列（上 2 下 3：卡 1–2 跨 3 列＝860，卡 3–5 跨 2 列＝565，measure.json 实测盒）
  hotFrom?: number; // 离散换态帧（不传＝本卡不切强调态）
  chip?: 芯片规格;
};

export const 速览卡: React.FC<{f: number; spec: 卡规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  const hot = spec.hotFrom !== undefined && f >= spec.hotFrom;
  return (
    <div
      style={{
        ...CARD,
        gridColumn: `span ${spec.span}`,
        minWidth: 0,
        // 强调态只改颜色：边框仍 3px、卡盒尺寸不变（设计图 强调态切换前.png 与终态逐像素同位）
        border: hot ? `3px solid ${C.tertiary}` : CARD.border,
        background: hot ? C.success : CARD.background,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...s,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: TYPE.subtitle.fontSize,
          fontWeight: 700,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {spec.name}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: FONT_MONO,
          fontSize: TYPE.body.fontSize,
          fontWeight: 400,
          color: C.secondary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        <混排 text={spec.meta} />
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: TYPE.body.fontSize,
          fontWeight: 400,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        <混排 text={spec.point} />
      </div>
      {/* 芯片行高在卡内始终预留（opacity 0 入场）→ 芯片出现不改变卡内三行的垂直位置（同 D07「行高已预留」处理） */}
      {spec.chip ? <芯片 f={f} spec={spec.chip} /> : null}
    </div>
  );
};
