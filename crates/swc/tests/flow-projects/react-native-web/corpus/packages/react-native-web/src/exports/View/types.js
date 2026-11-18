/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp, LayoutEvent } from '../../types';

import type {
  AnimationStyles,
  BorderStyles,
  InteractionStyles,
  LayoutStyles,
  ShadowStyles,
  TransformStyles
} from '../../types/styles';

type NumberOrString = number | string;
type OverscrollBehaviorValue = 'auto' | 'contain' | 'none';
type idRef = string;
type idRefList = idRef | Array<idRef>;

export type AccessibilityProps = {|
  'aria-activedescendant'?: ?idRef,
  'aria-atomic'?: ?boolean,
  'aria-autocomplete'?: ?('none' | 'list' | 'inline' | 'both'),
  'aria-busy'?: ?boolean,
  'aria-checked'?: ?(boolean | 'mixed'),
  'aria-colcount'?: ?number,
  'aria-colindex'?: ?number,
  'aria-colspan'?: ?number,
  'aria-controls'?: ?idRef,
  'aria-current'?: ?(boolean | 'page' | 'step' | 'location' | 'date' | 'time'),
  'aria-describedby'?: ?idRef,
  'aria-details'?: ?idRef,
  'aria-disabled'?: ?boolean,
  'aria-errormessage'?: ?idRef,
  'aria-expanded'?: ?boolean,
  'aria-flowto'?: ?idRef,
  'aria-haspopup'?: ?('dialog' | 'grid' | 'listbox' | 'menu' | 'tree' | false),
  'aria-hidden'?: ?boolean,
  'aria-invalid'?: ?boolean,
  'aria-keyshortcuts'?: ?Array<string>,
  'aria-label'?: ?string,
  'aria-labelledby'?: ?idRef,
  'aria-level'?: ?number,
  'aria-live'?: ?('assertive' | 'none' | 'polite'),
  'aria-modal'?: ?boolean,
  'aria-multiline'?: ?boolean,
  'aria-multiselectable'?: ?boolean,
  'aria-orientation'?: ?('horizontal' | 'vertical'),
  'aria-owns'?: ?idRef,
  'aria-placeholder'?: ?string,
  'aria-posinset'?: ?number,
  'aria-pressed'?: ?(boolean | 'mixed'),
  'aria-readonly'?: ?boolean,
  'aria-required'?: ?boolean,
  'aria-roledescription'?: ?string,
  'aria-rowcount'?: ?number,
  'aria-rowindex'?: ?number,
  'aria-rowspan'?: ?number,
  'aria-selected'?: ?boolean,
  'aria-setsize'?: ?number,
  'aria-sort'?: ?('ascending' | 'descending' | 'none' | 'other'),
  'aria-valuemax'?: ?number,
  'aria-valuemin'?: ?number,
  'aria-valuenow'?: ?number,
  'aria-valuetext'?: ?string,
  role?: ?string,

  // @deprecated
  accessibilityActiveDescendant?: ?idRef,
  accessibilityAtomic?: ?boolean,
  accessibilityAutoComplete?: ?('none' | 'list' | 'inline' | 'both'),
  accessibilityBusy?: ?boolean,
  accessibilityChecked?: ?(boolean | 'mixed'),
  accessibilityColumnCount?: ?number,
  accessibilityColumnIndex?: ?number,
  accessibilityColumnSpan?: ?number,
  accessibilityControls?: ?idRefList,
  accessibilityCurrent?: ?(
    | boolean
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
  ),
  accessibilityDescribedBy?: ?idRefList,
  accessibilityDetails?: ?idRef,
  accessibilityDisabled?: ?boolean,
  accessibilityErrorMessage?: ?idRef,
  accessibilityExpanded?: ?boolean,
  accessibilityFlowTo?: ?idRefList,
  accessibilityHasPopup?: ?(
    | 'dialog'
    | 'grid'
    | 'listbox'
    | 'menu'
    | 'tree'
    | false
  ),
  accessibilityHidden?: ?boolean,
  accessibilityInvalid?: ?boolean,
  accessibilityKeyShortcuts?: ?Array<string>,
  accessibilityLabel?: ?string,
  accessibilityLabelledBy?: ?idRefList,
  accessibilityLevel?: ?number,
  accessibilityLiveRegion?: ?('assertive' | 'none' | 'polite'),
  accessibilityModal?: ?boolean,
  accessibilityMultiline?: ?boolean,
  accessibilityMultiSelectable?: ?boolean,
  accessibilityOrientation?: ?('horizontal' | 'vertical'),
  accessibilityOwns?: ?idRefList,
  accessibilityPlaceholder?: ?string,
  accessibilityPosInSet?: ?number,
  accessibilityPressed?: ?(boolean | 'mixed'),
  accessibilityReadOnly?: ?boolean,
  accessibilityRequired?: ?boolean,
  accessibilityRole?: ?string,
  accessibilityRoleDescription?: ?string,
  accessibilityRowCount?: ?number,
  accessibilityRowIndex?: ?number,
  accessibilityRowSpan?: ?number,
  accessibilitySelected?: ?boolean,
  accessibilitySetSize?: ?number,
  accessibilitySort?: ?('ascending' | 'descending' | 'none' | 'other'),
  accessibilityValueMax?: ?number,
  accessibilityValueMin?: ?number,
  accessibilityValueNow?: ?number,
  accessibilityValueText?: ?string
|};

