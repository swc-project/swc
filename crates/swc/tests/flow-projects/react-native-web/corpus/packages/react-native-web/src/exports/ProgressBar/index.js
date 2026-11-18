/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use client';

import type { ColorValue } from '../../types';
import type { ViewProps } from '../View';

import * as React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';

type ProgressBarProps = {
  ...ViewProps,
  color?: ColorValue,
  indeterminate?: boolean,
  progress?: number,
  trackColor?: ColorValue
};

const ProgressBar: React.AbstractComponent<
  ProgressBarProps,
  React.ElementRef<typeof View>
> = React.forwardRef((props, ref) => {
  const {
    color = '#1976D2',
    indeterminate = false,
    progress = 0,
    trackColor = 'transparent',
    style,
    ...other
  } = props;

  const percentageProgress = progress * 100;
  const width = indeterminate ? '25%' : `${percentageProgress}%`;

  return (
    <View
      {...other}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={indeterminate ? null : percentageProgress}
      ref={ref}
      role="progressbar"
      style={[styles.track, style, { backgroundColor: trackColor }]}
    >
      <View
        style={[
          { backgroundColor: color, width },
          styles.progress,
          indeterminate && styles.animation
        ]}
      />
    </View>
  );
});

ProgressBar.displayName = 'ProgressBar';

const styles = StyleSheet.create({
  track: {
    forcedColorAdjust: 'none',
    height: 5,
    overflow: 'hidden',
    userSelect: 'none',
    zIndex: 0
  },
  progress: {
    forcedColorAdjust: 'none',
    height: '100%',
    zIndex: -1
  },
  animation: {
    animationDuration: '1s',
    animationKeyframes: [
      {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(400%)' }
      }
    ],
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  }
});

export default ProgressBar;
