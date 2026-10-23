// 分段身份：由主工程 Root.tsx 注入，段内组件（含外壳 Frame）自动读到自己的 F0。
// 分段不需要在自己的文件里写 F0，也不该读全片帧号做秒点——秒点仍用局部帧。
import React from 'react';

export type SegmentInfo = {id: string; f0: number; dur: number};

export const SegmentContext = React.createContext<SegmentInfo | null>(null);

export const useSegmentInfo = (): SegmentInfo | null => React.useContext(SegmentContext);

// 字幕模式：默认 'on'。'off' 时外壳 Frame 不渲染字幕层（渲 clean 母版用，分段代码不动）。
export const SubtitleModeContext = React.createContext<'on' | 'off'>('on');