export type EventProps = {|
  onAuxClick?: (e: any) => void,
  onBlur?: (e: any) => void,
  onClick?: (e: any) => void,
  onContextMenu?: (e: any) => void,
  onFocus?: (e: any) => void,
  onGotPointerCapture?: (e: any) => void,
  onKeyDown?: (e: any) => void,
  onKeyUp?: (e: any) => void,
  onLayout?: (e: LayoutEvent) => void,
  onLostPointerCapture?: (e: any) => void,
  onMoveShouldSetResponder?: (e: any) => boolean,
  onMoveShouldSetResponderCapture?: (e: any) => boolean,
  onPointerCancel?: (e: any) => void,
  onPointerDown?: (e: any) => void,
  onPointerEnter?: (e: any) => void,
  onPointerMove?: (e: any) => void,
  onPointerLeave?: (e: any) => void,
  onPointerOut?: (e: any) => void,
  onPointerOver?: (e: any) => void,
  onPointerUp?: (e: any) => void,
  onResponderEnd?: (e: any) => void,
  onResponderGrant?: (e: any) => void | boolean,
  onResponderMove?: (e: any) => void,
  onResponderReject?: (e: any) => void,
  onResponderRelease?: (e: any) => void,
  onResponderStart?: (e: any) => void,
  onResponderTerminate?: (e: any) => void,
  onResponderTerminationRequest?: (e: any) => boolean,
  onScrollShouldSetResponder?: (e: any) => boolean,
  onScrollShouldSetResponderCapture?: (e: any) => boolean,
  onSelectionChangeShouldSetResponder?: (e: any) => boolean,
  onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean,
  onStartShouldSetResponder?: (e: any) => boolean,
  onStartShouldSetResponderCapture?: (e: any) => boolean,
  // unstable
  onMouseDown?: (e: any) => void,
  onMouseEnter?: (e: any) => void,
  onMouseLeave?: (e: any) => void,
  onMouseMove?: (e: any) => void,
  onMouseOver?: (e: any) => void,
  onMouseOut?: (e: any) => void,
  onMouseUp?: (e: any) => void,
  onScroll?: (e: any) => void,
  onTouchCancel?: (e: any) => void,
  onTouchCancelCapture?: (e: any) => void,
  onTouchEnd?: (e: any) => void,
  onTouchEndCapture?: (e: any) => void,
  onTouchMove?: (e: any) => void,
  onTouchMoveCapture?: (e: any) => void,
  onTouchStart?: (e: any) => void,
  onTouchStartCapture?: (e: any) => void,
  onWheel?: (e: any) => void
|};

export type ViewStyle = {
  ...AnimationStyles,
  ...BorderStyles,
  ...InteractionStyles,
  ...LayoutStyles,
  ...ShadowStyles,
  ...TransformStyles,
  backdropFilter?: ?string,
  backgroundAttachment?: ?string,
  backgroundBlendMode?: ?string,
  backgroundClip?: ?string,
  backgroundColor?: ?ColorValue,
  backgroundImage?: ?string,
  backgroundOrigin?: 'border-box' | 'content-box' | 'padding-box',
  backgroundPosition?: ?string,
  backgroundRepeat?: ?string,
  backgroundSize?: ?string,
  boxShadow?: ?string,
  clip?: ?string,
  filter?: ?string,
  opacity?: ?number,
  outlineColor?: ?ColorValue,
  outlineOffset?: ?NumberOrString,
  outlineStyle?: ?string,
  outlineWidth?: ?NumberOrString,
  overscrollBehavior?: ?OverscrollBehaviorValue,
  overscrollBehaviorX?: ?OverscrollBehaviorValue,
  overscrollBehaviorY?: ?OverscrollBehaviorValue,
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto',
  scrollbarWidth?: 'auto' | 'none' | 'thin',
  scrollSnapAlign?: ?string,
  scrollSnapType?: ?string,
  WebkitMaskImage?: ?string,
  WebkitOverflowScrolling?: 'auto' | 'touch'
};

export type ViewProps = {
  ...AccessibilityProps,
  ...EventProps,
  children?: ?any,
  dataSet?: { ... },
  dir?: 'ltr' | 'rtl',
  id?: ?string,
  lang?: string,
  style?: GenericStyleProp<ViewStyle>,
  tabIndex?: ?(0 | -1),
  testID?: ?string,
  // unstable
  href?: ?string,
  hrefAttrs?: ?{ download?: ?boolean, rel?: ?string, target?: ?string },
  // @deprecated
  focusable?: ?boolean,
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto',
  nativeID?: ?string
};
