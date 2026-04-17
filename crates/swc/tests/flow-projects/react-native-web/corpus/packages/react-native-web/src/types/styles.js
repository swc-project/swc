/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, DimensionValue } from './index';

type NumberOrString = number | string;

/**
 * Animations and transitions
 */

type AnimationDirection =
  | 'alternate'
  | 'alternate-reverse'
  | 'normal'
  | 'reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
type AnimationIterationCount = number | 'infinite';
type AnimationKeyframes = string | Object;
type AnimationPlayState = 'paused' | 'running';

export type AnimationStyles = {|
  animationDelay?: ?(string | Array<string>),
  animationDirection?: ?(AnimationDirection | Array<AnimationDirection>),
  animationDuration?: ?(string | Array<string>),
  animationFillMode?: ?(AnimationFillMode | Array<AnimationFillMode>),
  animationIterationCount?: ?(
    | AnimationIterationCount
    | Array<AnimationIterationCount>
  ),
  animationKeyframes?: ?(AnimationKeyframes | Array<AnimationKeyframes>),
  animationPlayState?: ?(AnimationPlayState | Array<AnimationPlayState>),
  animationTimingFunction?: ?(string | Array<string>),
  transitionDelay?: ?(string | Array<string>),
  transitionDuration?: ?(string | Array<string>),
  transitionProperty?: ?(string | Array<string>),
  transitionTimingFunction?: ?(string | Array<string>)
|};

/**
 * Border
 */

type BorderRadiusValue = number | string;
type BorderStyleValue = 'solid' | 'dotted' | 'dashed';

export type BorderStyles = {|
  // color
  borderColor?: ?ColorValue,
  borderBlockColor?: ?ColorValue,
  borderBlockEndColor?: ?ColorValue,
  borderBlockStartColor?: ?ColorValue,
  borderBottomColor?: ?ColorValue,
  borderInlineColor?: ?ColorValue,
  borderInlineEndColor?: ?ColorValue,
  borderInlineStartColor?: ?ColorValue,
  borderLeftColor?: ?ColorValue,
  borderRightColor?: ?ColorValue,
  borderTopColor?: ?ColorValue,
  // radius
  borderRadius?: ?BorderRadiusValue,
  borderEndEndRadius?: ?BorderRadiusValue,
  borderEndStartRadius?: ?BorderRadiusValue,
  borderStartEndRadius?: ?BorderRadiusValue,
  borderStartStartRadius?: ?BorderRadiusValue,
  borderBottomLeftRadius?: ?BorderRadiusValue,
  borderBottomRightRadius?: ?BorderRadiusValue,
  borderTopLeftRadius?: ?BorderRadiusValue,
  borderTopRightRadius?: ?BorderRadiusValue,
  // style
  borderStyle?: ?BorderStyleValue,
  borderBlockStyle?: ?BorderStyleValue,
  borderBlockEndStyle?: ?BorderStyleValue,
  borderBlockStartStyle?: ?BorderStyleValue,
  borderBottomStyle?: ?BorderStyleValue,
  borderInlineStyle?: ?BorderStyleValue,
  borderInlineEndStyle?: ?BorderStyleValue,
  borderInlineStartStyle?: ?BorderStyleValue,
  borderLeftStyle?: ?BorderStyleValue,
  borderRightStyle?: ?BorderStyleValue,
  borderTopStyle?: ?BorderStyleValue,
  // deprecated
  borderEndColor?: ?ColorValue,
  borderStartColor?: ?ColorValue,
  borderEndStyle?: ?BorderStyleValue,
  borderStartStyle?: ?BorderStyleValue,
  borderBottomEndRadius?: ?BorderRadiusValue,
  borderBottomStartRadius?: ?BorderRadiusValue,
  borderTopEndRadius?: ?BorderRadiusValue,
  borderTopStartRadius?: ?BorderRadiusValue
|};

/**
 * Interactions
 */

type CursorValue =
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'context-menu'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'text'
  | 'vertical-text'
  | 'move'
  | 'none'
  | 'no-drop'
  | 'not-allowed'
  | 'zoom-in'
  | 'zoom-out'
  // resize
  | 'col-resize'
  | 'e-resize'
  | 'ew-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'ns-resize'
  | 'nw-resize'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'nesw-resize'
  | 'nwse-resize';

type TouchActionValue =
  | 'auto'
  | 'inherit'
  | 'manipulation'
  | 'none'
  | 'pan-down'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'pan-x'
  | 'pan-y'
  | 'pinch-zoom';

type UserSelect = 'all' | 'auto' | 'contain' | 'none' | 'text';

export type InteractionStyles = {|
  // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#Formal_syntax
  cursor?: ?CursorValue,
  // https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action#Formal_syntax
  touchAction?: ?TouchActionValue,
  // https://developer.mozilla.org/en-US/docs/Web/CSS/user-select#Formal_syntax_2
  userSelect?: ?UserSelect,
  willChange?: ?string
|};

/**
 * Layout
 */

type OverflowValue = 'auto' | 'hidden' | 'scroll' | 'visible';
type VisiblilityValue = 'hidden' | 'visible';

