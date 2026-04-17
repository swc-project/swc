/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp } from '../../types';
import type { ViewProps, ViewStyle } from '../View/types';

type FontWeightValue =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

type NumberOrString = number | string;

export type TextStyle = {
  ...ViewStyle,
  color?: ?ColorValue,
  fontFamily?: ?string,
  fontFeatureSettings?: ?string,
  fontSize?: ?NumberOrString,
  fontStyle?: 'italic' | 'normal',
  fontWeight?: ?FontWeightValue,
  fontVariant?: $ReadOnlyArray<
    | 'small-caps'
    | 'oldstyle-nums'
    | 'lining-nums'
    | 'tabular-nums'
    | 'proportional-nums'
  >,
  letterSpacing?: ?NumberOrString,
  lineHeight?: ?NumberOrString,
  textAlign?:
    | 'center'
    | 'end'
    | 'inherit'
    | 'justify'
    | 'justify-all'
    | 'left'
    | 'right'
    | 'start',
  textDecorationColor?: ?ColorValue,
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through',
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed',
  textIndent?: ?NumberOrString,
  textOverflow?: ?string,
  textRendering?:
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed',
  textShadow?: ?string,
  textShadowColor?: ?ColorValue,
  textShadowOffset?: {| width?: number, height?: number |},
  textShadowRadius?: ?number,
  textTransform?: 'capitalize' | 'lowercase' | 'none' | 'uppercase',
  unicodeBidi?:
    | 'normal'
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'plaintext',
  userSelect?: 'none' | 'text',
  verticalAlign?: ?string,
  whiteSpace?: ?string,
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all',
  wordWrap?: ?string,
  writingDirection?: 'auto' | 'ltr' | 'rtl',
  /* @platform web */
  MozOsxFontSmoothing?: ?string,
  WebkitFontSmoothing?: ?string,
  // deprecated
  textAlignVertical?: ?string
};

export type TextProps = {
  ...ViewProps,
  dir?: 'auto' | 'ltr' | 'rtl',
  numberOfLines?: ?number,
  role?:
    | 'button'
    | 'header'
    | 'heading'
    | 'label'
    | 'link'
    | 'listitem'
    | 'none'
    | 'text',
  style?: GenericStyleProp<TextStyle>,
  testID?: ?string,
  // @deprecated
  accessibilityRole?:
    | 'button'
    | 'header'
    | 'heading'
    | 'label'
    | 'link'
    | 'listitem'
    | 'none'
    | 'text',
  onPress?: (e: any) => void,
  selectable?: boolean
};
