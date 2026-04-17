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

import type { PressResponderConfig } from '../../modules/usePressEvents/PressResponder';
import type { ViewProps } from '../View';

import * as React from 'react';
import { useMemo, useRef } from 'react';
import pick from '../../modules/pick';
import useMergeRefs from '../../modules/useMergeRefs';
import usePressEvents from '../../modules/usePressEvents';
import { warnOnce } from '../../modules/warnOnce';

export type Props = $ReadOnly<{|
  accessibilityLabel?: $PropertyType<ViewProps, 'accessibilityLabel'>,
  accessibilityLiveRegion?: $PropertyType<ViewProps, 'accessibilityLiveRegion'>,
  accessibilityRole?: $PropertyType<ViewProps, 'accessibilityRole'>,
  children?: ?React.Node,
  delayLongPress?: ?number,
  delayPressIn?: ?number,
  delayPressOut?: ?number,
  disabled?: ?boolean,
  focusable?: ?boolean,
  nativeID?: $PropertyType<ViewProps, 'nativeID'>,
  onBlur?: $PropertyType<ViewProps, 'onBlur'>,
  onFocus?: $PropertyType<ViewProps, 'onFocus'>,
  onLayout?: $PropertyType<ViewProps, 'onLayout'>,
  onLongPress?: $PropertyType<PressResponderConfig, 'onLongPress'>,
  onPress?: $PropertyType<PressResponderConfig, 'onPress'>,
  onPressIn?: $PropertyType<PressResponderConfig, 'onPressStart'>,
  onPressOut?: $PropertyType<PressResponderConfig, 'onPressEnd'>,
  rejectResponderTermination?: ?boolean,
  testID?: $PropertyType<ViewProps, 'testID'>
|}>;

const forwardPropsList = {
  accessibilityDisabled: true,
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  children: true,
  disabled: true,
  focusable: true,
  nativeID: true,
  onBlur: true,
  onFocus: true,
  onLayout: true,
  testID: true
};

const pickProps = (props) => pick(props, forwardPropsList);

function TouchableWithoutFeedback(props: Props, forwardedRef): React.Node {
  warnOnce(
    'TouchableWithoutFeedback',
    'TouchableWithoutFeedback is deprecated. Please use Pressable.'
  );

  const {
    delayPressIn,
    delayPressOut,
    delayLongPress,
    disabled,
    focusable,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    rejectResponderTermination
  } = props;

  const hostRef = useRef(null);

  const pressConfig = useMemo(
    () => ({
      cancelable: !rejectResponderTermination,
      disabled,
      delayLongPress,
      delayPressStart: delayPressIn,
      delayPressEnd: delayPressOut,
      onLongPress,
      onPress,
      onPressStart: onPressIn,
      onPressEnd: onPressOut
    }),
    [
      disabled,
      delayPressIn,
      delayPressOut,
      delayLongPress,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      rejectResponderTermination
    ]
  );

  const pressEventHandlers = usePressEvents(hostRef, pressConfig);

  const element = React.Children.only(props.children);
  const children = [element.props.children];
  const supportedProps = pickProps(props);
  supportedProps.accessibilityDisabled = disabled;
  supportedProps.focusable = !disabled && focusable !== false;
  supportedProps.ref = useMergeRefs(forwardedRef, hostRef, element.ref);

  const elementProps = Object.assign(supportedProps, pressEventHandlers);

  return React.cloneElement(element, elementProps, ...children);
}

const MemoedTouchableWithoutFeedback = React.memo(
  React.forwardRef(TouchableWithoutFeedback)
);
MemoedTouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback';

export default (MemoedTouchableWithoutFeedback: React.AbstractComponent<
  Props,
  React.ElementRef<any>
>);
