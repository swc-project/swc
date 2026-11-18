/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

export const defaultProps = {
  children: true,
  dataSet: true,
  dir: true,
  id: true,
  ref: true,
  suppressHydrationWarning: true,
  tabIndex: true,
  testID: true,
  // @deprecated
  focusable: true,
  nativeID: true
};

export const accessibilityProps = {
  'aria-activedescendant': true,
  'aria-atomic': true,
  'aria-autocomplete': true,
  'aria-busy': true,
  'aria-checked': true,
  'aria-colcount': true,
  'aria-colindex': true,
  'aria-colspan': true,
  'aria-controls': true,
  'aria-current': true,
  'aria-describedby': true,
  'aria-details': true,
  'aria-disabled': true,
  'aria-errormessage': true,
  'aria-expanded': true,
  'aria-flowto': true,
  'aria-haspopup': true,
  'aria-hidden': true,
  'aria-invalid': true,
  'aria-keyshortcuts': true,
  'aria-label': true,
  'aria-labelledby': true,
  'aria-level': true,
  'aria-live': true,
  'aria-modal': true,
  'aria-multiline': true,
  'aria-multiselectable': true,
  'aria-orientation': true,
  'aria-owns': true,
  'aria-placeholder': true,
  'aria-posinset': true,
  'aria-pressed': true,
  'aria-readonly': true,
  'aria-required': true,
  inert: true,
  role: true,
  'aria-roledescription': true,
  'aria-rowcount': true,
  'aria-rowindex': true,
  'aria-rowspan': true,
  'aria-selected': true,
  'aria-setsize': true,
  'aria-sort': true,
  'aria-valuemax': true,
  'aria-valuemin': true,
  'aria-valuenow': true,
  'aria-valuetext': true,
  // @deprecated
  accessibilityActiveDescendant: true,
  accessibilityAtomic: true,
  accessibilityAutoComplete: true,
  accessibilityBusy: true,
  accessibilityChecked: true,
  accessibilityColumnCount: true,
  accessibilityColumnIndex: true,
  accessibilityColumnSpan: true,
  accessibilityControls: true,
  accessibilityCurrent: true,
  accessibilityDescribedBy: true,
  accessibilityDetails: true,
  accessibilityDisabled: true,
  accessibilityErrorMessage: true,
  accessibilityExpanded: true,
  accessibilityFlowTo: true,
  accessibilityHasPopup: true,
  accessibilityHidden: true,
  accessibilityInvalid: true,
  accessibilityKeyShortcuts: true,
  accessibilityLabel: true,
  accessibilityLabelledBy: true,
  accessibilityLevel: true,
  accessibilityLiveRegion: true,
  accessibilityModal: true,
  accessibilityMultiline: true,
  accessibilityMultiSelectable: true,
  accessibilityOrientation: true,
  accessibilityOwns: true,
  accessibilityPlaceholder: true,
  accessibilityPosInSet: true,
  accessibilityPressed: true,
  accessibilityReadOnly: true,
  accessibilityRequired: true,
  accessibilityRole: true,
  accessibilityRoleDescription: true,
  accessibilityRowCount: true,
  accessibilityRowIndex: true,
  accessibilityRowSpan: true,
  accessibilitySelected: true,
  accessibilitySetSize: true,
  accessibilitySort: true,
  accessibilityValueMax: true,
  accessibilityValueMin: true,
  accessibilityValueNow: true,
  accessibilityValueText: true
};

export const clickProps = {
  onClick: true,
  onAuxClick: true,
  onContextMenu: true,
  onGotPointerCapture: true,
  onLostPointerCapture: true,
  onPointerCancel: true,
  onPointerDown: true,
  onPointerEnter: true,
  onPointerMove: true,
  onPointerLeave: true,
  onPointerOut: true,
  onPointerOver: true,
  onPointerUp: true
};

export const focusProps = {
  onBlur: true,
  onFocus: true
};

export const keyboardProps = {
  onKeyDown: true,
  onKeyDownCapture: true,
  onKeyUp: true,
  onKeyUpCapture: true
};

export const mouseProps = {
  onMouseDown: true,
  onMouseEnter: true,
  onMouseLeave: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true
};

export const touchProps = {
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true
};

export const styleProps = {
  style: true
};
