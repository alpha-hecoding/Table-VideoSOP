// D07 清单行：序号（mono 26/700 secondary）＋技巧名（30/700 primary）＋1 行要点（26/400 primary）；行 1 另多一行 4 步子芯片。
// 版式＝候选A 已确认卡片参数（lib tokens CARD：surface 底、3px line 边、r16、padding 18/28），5 行同构等重。
// 焦点纪律（剧本 D07「无单点高潮」）：行内与子芯片均无 tertiary／无强调态；子芯片强调态候选帧未采用（2026-10-19 确认不切）。
// 密度约束（大段表执行索引 D07）：每行＝名称＋要点各 1 行；行 1 只多一行子芯片，骨架不变。
// 子芯片＝DESIGN chip 组件默认态（lib CHIP token：surface 底、2px line 边、r10、padding 6/18、body 字阶）。
//   段内实现（不直接用 lib 的 Chip）原因：lib Chip 只收 string，无法承载已确认设计图里的 mono 片段（序号数字／英文 token），
//   而 mono 片段决定芯片实测盒宽（_work/measure.json：182/165/165/191）；差异已写接入说明交总控。
// 入场语言＝DESIGN components.card／chip：淡入＋10px 上浮，16f（运动标注 K1–K5／CH1–CH4）。
import React from 'react';
import {CARD, CHIP, C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';

// 设计图里英文／数字 token 走 mono 字族（设计图_5行清单帧.html 的 .m），其余走 CJK 字族。
// 切法与设计图一致：数字与英文各自成段（「1 Spec 文档」＝mono「1」＋CJK 空格＋mono「Spec」＋CJK「文档」），
// 故芯片实测盒与设计图同宽；「/compact」带斜杠整体 mono，「代理 / 网关」的孤立斜杠不 mono。
// lineHeight:1 只给 mono 片段：mono 与 CJK 混排时，两种字体的 ascent／descent 不同，共享基线会把行盒顶高。
//   实测（2026-10-20）：主工程用的 Chrome（Remotion 自带 chrome-headless-shell）里，30px 名称行盒 43px、26px 要点行盒 37px、
//   芯片盒 71px；而设计图 PNG（系统 google-chrome 渲染）里是 39／34／50。行盒被顶高会连锁改变清单行高
//   （行 2–5 实测 131 vs 设计图 125，行 1 被挤到 197 vs 213）。把 mono 片段的行盒收到 1em 后，行盒由 CJK 基线
//   （line-height 1.25）决定，两个浏览器一致，实测盒回到设计图值。根因（FONT_MONO 族名与本机字体、跨浏览器行盒差异）
//   属公共 token／环境问题，已写接入说明交总控，段内不改 lib。
const MONO_TOKEN = /\/?[A-Za-z0-9][A-Za-z0-9.\-+/%]*/g;

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

const 子芯片: React.FC<{f: number; spec: 芯片规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div style={{...CHIP, ...TYPE.body, color: C.primary, whiteSpace: 'nowrap', ...s}}>
      <混排 text={spec.text} />
    </div>
  );
};

export type 行规格 = {
  no: string;
  name: string;
  point: string;
  start: number;
  chips?: 芯片规格[];
};

export const 清单行: React.FC<{f: number; spec: 行规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div style={{...CARD, display: 'flex', alignItems: 'center', gap: 24, ...s}}>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
          fontWeight: 700,
          color: C.secondary,
          width: 74,
          flex: '0 0 auto',
          lineHeight: 1.25,
        }}
      >
        {spec.no}
      </div>
      {/* 行 1 高度按「含子芯片」的版式一次预留（设计图_5行清单帧_子芯片入场前.png 为证）→ 子芯片入场不推挤后续行 */}
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0}}>
        <div
          style={{
            fontSize: TYPE.subtitle.fontSize,
            fontWeight: 700,
            color: C.primary,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          <混排 text={spec.name} />
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: TYPE.body.fontSize,
            fontWeight: 400,
            color: C.primary,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          <混排 text={spec.point} />
        </div>
        {spec.chips ? (
          <div style={{marginTop: 14, display: 'flex', gap: 14}}>
            {spec.chips.map((c) => (
              <子芯片 key={c.text} f={f} spec={c} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
