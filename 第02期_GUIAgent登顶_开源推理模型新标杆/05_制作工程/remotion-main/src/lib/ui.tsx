// 已确认组件的可复用实现：外壳（画布＋安全区＋顶栏＋页脚）与四类内容组件。
// 参数全部来自 tokens.ts（＝DESIGN.md）；分段组件只组合它们，不另写一套。
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CANVAS, CARD, CHIP, C, DATA_VALUE, FONT_MONO, LOCAL, PANEL, RESULT_LABEL, SAFE, TYPE} from './tokens';
import {enter, EASE, prog} from './motion';
import {cueAt, SUBTITLE_CUES} from './subtitles';
import {useSegmentInfo} from './segmentContext';
import {SubtitleModeContext} from './segmentContext';

// 字幕层（2026-10-19 用户确认：单行、body 26px、出现时页脚让位）
// 位置＝页脚原来的带（文字底边 y≈1035），内容帧主体最低边 940-973，间隙 ≥29px。
// 样式＝primary 字 + surface 描边（SVG paintOrder，DESIGN 禁阴影渐变）；cue 数据由 scripts/字幕切句.py 生成。
const SUB_FONT = 26; // = typography.body（已确认字阶，不新增）
const SUB_BOTTOM = 45; // 1080 - 1035

const findCue = (gf: number) => cueAt(gf);

// 让位按"字幕块"计算，不按单条 cue：本期 cue 在段内首尾相接（实测 169 个相邻空档全为 0），
// 若从每条 cue 起点重算淡出，每个边界都会把页脚拉回全亮约 4f（D01 报总控项 3 的闪现根因）。
const BLOCK_MERGE = 6; // 相邻 cue 空档小于此值视为同一块

type Block = {start: number; end: number};

const BLOCKS: Block[] = (() => {
  const sorted = [...SUBTITLE_CUES].sort((a, b) => a.start - b.start);
  const out: Block[] = [];
  for (const c of sorted) {
    const last = out[out.length - 1];
    if (last && c.start - last.end < BLOCK_MERGE) last.end = Math.max(last.end, c.end);
    else out.push({start: c.start, end: c.end});
  }
  return out;
})();

const blockAt = (gf: number) => BLOCKS.find((b) => gf >= b.start && gf < b.end);

// 页脚入场全片只播一次（2026-10-20 用户确认）：只有"入场归属段"播入场动画，其余段页脚恒定就位，
// 只随字幕块让位。原因＝本期 cue 段内首尾相接，入场窗被顺延到段尾留白，而除 D01→D02（40f）外
// 留白只有 15f，每段重播入场会在切点被截断并归零（观感＝页脚长出 3/4 后突然消失）。
// 换归属段或改排点时改这个常量；段内传的 footerStart 只在归属段生效。
const FOOTER_ENTRY_OWNER = 'D01';

const lastBlockEndedBefore = (gf: number) => {
  let best;
  for (const b of BLOCKS) if (b.end <= gf && (!best || b.end > best.end)) best = b;
  return best;
};

/** 页脚（或自绘页脚）在字幕出现时的让位透明度：字幕块起 8f 淡出，字幕块止 8f 淡回 */
export const footerAlpha = (gf: number) => {
  const b = blockAt(gf);
  if (b) return Math.max(0, 1 - (gf - b.start) / 8);
  const prev = lastBlockEndedBefore(gf);
  if (prev && gf - prev.end < 8) return Math.min(1, (gf - prev.end) / 8);
  return 1;
};

/** 页脚入场窗口：给定全片帧起点，若该处正被字幕覆盖，顺延到最近的无字幕帧（D01 报总控项 3） */
export const deferToNoCueFrame = (startGlobal: number, maxShift = 1200) => {
  let g = startGlobal;
  let guard = 0;
  while (cueAt(g) && guard < maxShift) {
    g++;
    guard++;
  }
  return g;
};

/** 自绘页脚／字幕的段用这个拿全片帧号（主工程注入的分段身份 F0 ＋ 局部帧）；拿不到返回 null */
export const useGlobalFrame = (): number | null => {
  const local = useCurrentFrame();
  const info = useSegmentInfo();
  return info ? info.f0 + local : null;
};

export const Subtitle: React.FC<{frame: number}> = ({frame}) => {
  const cue = findCue(frame);
  if (!cue) return null;
  const inA = Math.min(1, (frame - cue.start) / 4);
  const outA = Math.min(1, (cue.end - frame) / 3);
  const alpha = Math.max(0, Math.min(inA, outA));
  if (alpha <= 0) return null;
  const width = CANVAS.width - SAFE.left - SAFE.right;
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, bottom: SUB_BOTTOM, opacity: alpha}}>
      <svg width={width} height={SUB_FONT * 1.5} viewBox={`0 0 ${width} ${SUB_FONT * 1.5}`} style={{display: 'block'}}>
        <text
          x={width / 2}
          y={SUB_FONT * 1.15}
          textAnchor="middle"
          style={{
            fontFamily: TYPE.body.fontFamily,
            fontSize: SUB_FONT,
            fontWeight: 400,
            letterSpacing: 0,
            fill: C.primary,
            stroke: C.surface,
            strokeWidth: 4,
            paintOrder: 'stroke',
          }}
        >
          {cue.text}
        </text>
      </svg>
    </div>
  );
};

