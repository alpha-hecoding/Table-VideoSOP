// D09 段内文字工具：中英混排（mono 片段）＋DESIGN chip 默认态芯片。
// 为什么自己切：已确认设计图（03_视觉设计/D09_收尾学习建议与金句/设计图_*.html）里 mono／CJK 的分工是逐处写死的
//   （`.m` 片段），不是按正则自动切的。本段用反引号标记 mono 片段，逐字照抄设计图的切法 → 实测盒宽才能与设计图同值。
//   例：设计图 `重点：<span class="m">System One</span> 思维、架构设计` → 本段写 "重点：`System One` 思维、架构设计"。
// mono 片段带 lineHeight:1：mono 与 CJK 混排时两种字体的 ascent／descent 不同，共享基线会把行盒顶高（D07／D08 实测结论，
//   根因属公共 token／环境问题，已写接入说明交总控，段内不改 lib）。
// 空白归属：mono 片段前后的空格留在 CJK 片段里（与设计图一致——空格在 <span class="m"> 之外），
//   且混排结果始终包在一个内层 <span> 里 → flex 容器不会把空白文本节点丢掉（D08 实测：裸文本节点会被吞成「System1+System2」）。
import React from 'react';
import {CHIP, C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';

const MONO_MARK = /`([^`]+)`/g;

export const 混排: React.FC<{text: string}> = ({text}) => {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(MONO_MARK)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <span key={`m${k++}`} style={{fontFamily: FONT_MONO, lineHeight: 1}}>
        {m[1]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
};

// 芯片＝DESIGN components.chip 默认态（surface 底＋2px line 边＋rounded.small 10＋padding 6/18＋body 字阶）。
// 本段三处芯片（必读卡时长／动手实践／明日预告）全部默认态：焦点纪律要求卡内与芯片不带 tertiary、不切强调态
//   （运动标注「帧一 tertiary 两处＝顶栏 EP、章节行下划线」）。
// 盒用 flex＋居中（D03 结论：块级 div＋inline span 会让盒高比设计图多 3px），文字包进内层 span 保住空白。
export const 芯片: React.FC<{text: string; f: number; start: number}> = ({text, f, start}) => {
  const s = enter(f, start, {dur: ENTER, rise: 10});
  return (
    <div
      style={{
        ...CHIP,
        ...TYPE.body,
        color: C.primary,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        ...s,
      }}
    >
      <span style={{lineHeight: 1.25}}>
        <混排 text={text} />
      </span>
    </div>
  );
};
