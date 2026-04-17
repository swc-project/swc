/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use client';

import type { Props as TouchableWithoutFeedbackProps } from '../TouchableWithoutFeedback';
import type { ViewProps } from '../View';

import * as React from 'react';
import { useCallback, useMemo, useState, useRef } from 'react';
import useMergeRefs from '../../modules/useMergeRefs';
import usePressEvents from '../../modules/usePressEvents';
import StyleSheet from '../StyleSheet';
import View from '../View';
//import { warnOnce } from '../../modules/warnOnce';

type ViewStyle = $PropertyType<ViewProps, 'style'>;

type Props = $ReadOnly<{|
  ...TouchableWithoutFeedbackProps,
  activeOpacity?: ?number,
  style?: ?ViewStyle
|}>;

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 */
function TouchableOpacity(props: Props, forwardedRef): React.Node {
  /*
  warnOnce(
    'TouchableOpacity',
    'TouchableOpacity is deprecated. Please use Pressable.'
  );
  */

  const {
    activeOpacity,
    delayPressIn,
    delayPressOut,
    delayLongPress,
    disabled,
    focusable,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    rejectResponderTermination,
    style,
    ...rest
  } = props;

  const hostRef = useRef(null);
  const setRef = useMergeRefs(forwardedRef, hostRef);

  const [duration, setDuration] = useState('0s');
  const [opacityOverride, setOpacityOverride] = useState(null);

  const setOpacityTo = useCallback(
    (value: ?number, duration: number) => {
      setOpacityOverride(value);
      setDuration(duration ? `${duration / 1000}s` : '0s');
    },
    [setOpacityOverride, setDuration]
  );

  const setOpacityActive = useCallback(
    (duration: number) => {
      setOpacityTo(activeOpacity ?? 0.2, duration);
    },
    [activeOpacity, setOpacityTo]
  );

  const setOpacityInactive = useCallback(
    (duration: number) => {
      setOpacityTo(null, duration);
    },
    [setOpacityTo]
  );

  const pressConfig = useMemo(
    () => ({
      cancelable: !rejectResponderTermination,
      disabled,
      delayLongPress,
      delayPressStart: delayPressIn,
      delayPressEnd: delayPressOut,
      onLongPress,
      onPress,
      onPressStart(event) {
        const isGrant =
          event.dispatchConfig != null
            ? event.dispatchConfig.registrationName === 'onResponderGrant'
            : event.type === 'keydown';
        setOpacityActive(isGrant ? 0 : 150);
        if (onPressIn != null) {
          onPressIn(event);
        }
      },
      onPressEnd(event) {
        setOpacityInactive(250);
        if (onPressOut != null) {
          onPressOut(event);
        }
      }
    }),
    [
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      rejectResponderTermination,
      setOpacityActive,
      setOpacityInactive
    ]
  );

  const pressEventHandlers = usePressEvents(hostRef, pressConfig);

  return (
    <View
      {...rest}
      {...pressEventHandlers}
      accessibilityDisabled={disabled}
      focusable={!disabled && focusable !== false}
      pointerEvents={disabled ? 'box-none' : undefined}
      ref={setRef}
      style={[
        styles.root,
        !disabled && styles.actionable,
        style,
        opacityOverride != null && { opacity: opacityOverride },
        { transitionDuration: duration }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    userSelect: 'none'
  },
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});

const MemoedTouchableOpacity = React.memo(React.forwardRef(TouchableOpacity));
MemoedTouchableOpacity.displayName = 'TouchableOpacity';

export default (MemoedTouchableOpacity: React.AbstractComponent<
  Props,
  React.ElementRef<typeof View>
>);