/** 内容帧外壳：顶栏恒定承接；页脚左右两栏（来源型或章位型，同帧不混用） */
export const Frame: React.FC<{
  brand?: string;
  ep?: string;
  date?: string;
  footerLeft?: string;
  footerRight?: string;
  /** 传入本段全片起始帧（总装排点）→ 自动接字幕层并在字幕出现时让位页脚；不传则无字幕 */
  f0?: number;
  showSubtitle?: boolean;
  /** 页脚入场起点（局部帧）：线宽 0→100% ＋文字淡入；不传＝恒定可见 */
  footerStart?: number;
  footerDur?: number;
  children?: React.ReactNode;
}> = ({
  brand = 'AI 情报',
  ep = 'EP.02',
  date = '2026.10.22 · AI DAILY',
  footerLeft,
  footerRight,
  f0,
  showSubtitle = true,
  footerStart,
  footerDur = 20,
  children,
}) => {
  const local = useCurrentFrame();
  const info = useSegmentInfo();
  const base = f0 !== undefined ? f0 : info?.f0;
  const gf = base === undefined ? undefined : base + local;
  // SubtitleModeContext='off' 时整片去字幕（渲 clean 母版用，分段代码不动）。
  const subMode = React.useContext(SubtitleModeContext);
  const subOn = showSubtitle && subMode !== 'off' && gf !== undefined;
  const fa = gf === undefined ? 1 : footerAlpha(gf);
  // 页脚入场：横线从 0 长到 100%，文字随后淡入（D01 实测参数，2026-10-19 总控收编进外壳）。
  // 起点若落在字幕里，顺延到最近的无字幕帧，避免"入场动画在不可见期间播完"。
  const entryOwner = info ? info.id === FOOTER_ENTRY_OWNER : footerStart !== undefined;
  const effStart =
    footerStart === undefined || !entryOwner || base === undefined
      ? footerStart
      : deferToNoCueFrame(base + footerStart) - base;
  const lineW =
    footerStart === undefined || !entryOwner
      ? 1
      : interpolate(local, [effStart!, effStart! + footerDur], [0, 1], {
          easing: EASE.reveal,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const footTextA =
    footerStart === undefined || !entryOwner ? 1 : prog(local, effStart! + 6, footerDur - 6, EASE.reveal);
  return (
    <AbsoluteFill style={{background: C.canvas, fontFamily: TYPE.h1.fontFamily}}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          right: SAFE.right,
          top: SAFE.top,
          bottom: SAFE.bottom,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexShrink: 0,
            height: 55, // 候选A 确认值（修 9px 系统性下移，2026-10-19 总控）
          }}
        >
          <div
            style={{
              fontSize: LOCAL.brand,
              fontWeight: 700,
              color: C.primary,
              lineHeight: 1.25,
              letterSpacing: LOCAL.brandTracking,
            }}
          >
            {brand}
            <span
              style={{
                fontFamily: FONT_MONO,
                color: C.tertiary,
                fontSize: LOCAL.brandEp,
                marginLeft: 16,
                fontWeight: 700,
              }}
            >
              {ep}
            </span>
          </div>
          <div style={{fontFamily: FONT_MONO, fontSize: LOCAL.topDate, color: C.secondary}}>{date}</div>
        </div>

        <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>{children}</div>

        {(footerLeft || footerRight) && (
          <div
            style={{
              flexShrink: 0,
              opacity: fa * footTextA,
            }}
          >
            <div style={{position: 'relative', height: 2, width: '100%'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 2,
                  width: `${lineW * 100}%`,
                  background: C.line,
                }}
              />
            </div>
            <div
              style={{
                paddingTop: 12,
                fontSize: LOCAL.footer,
                color: C.secondary,
                lineHeight: 1.3,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{footerLeft}</span>
              <span>{footerRight}</span>
            </div>
          </div>
        )}
      </div>
      {subOn && <Subtitle frame={gf as number} />}
    </AbsoluteFill>
  );
};

/** 轻量章节行：章号＋章名（700）＋可选标签；下划线 120x10 tertiary */
export const ChapterLine: React.FC<{
  no: string;
  name: string;
  tag?: string;
  f: number;
  start: number;
}> = ({no, name, tag, f, start}) => {
  const s = enter(f, start);
  return (
    <div style={{marginTop: 18, ...s}}>
      <div style={{...TYPE.subtitle}}>
        <span style={{fontWeight: 700, color: C.primary}}>{no}</span>
        <span style={{fontWeight: 700, color: C.primary}}>{name}</span>
        {tag ? <span style={{color: C.secondary, marginLeft: 8}}>{tag}</span> : null}
      </div>
      <div style={{width: 120, height: 10, background: C.tertiary, marginTop: 14}} />
    </div>
  );
};

/** 数据卡：k 23px／数值 46px mono 700／单位 primary／n 23px。
 *  hot＝已确认强调态（3px tertiary 边 + success 底，数值 tertiary、单位 primary）；
 *  accentNumber 只染数值不加强调底；accent 是 v 写法的旧别名；
 *  accentUnit 把后缀／单位也染 tertiary（D02 设计图_数据卡组 卡2「3-5×」整条为 tertiary，
 *  与 hot 卡的"单位恒 primary"是两种已确认口径，故单独开关，默认关＝primary）。 */
export const DataCard: React.FC<{
  k: string;
  value?: string;
  v?: string; // 旧写法，等价 value
  unit?: string;
  n?: string;
  hot?: boolean;
  accentNumber?: boolean;
  accentUnit?: boolean;
  accent?: boolean;
  /** 盒高（含边框）；默认 149＝已确认设计图实测值，个别段需要不同高度时传入 */
  height?: number;
  f: number;
  start: number;
}> = ({k, value, v, unit, n, hot, accentNumber, accentUnit, accent, height, f, start}) => {
  const s = enter(f, start);
  const text = value ?? v ?? '';
  const numHot = hot || accentNumber || accent;
  return (
    <div
      style={{
        ...CARD,
        height: height ?? CARD.height,
        border: hot ? `3px solid ${C.tertiary}` : CARD.border,
        background: hot ? C.success : CARD.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        ...s,
      }}
    >
      <div style={{fontSize: LOCAL.cardKeyNote, color: C.secondary, lineHeight: 1.25}}>{k}</div>
      {/* 单位与数值同阶（data-value 46px）写在同一行盒内：候选A／D01／D04 设计图口径；
          用 flex＋baseline 会把行盒撑高约 10px，卡盒实测 159 vs 设计图 147（D01 报总控项 2） */}
      <div style={{...DATA_VALUE, lineHeight: 1.1, marginTop: 2, color: numHot ? C.tertiary : C.primary}}>
        {text}
        {/* 空格由调用方写进 unit（D01／D04 传 ' 篇'／' 票'；D02 传 'B'／'-5×' 这类后缀不加空格，
            设计图_数据卡组实测「35B」「3-5×」）：lib 不再自行加空格，否则「35 B」「3 -5×」与设计图不符 */}
        {unit ? <span style={{color: accentUnit ? C.tertiary : C.primary}}>{unit}</span> : null}
      </div>
      {n ? <div style={{fontSize: LOCAL.cardKeyNote, color: C.secondary, marginTop: 2}}>{n}</div> : null}
    </div>
  );
};

/** 芯片：默认态／强调态（tertiary 边 + success 底） */
export const Chip: React.FC<{
  text: string;
  hot?: boolean;
  f: number;
  start: number;
}> = ({text, hot, f, start}) => {
  // rise 取 DESIGN 默认 14px（D01 报总控项 5：运动标注 14 与旧 lib 10 的差异按标注对齐）
  const s = enter(f, start, {rise: 14});
  return (
    <div
      style={{
        ...CHIP,
        border: hot ? CHIP.hotBorder : CHIP.border,
        background: hot ? CHIP.hotBackground : CHIP.background,
        ...TYPE.body,
        color: hot ? C.tertiary : C.primary,
        fontWeight: hot ? 700 : 400,
        ...s,
      }}
    >
      {text}
    </div>
  );
};

/** 面板：主方 surface + 3px line 边；对照方 system 无描边 */
export const Panel: React.FC<{
  contrast?: boolean;
  f: number;
  start: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({contrast, f, start, children, style}) => {
  const p = enter(f, start, {dur: 18, rise: 0});
  return (
    <div
      style={{
        background: contrast ? PANEL.contrastBackground : PANEL.mainBackground,
        border: contrast ? PANEL.contrastBorder : PANEL.mainBorder,
        borderRadius: PANEL.radius,
        padding: PANEL.padding,
        ...style,
        ...p,
      }}
    >
      {children}
    </div>
  );
};

/** 结果标签：只在动作实际完成后出现（接触后 6f） */
export const ResultLabel: React.FC<{
  text: string;
  f: number;
  start: number;
}> = ({text, f, start}) => {
  const s = enter(f, start, {dur: 12, rise: 6});
  return (
    <div
      style={{
        display: 'inline-block',
        background: RESULT_LABEL.background,
        color: RESULT_LABEL.color,
        borderRadius: RESULT_LABEL.radius,
        padding: RESULT_LABEL.padding,
        fontSize: RESULT_LABEL.fontSize,
        fontWeight: 700,
        letterSpacing: LOCAL.resultLabelTracking,
        ...s,
      }}
    >
      {text}
    </div>
  );
};
