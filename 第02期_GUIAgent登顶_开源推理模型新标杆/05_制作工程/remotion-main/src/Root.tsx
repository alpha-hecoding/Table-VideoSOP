// 总控维护：分段槽位＋总装。分段只改自己 分段/D0X/src/Segment.tsx，不动本文件。
// 段内 useCurrentFrame() 返回局部帧（0＝本段第一帧），与运动标注的秒点同一时基。
import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile} from 'remotion';
import {CANVAS, C} from './lib/tokens';
import {SEGMENTS, TOTAL_FRAMES} from './segments';
import {SegmentContext, SubtitleModeContext} from './lib/segmentContext';

// 段间留白期间保持前一段终态在屏（不空画布），并让末尾停稳够长：
// 每段 Sequence 覆盖到下一段入点；各段内部秒点与局部帧不受影响。
const gapAfter = (i: number) => (i + 1 < SEGMENTS.length ? SEGMENTS[i + 1].f0 - (SEGMENTS[i].f0 + SEGMENTS[i].dur) : 0);

import D01 from '../../分段/D01_开场与数据速览/src/Segment';
import D02 from '../../分段/D02_DeepSeek推理新标杆/src/Segment';
import D03 from '../../分段/D03_前沿模型速览/src/Segment';
import D04 from '../../分段/D04_FocusedGUI全模态聚焦/src/Segment';
import D05 from '../../分段/D05_Agent架构速览/src/Segment';
import D06 from '../../分段/D06_开源生态速览/src/Segment';
import D07 from '../../分段/D07_工具与技巧速览/src/Segment';
import D08 from '../../分段/D08_值得深读速览/src/Segment';
import D09 from '../../分段/D09_收尾学习建议与金句/src/Segment';

const COMP: Record<string, React.FC> = {D01, D02, D03, D04, D05, D06, D07, D08, D09};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {SEGMENTS.map((s) => {
        const Comp = COMP[s.id];
        return (
          <Composition
            key={s.id}
            id={s.id}
            component={() => (
              <SegmentContext.Provider value={{id: s.id, f0: s.f0, dur: s.dur}}>
                <>
                  <Comp />
                  <Audio src={staticFile(s.audio)} />
                </>
              </SegmentContext.Provider>
            )}
            durationInFrames={s.dur}
            fps={CANVAS.fps}
            width={CANVAS.width}
            height={CANVAS.height}
          />
        );
      })}

      <Composition
        id="Full"
        component={Full}
        durationInFrames={TOTAL_FRAMES}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
      />

      {/* clean 母版：与 Full 完全同版，仅去字幕层（SubtitleModeContext='off'），供无字幕交付。 */}
      <Composition
        id="FullClean"
        component={() => (
          <SubtitleModeContext.Provider value="off">
            <Full />
          </SubtitleModeContext.Provider>
        )}
        durationInFrames={TOTAL_FRAMES}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
      />
    </>
  );
};

/** 总装：按 F0 排段＋配音轨；段间留白＝segments.ts 里相邻段 f0 之差（排点 v2：D01→D02 40f，其余 15f） */
const Full: React.FC = () => (
  <AbsoluteFill style={{background: C.canvas}}>
    {SEGMENTS.map((s, i) => {
      const Comp = COMP[s.id];
      return (
        <Sequence key={s.id} from={s.f0} durationInFrames={s.dur + gapAfter(i)} name={s.id}>
          <SegmentContext.Provider value={{id: s.id, f0: s.f0, dur: s.dur}}>
            <Comp />
          </SegmentContext.Provider>
        </Sequence>
      );
    })}
    {SEGMENTS.map((s) => (
      <Sequence key={`${s.id}-vo`} from={s.f0} name={`${s.id} 配音`}>
        <Audio src={staticFile(s.audio)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
