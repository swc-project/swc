/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use client';

import type { ViewProps } from '../View';

import * as React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';

const createSvgCircle = (style) => (
  <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={style} />
);

type ActivityIndicatorProps = {
  ...ViewProps,
  animating?: boolean,
  color?: ?string,
  hidesWhenStopped?: boolean,
  size?: 'small' | 'large' | number
};

const ActivityIndicator: React.AbstractComponent<
  ActivityIndicatorProps,
  React.ElementRef<typeof View>
> = React.forwardRef((props, forwardedRef) => {
  const {
    animating = true,
    color = '#1976D2',
    hidesWhenStopped = true,
    size = 'small',
    style,
    ...other
  } = props;

  const svg = (
    <svg height="100%" viewBox="0 0 32 32" width="100%">
      {createSvgCircle({
        stroke: color,
        opacity: 0.2
      })}
      {createSvgCircle({
        stroke: color,
        strokeDasharray: 80,
        strokeDashoffset: 60
      })}
    </svg>
  );

  return (
    <View
      {...other}
      aria-valuemax={1}
      aria-valuemin={0}
      ref={forwardedRef}
      role="progressbar"
      style={[styles.container, style]}
    >
      <View
        children={svg}
        style={[
          typeof size === 'number'
            ? { height: size, width: size }
            : indicatorSizes[size],
          styles.animation,
          !animating && styles.animationPause,
          !animating && hidesWhenStopped && styles.hidesWhenStopped
        ]}
      />
    </View>
  );
});

ActivityIndicator.displayName = 'ActivityIndicator';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  hidesWhenStopped: {
    visibility: 'hidden'
  },
  animation: {
    animationDuration: '0.75s',
    animationKeyframes: [
      {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    ],
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  },
  animationPause: {
    animationPlayState: 'paused'
  }
});

const indicatorSizes = StyleSheet.create({
  small: {
    width: 20,
    height: 20
  },
  large: {
    width: 36,
    height: 36
  }
});

export default ActivityIndicator;
