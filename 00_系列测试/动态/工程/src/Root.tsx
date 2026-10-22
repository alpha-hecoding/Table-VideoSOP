import React from 'react';
import {Composition} from 'remotion';
import {MotionTest} from './MotionTest';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MotionTest"
      component={MotionTest}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