export type LayoutStyles = {|
  alignContent?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'stretch',
  alignItems?: ?('baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch'),
  alignSelf?: ?(
    | 'auto'
    | 'baseline'
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'stretch'
  ),
  aspectRatio?: ?NumberOrString,
  backfaceVisibility?: ?VisiblilityValue,
  borderWidth?: ?DimensionValue,
  borderBlockWidth?: ?DimensionValue,
  borderBlockEndWidth?: ?DimensionValue,
  borderBlockStartWidth?: ?DimensionValue,
  borderBottomWidth?: ?DimensionValue,
  borderInlineWidth?: ?DimensionValue,
  borderInlineEndWidth?: ?DimensionValue,
  borderInlineStartWidth?: ?DimensionValue,
  borderLeftWidth?: ?DimensionValue,
  borderRightWidth?: ?DimensionValue,
  borderTopWidth?: ?DimensionValue,
  bottom?: ?DimensionValue,
  boxSizing?: ?('border-box' | 'content-box' | 'padding-box'),
  columnGap?: ?DimensionValue,
  direction?: ?('inherit' | 'ltr' | 'rtl'),
  display?: ?string,
  flex?: ?number,
  flexBasis?: ?DimensionValue,
  flexDirection?: ?('column' | 'column-reverse' | 'row' | 'row-reverse'),
  flexGrow?: ?number,
  flexShrink?: ?number,
  flexWrap?: ?('nowrap' | 'wrap' | 'wrap-reverse'),
  gap?: ?DimensionValue,
  height?: ?DimensionValue,
  inset?: ?DimensionValue,
  insetBlock?: ?DimensionValue,
  insetBlockEnd?: ?DimensionValue,
  insetBlockStart?: ?DimensionValue,
  insetInline?: ?DimensionValue,
  insetInlineEnd?: ?DimensionValue,
  insetInlineStart?: ?DimensionValue,
  justifyContent?: ?(
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
  ),
  left?: ?DimensionValue,
  margin?: ?DimensionValue,
  marginBlock?: ?DimensionValue,
  marginBlockEnd?: ?DimensionValue,
  marginBlockStart?: ?DimensionValue,
  marginBottom?: ?DimensionValue,
  marginInline?: ?DimensionValue,
  marginInlineEnd?: ?DimensionValue,
  marginInlineStart?: ?DimensionValue,
  marginLeft?: ?DimensionValue,
  marginRight?: ?DimensionValue,
  marginTop?: ?DimensionValue,
  maxHeight?: ?DimensionValue,
  maxWidth?: ?DimensionValue,
  minHeight?: ?DimensionValue,
  minWidth?: ?DimensionValue,
  order?: ?number,
  overflow?: ?OverflowValue,
  overflowX?: ?OverflowValue,
  overflowY?: ?OverflowValue,
  padding?: ?DimensionValue,
  paddingBlock?: ?DimensionValue,
  paddingBlockEnd?: ?DimensionValue,
  paddingBlockStart?: ?DimensionValue,
  paddingBottom?: ?DimensionValue,
  paddingInline?: ?DimensionValue,
  paddingInlineEnd?: ?DimensionValue,
  paddingInlineStart?: ?DimensionValue,
  paddingLeft?: ?DimensionValue,
  paddingRight?: ?DimensionValue,
  paddingTop?: ?DimensionValue,
  position?: ?('absolute' | 'fixed' | 'relative' | 'static' | 'sticky'),
  right?: ?DimensionValue,
  rowGap?: ?DimensionValue,
  top?: ?DimensionValue,
  visibility?: ?VisiblilityValue,
  width?: ?DimensionValue,
  zIndex?: ?number,
  /**
   * @platform web
   */
  gridAutoColumns?: ?string,
  gridAutoFlow?: ?string,
  gridAutoRows?: ?string,
  gridColumnEnd?: ?string,
  gridColumnGap?: ?string,
  gridColumnStart?: ?string,
  gridRowEnd?: ?string,
  gridRowGap?: ?string,
  gridRowStart?: ?string,
  gridTemplateColumns?: ?string,
  gridTemplateRows?: ?string,
  gridTemplateAreas?: ?string,
  /**
   * @deprecated
   */
  borderEndWidth?: ?DimensionValue,
  borderStartWidth?: ?DimensionValue,
  end?: ?DimensionValue,
  marginHorizontal?: ?DimensionValue,
  marginEnd?: ?DimensionValue,
  marginStart?: ?DimensionValue,
  marginVertical?: ?DimensionValue,
  paddingHorizontal?: ?DimensionValue,
  paddingStart?: ?DimensionValue,
  paddingEnd?: ?DimensionValue,
  paddingVertical?: ?DimensionValue,
  start?: ?DimensionValue
|};

/**
 * Shadows
 */

export type ShadowStyles = {|
  // @deprecated
  shadowColor?: ?ColorValue,
  shadowOffset?: ?{|
    width?: DimensionValue,
    height?: DimensionValue
  |},
  shadowOpacity?: ?number,
  shadowRadius?: ?DimensionValue
|};

/**
 * Transforms
 */

export type TransformStyles = {|
  perspective?: ?NumberOrString,
  perspectiveOrigin?: ?string,
  transform?:
    | ?string
    | Array<
        | {| +perspective: NumberOrString |}
        | {| +rotate: string |}
        | {| +rotateX: string |}
        | {| +rotateY: string |}
        | {| +rotateZ: string |}
        | {| +scale: number |}
        | {| +scaleX: number |}
        | {| +scaleY: number |}
        | {| +scaleZ: number |}
        | {| +scale3d: string |}
        | {| +skewX: string |}
        | {| +skewY: string |}
        | {| +translateX: NumberOrString |}
        | {| +translateY: NumberOrString |}
        | {| +translateZ: NumberOrString |}
        | {| +translate3d: string |}
      >,
  transformOrigin?: ?string | Array<NumberOrString>,
  transformStyle?: ?('flat' | 'preserve-3d')
|};
