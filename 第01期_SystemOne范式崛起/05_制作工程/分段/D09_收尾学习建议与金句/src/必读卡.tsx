// D09 必读卡：序号行（mono 26/700 次级）＋论文名（mono 30/700）＋一句定位（26 primary）＋重点行（26 次级）＋时长芯片。
// 版式逐字对齐已确认设计图 03_视觉设计/D09_收尾学习建议与金句/设计图_必读卡组帧.html 的 .kcard／.no／.name／.point／.focus／.chip，
//   实测盒参照段内 _work/measure_必读卡组帧.json（卡 565×280、内宽 503、最长行 414＜503 不折行）。
// 卡片参数＝候选A 已确认值（lib tokens CARD：surface 底、3px line 边、r16、padding 18/28），三卡等重、同构。
// 焦点纪律（任务书「必须保持」项＋运动标注）：卡内无 tertiary、无强调态、无 success 底——必读三卡等重，
//   优先级由「必读 1／2／3」文字承担；时长芯片用默认态。
// 入场语言＝DESIGN components.card／chip：淡入＋10px 上浮 16f；芯片随卡错峰 6f（＝卡起＋22f）。
// 芯片盒高在卡内始终预留（未入场时 opacity 0 仍在流内）→ 芯片出现不改变卡内四行的垂直位置。
import React from 'react';
import {CARD, C, FONT_MONO, TYPE} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';
import {芯片, 混排} from './文字';

export type 卡规格 = {
  no: string; // 「必读 1」等（mono 字族，数字也走 mono＝设计图 .no 的写法）
  name: string; // 论文名（整行 mono＝设计图 .name）
  point: string; // 一句定位（CJK＋mono 混排，反引号＝mono 片段）
  focus: string; // 重点行（同上）
  chip: string; // 时长芯片文案
  start: number; // 卡入场帧
  chipStart: number; // 时长芯片入场帧
};

export const 必读卡: React.FC<{f: number; spec: 卡规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div
      style={{
        ...CARD,
        height: 280,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 0,
        ...s,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: TYPE.metadata.fontSize,
          fontWeight: 700,
          color: C.secondary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {spec.no}
      </div>
      <div
        style={{
          marginTop: 10,
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
          fontSize: TYPE.body.fontSize,
          fontWeight: 400,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        <混排 text={spec.point} />
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: TYPE.body.fontSize,
          fontWeight: 400,
          color: C.secondary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        <混排 text={spec.focus} />
      </div>
      <div style={{alignSelf: 'flex-start', marginTop: 14}}>
        <芯片 text={spec.chip} f={f} start={spec.chipStart} />
      </div>
    </div>
  );
};
