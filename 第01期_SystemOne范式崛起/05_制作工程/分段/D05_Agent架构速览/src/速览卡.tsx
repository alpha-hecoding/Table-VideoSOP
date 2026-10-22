// D05 速览卡：论文名（mono 26/700）＋ 1 行定位语（body 26/400）。
// 版式＝候选A 已确认卡片参数（lib tokens CARD：surface 底、3px line 边、r16、padding 18/28），4 卡同构等重。
// 密度约束（大段表执行索引 D05，与 D03 同）：每卡 ≤ 名称＋1 行文字；卡内无 tertiary（无强调态，剧本「无单点高潮」）。
// 入场语言＝DESIGN components.card：淡入＋10px 上浮，16f（运动标注 K1–K4）。
import React from 'react';
import {CARD, C, FONT_MONO} from '../../../remotion-main/src/lib/tokens';
import {enter} from '../../../remotion-main/src/lib/motion';
import {ENTER} from './秒点';

export type 卡规格 = {
  name: string;
  pos: string;
  start: number;
};

export const 速览卡: React.FC<{f: number; spec: 卡规格}> = ({f, spec}) => {
  const s = enter(f, spec.start, {dur: ENTER, rise: 10});
  return (
    <div
      style={{
        ...CARD,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...s,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
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
          marginTop: 14,
          fontSize: 26,
          fontWeight: 400,
          color: C.primary,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {spec.pos}
      </div>
    </div>
  );
};
