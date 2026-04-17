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
import createElement from '../createElement';
import multiplyStyleLengthValue from '../../modules/multiplyStyleLengthValue';
import StyleSheet from '../StyleSheet';
import View from '../View';

type SwitchProps = {
  ...ViewProps,
  activeThumbColor?: ColorValue,
  activeTrackColor?: ColorValue,
  disabled?: boolean,
  onValueChange?: (e: any) => void,
  thumbColor?: ColorValue,
  trackColor?: ColorValue | {| false: ColorValue, true: ColorValue |},
  value?: boolean
};

const emptyObject = {};
const thumbDefaultBoxShadow = '0px 1px 3px rgba(0,0,0,0.5)';
const thumbFocusedBoxShadow = `${thumbDefaultBoxShadow}, 0 0 0 10px rgba(0,0,0,0.1)`;

const defaultActiveTrackColor = '#A3D3CF';
const defaultTrackColor = '#939393';
const defaultDisabledTrackColor = '#D5D5D5';

const defaultActiveThumbColor = '#009688';
const defaultThumbColor = '#FAFAFA';
const defaultDisabledThumbColor = '#BDBDBD';

const Switch: React.AbstractComponent<
  SwitchProps,
  React.ElementRef<typeof View>
> = React.forwardRef((props, forwardedRef) => {
  const {
    'aria-label': ariaLabel,
    accessibilityLabel,
    activeThumbColor,
    activeTrackColor,
    disabled = false,
    onValueChange,
    style = emptyObject,
    thumbColor,
    trackColor,
    value = false,
    ...other
  } = props;

  const thumbRef = React.useRef(null);

  function handleChange(event: Object) {
    if (onValueChange != null) {
      onValueChange(event.nativeEvent.target.checked);
    }
  }

  function handleFocusState(event: Object) {
    const isFocused = event.nativeEvent.type === 'focus';
    const boxShadow = isFocused ? thumbFocusedBoxShadow : thumbDefaultBoxShadow;
    if (thumbRef.current != null) {
      thumbRef.current.style.boxShadow = boxShadow;
    }
  }

  const { height: styleHeight, width: styleWidth } = StyleSheet.flatten(style);
  const height = styleHeight || '20px';
  const minWidth = multiplyStyleLengthValue(height, 2);
  const width = styleWidth > minWidth ? styleWidth : minWidth;
  const trackBorderRadius = multiplyStyleLengthValue(height, 0.5);

  const trackCurrentColor = (function () {
    if (value === true) {
      if (trackColor != null && typeof trackColor === 'object') {
        return trackColor.true;
      } else {
        return activeTrackColor ?? defaultActiveTrackColor;
      }
    } else {
      if (trackColor != null && typeof trackColor === 'object') {
        return trackColor.false;
      } else {
        return trackColor ?? defaultTrackColor;
      }
    }
  })();

  const thumbCurrentColor = value
    ? activeThumbColor ?? defaultActiveThumbColor
    : thumbColor ?? defaultThumbColor;

  const thumbHeight = height;
  const thumbWidth = thumbHeight;

  const rootStyle = [
    styles.root,
    style,
    disabled && styles.cursorDefault,
    { height, width }
  ];

  const disabledTrackColor = (function () {
    if (value === true) {
      if (
        (typeof activeTrackColor === 'string' && activeTrackColor != null) ||
        (typeof trackColor === 'object' && trackColor?.true)
      ) {
        return trackCurrentColor;
      } else {
        return defaultDisabledTrackColor;
      }
    } else {
      if (
        (typeof trackColor === 'string' && trackColor != null) ||
        (typeof trackColor === 'object' && trackColor?.false)
      ) {
        return trackCurrentColor;
      } else {
        return defaultDisabledTrackColor;
      }
    }
  })();

  const disabledThumbColor = (function () {
    if (value === true) {
      if (activeThumbColor == null) {
        return defaultDisabledThumbColor;
      } else {
        return thumbCurrentColor;
      }
    } else {
      if (thumbColor == null) {
        return defaultDisabledThumbColor;
      } else {
        return thumbCurrentColor;
      }
    }
  })();

  const trackStyle = [
    styles.track,
    {
      backgroundColor: disabled ? disabledTrackColor : trackCurrentColor,
      borderRadius: trackBorderRadius
    }
  ];

  const thumbStyle = [
    styles.thumb,
    value && styles.thumbActive,
    {
      backgroundColor: disabled ? disabledThumbColor : thumbCurrentColor,
      height: thumbHeight,
      marginStart: value ? multiplyStyleLengthValue(thumbWidth, -1) : 0,
      width: thumbWidth
    }
  ];

  const nativeControl = createElement('input', {
    'aria-label': ariaLabel || accessibilityLabel,
    checked: value,
    disabled: disabled,
    onBlur: handleFocusState,
    onChange: handleChange,
    onFocus: handleFocusState,
    ref: forwardedRef,
    style: [styles.nativeControl, styles.cursorInherit],
    type: 'checkbox',
    role: 'switch'
  });

  return (
    <View {...other} style={rootStyle}>
      <View style={trackStyle} />
      <View ref={thumbRef} style={thumbStyle} />
      {nativeControl}
    </View>
  );
});

Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  cursorDefault: {
    cursor: 'default'
  },
  cursorInherit: {
    cursor: 'inherit'
  },
  track: {
    forcedColorAdjust: 'none',
    ...StyleSheet.absoluteFillObject,
    height: '70%',
    margin: 'auto',
    transitionDuration: '0.1s',
    width: '100%'
  },
  thumb: {
    forcedColorAdjust: 'none',
    alignSelf: 'flex-start',
    borderRadius: '100%',
    boxShadow: thumbDefaultBoxShadow,
    start: '0%',
    transform: 'translateZ(0)',
    transitionDuration: '0.1s'
  },
  thumbActive: {
    insetInlineStart: '100%'
  },
  nativeControl: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    margin: 0,
    appearance: 'none',
    padding: 0,
    width: '100%'
  }
});

export default Switch;
