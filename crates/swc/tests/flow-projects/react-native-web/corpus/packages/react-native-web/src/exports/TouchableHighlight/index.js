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

import type { ColorValue } from '../../types';
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
  onHideUnderlay?: ?() => void,
  onShowUnderlay?: ?() => void,
  style?: ViewStyle,
  testOnly_pressed?: ?boolean,
  underlayColor?: ?ColorValue
|}>;

type ExtraStyles = $ReadOnly<{|
  child: ViewStyle,
  underlay: ViewStyle
|}>;

function createExtraStyles(activeOpacity, underlayColor): ExtraStyles {
  return {
    child: { opacity: activeOpacity ?? 0.85 },
    underlay: {
      backgroundColor: underlayColor === undefined ? 'black' : underlayColor
    }
  };
}

function hasPressHandler(props): boolean {
  return (
    props.onPress != null ||
    props.onPressIn != null ||
    props.onPressOut != null ||
    props.onLongPress != null
  );
}

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, which allows
 * the underlay color to show through, darkening or tinting the view.
 *
 * The underlay comes from wrapping the child in a new View, which can affect
 * layout, and sometimes cause unwanted visual artifacts if not used correctly,
 * for example if the backgroundColor of the wrapped view isn't explicitly set
 * to an opaque color.
 *
 * TouchableHighlight must have one child (not zero or more than one).
 * If you wish to have several child components, wrap them in a View.
 */
function TouchableHighlight(props: Props, forwardedRef): React.Node {
  /*
  warnOnce(
    'TouchableHighlight',
    'TouchableHighlight is deprecated. Please use Pressable.'
  );
  */

  const {
    activeOpacity,
    children,
    delayPressIn,
    delayPressOut,
    delayLongPress,
    disabled,
    focusable,
    onHideUnderlay,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    onShowUnderlay,
    rejectResponderTermination,
    style,
    testOnly_pressed,
    underlayColor,
    ...rest
  } = props;

  const hostRef = useRef(null);
  const setRef = useMergeRefs(forwardedRef, hostRef);

  const [extraStyles, setExtraStyles] = useState(
    testOnly_pressed === true
      ? createExtraStyles(activeOpacity, underlayColor)
      : null
  );

  const showUnderlay = useCallback(() => {
    if (!hasPressHandler(props)) {
      return;
    }
    setExtraStyles(createExtraStyles(activeOpacity, underlayColor));
    if (onShowUnderlay != null) {
      onShowUnderlay();
    }
  }, [activeOpacity, onShowUnderlay, props, underlayColor]);

  const hideUnderlay = useCallback(() => {
    if (testOnly_pressed === true) {
      return;
    }
    if (hasPressHandler(props)) {
      setExtraStyles(null);
      if (onHideUnderlay != null) {
        onHideUnderlay();
      }
    }
  }, [onHideUnderlay, props, testOnly_pressed]);

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
        showUnderlay();
        if (onPressIn != null) {
          onPressIn(event);
        }
      },
      onPressEnd(event) {
        hideUnderlay();
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
      showUnderlay,
      hideUnderlay
    ]
  );

  const pressEventHandlers = usePressEvents(hostRef, pressConfig);

  const child = React.Children.only(children);

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
        style,
        !disabled && styles.actionable,
        extraStyles && extraStyles.underlay
      ]}
    >
      {React.cloneElement(child, {
        style: [child.props.style, extraStyles && extraStyles.child]
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    userSelect: 'none'
  },
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});

const MemoedTouchableHighlight = React.memo(
  React.forwardRef(TouchableHighlight)
);
MemoedTouchableHighlight.displayName = 'TouchableHighlight';

export default (MemoedTouchableHighlight: React.AbstractComponent<
  Props,
  React.ElementRef<typeof View>
>);
