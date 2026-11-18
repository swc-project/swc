/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import AccessibilityUtil from '../AccessibilityUtil';
import StyleSheet from '../../exports/StyleSheet';
import { warnOnce } from '../warnOnce';

const emptyObject = {};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const isArray = Array.isArray;

const uppercasePattern = /[A-Z]/g;
function toHyphenLower(match) {
  return '-' + match.toLowerCase();
}
function hyphenateString(str: string): string {
  return str.replace(uppercasePattern, toHyphenLower);
}
function processIDRefList(idRefList: string | Array<string>): string {
  return isArray(idRefList) ? idRefList.join(' ') : idRefList;
}

const pointerEventsStyles = StyleSheet.create({
  auto: {
    pointerEvents: 'auto'
  },
  'box-none': {
    pointerEvents: 'box-none'
  },
  'box-only': {
    pointerEvents: 'box-only'
  },
  none: {
    pointerEvents: 'none'
  }
});

const createDOMProps = (elementType, props, options) => {
  if (!props) {
    props = emptyObject;
  }

  const {
    'aria-activedescendant': ariaActiveDescendant,
    accessibilityActiveDescendant,
    'aria-atomic': ariaAtomic,
    accessibilityAtomic,
    'aria-autocomplete': ariaAutoComplete,
    accessibilityAutoComplete,
    'aria-busy': ariaBusy,
    accessibilityBusy,
    'aria-checked': ariaChecked,
    accessibilityChecked,
    'aria-colcount': ariaColumnCount,
    accessibilityColumnCount,
    'aria-colindex': ariaColumnIndex,
    accessibilityColumnIndex,
    'aria-colspan': ariaColumnSpan,
    accessibilityColumnSpan,
    'aria-controls': ariaControls,
    accessibilityControls,
    'aria-current': ariaCurrent,
    accessibilityCurrent,
    'aria-describedby': ariaDescribedBy,
    accessibilityDescribedBy,
    'aria-details': ariaDetails,
    accessibilityDetails,
    'aria-disabled': ariaDisabled,
    accessibilityDisabled,
    'aria-errormessage': ariaErrorMessage,
    accessibilityErrorMessage,
    'aria-expanded': ariaExpanded,
    accessibilityExpanded,
    'aria-flowto': ariaFlowTo,
    accessibilityFlowTo,
    'aria-haspopup': ariaHasPopup,
    accessibilityHasPopup,
    'aria-hidden': ariaHidden,
    accessibilityHidden,
    'aria-invalid': ariaInvalid,
    accessibilityInvalid,
    'aria-keyshortcuts': ariaKeyShortcuts,
    accessibilityKeyShortcuts,
    'aria-label': ariaLabel,
    accessibilityLabel,
    'aria-labelledby': ariaLabelledBy,
    accessibilityLabelledBy,
    'aria-level': ariaLevel,
    accessibilityLevel,
    'aria-live': ariaLive,
    accessibilityLiveRegion,
    'aria-modal': ariaModal,
    accessibilityModal,
    'aria-multiline': ariaMultiline,
    accessibilityMultiline,
    'aria-multiselectable': ariaMultiSelectable,
    accessibilityMultiSelectable,
    'aria-orientation': ariaOrientation,
    accessibilityOrientation,
    'aria-owns': ariaOwns,
    accessibilityOwns,
    'aria-placeholder': ariaPlaceholder,
    accessibilityPlaceholder,
    'aria-posinset': ariaPosInSet,
    accessibilityPosInSet,
    'aria-pressed': ariaPressed,
    accessibilityPressed,
    'aria-readonly': ariaReadOnly,
    accessibilityReadOnly,
    'aria-required': ariaRequired,
    accessibilityRequired,
    /* eslint-disable */
    role: ariaRole,
    accessibilityRole,
    /* eslint-enable */
    'aria-roledescription': ariaRoleDescription,
    accessibilityRoleDescription,
    'aria-rowcount': ariaRowCount,
    accessibilityRowCount,
    'aria-rowindex': ariaRowIndex,
    accessibilityRowIndex,
    'aria-rowspan': ariaRowSpan,
    accessibilityRowSpan,
    'aria-selected': ariaSelected,
    accessibilitySelected,
    'aria-setsize': ariaSetSize,
    accessibilitySetSize,
    'aria-sort': ariaSort,
    accessibilitySort,
    'aria-valuemax': ariaValueMax,
    accessibilityValueMax,
    'aria-valuemin': ariaValueMin,
    accessibilityValueMin,
    'aria-valuenow': ariaValueNow,
    accessibilityValueNow,
    'aria-valuetext': ariaValueText,
    accessibilityValueText,
    dataSet,
    focusable,
    id,
    nativeID,
    pointerEvents,
    style,
    tabIndex,
    testID,
    // Rest
    ...domProps
  } = props;

  /*
  if (accessibilityDisabled != null) {
    warnOnce('accessibilityDisabled', `accessibilityDisabled is deprecated.`);
  }
  */
  const disabled = ariaDisabled || accessibilityDisabled;

  const role = AccessibilityUtil.propsToAriaRole(props);

  // ACCESSIBILITY
  /*
  if (accessibilityActiveDescendant != null) {
    warnOnce(
      'accessibilityActiveDescendant',
      `accessibilityActiveDescendant is deprecated. Use aria-activedescendant.`
    );
  }
  */
  const _ariaActiveDescendant =
    ariaActiveDescendant != null
      ? ariaActiveDescendant
      : accessibilityActiveDescendant;
  if (_ariaActiveDescendant != null) {
    domProps['aria-activedescendant'] = _ariaActiveDescendant;
  }

  /*
  if (accessibilityAtomic != null) {
    warnOnce(
      'accessibilityAtomic',
      `accessibilityAtomic is deprecated. Use aria-atomic.`
    );
  }
  */
  const _ariaAtomic =
    ariaAtomic != null ? ariaActiveDescendant : accessibilityAtomic;
  if (_ariaAtomic != null) {
    domProps['aria-atomic'] = _ariaAtomic;
  }

  /*
  if (accessibilityAutoComplete != null) {
    warnOnce(
      'accessibilityAutoComplete',
      `accessibilityAutoComplete is deprecated. Use aria-autocomplete.`
    );
  }
  */
  const _ariaAutoComplete =
    ariaAutoComplete != null ? ariaAutoComplete : accessibilityAutoComplete;
  if (_ariaAutoComplete != null) {
    domProps['aria-autocomplete'] = _ariaAutoComplete;
  }

  /*
  if (accessibilityBusy != null) {
    warnOnce(
      'accessibilityBusy',
      `accessibilityBusy is deprecated. Use aria-busy.`
    );
  }
  */
  const _ariaBusy = ariaBusy != null ? ariaBusy : accessibilityBusy;
  if (_ariaBusy != null) {
    domProps['aria-busy'] = _ariaBusy;
  }

  /*
  if (accessibilityChecked != null) {
    warnOnce(
      'accessibilityChecked',
      `accessibilityChecked is deprecated. Use aria-checked.`
    );
  }
  */
  const _ariaChecked = ariaChecked != null ? ariaChecked : accessibilityChecked;
  if (_ariaChecked != null) {
    domProps['aria-checked'] = _ariaChecked;
  }

  /*
  if (accessibilityColumnCount != null) {
    warnOnce(
      'accessibilityColumnCount',
      `accessibilityColumnCount is deprecated. Use aria-colcount.`
    );
  }
  */
  const _ariaColumnCount =
    ariaColumnCount != null ? ariaColumnCount : accessibilityColumnCount;
  if (_ariaColumnCount != null) {
    domProps['aria-colcount'] = _ariaColumnCount;
  }

  /*
  if (accessibilityColumnIndex != null) {
    warnOnce(
      'accessibilityColumnIndex',
      `accessibilityColumnIndex is deprecated. Use aria-colindex.`
    );
  }
  */
  const _ariaColumnIndex =
    ariaColumnIndex != null ? ariaColumnIndex : accessibilityColumnIndex;
  if (_ariaColumnIndex != null) {
    domProps['aria-colindex'] = _ariaColumnIndex;
  }

  /*
  if (accessibilityColumnSpan != null) {
    warnOnce(
      'accessibilityColumnSpan',
      `accessibilityColumnSpan is deprecated. Use aria-colspan.`
    );
  }
  */
  const _ariaColumnSpan =
    ariaColumnSpan != null ? ariaColumnSpan : accessibilityColumnSpan;
  if (_ariaColumnSpan != null) {
    domProps['aria-colspan'] = _ariaColumnSpan;
  }

  /*
  if (accessibilityControls != null) {
    warnOnce(
      'accessibilityControls',
      `accessibilityControls is deprecated. Use aria-controls.`
    );
  }
  */
  const _ariaControls =
    ariaControls != null ? ariaControls : accessibilityControls;
  if (_ariaControls != null) {
    domProps['aria-controls'] = processIDRefList(_ariaControls);
  }

  /*
  if (accessibilityCurrent != null) {
    warnOnce(
      'accessibilityCurrent',
      `accessibilityCurrent is deprecated. Use aria-current.`
    );
  }
  */
  const _ariaCurrent = ariaCurrent != null ? ariaCurrent : accessibilityCurrent;
  if (_ariaCurrent != null) {
    domProps['aria-current'] = _ariaCurrent;
  }

  /*
  if (accessibilityDescribedBy != null) {
    warnOnce(
      'accessibilityDescribedBy',
      `accessibilityDescribedBy is deprecated. Use aria-describedby.`
    );
  }
  */
  const _ariaDescribedBy =
    ariaDescribedBy != null ? ariaDescribedBy : accessibilityDescribedBy;
  if (_ariaDescribedBy != null) {
    domProps['aria-describedby'] = processIDRefList(_ariaDescribedBy);
  }

  /*
  if (accessibilityDetails != null) {
    warnOnce(
      'accessibilityDetails',
      `accessibilityDetails is deprecated. Use aria-details.`
    );
  }
  */
  const _ariaDetails = ariaDetails != null ? ariaDetails : accessibilityDetails;
  if (_ariaDetails != null) {
    domProps['aria-details'] = _ariaDetails;
  }

  if (disabled === true) {
    domProps['aria-disabled'] = true;
    // Enhance with native semantics
    if (
      elementType === 'button' ||
      elementType === 'form' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.disabled = true;
    }
  }

  /*
  if (accessibilityErrorMessage != null) {
    warnOnce(
      'accessibilityErrorMessage',
      `accessibilityErrorMessage is deprecated. Use aria-errormessage.`
    );
  }
  */
  const _ariaErrorMessage =
    ariaErrorMessage != null ? ariaErrorMessage : accessibilityErrorMessage;
  if (_ariaErrorMessage != null) {
    domProps['aria-errormessage'] = _ariaErrorMessage;
  }

  /*
  if (accessibilityExpanded != null) {
    warnOnce(
      'accessibilityExpanded',
      `accessibilityExpanded is deprecated. Use aria-expanded.`
    );
  }
  */
  const _ariaExpanded =
    ariaExpanded != null ? ariaExpanded : accessibilityExpanded;
  if (_ariaExpanded != null) {
    domProps['aria-expanded'] = _ariaExpanded;
  }

  /*
  if (accessibilityFlowTo != null) {
    warnOnce(
      'accessibilityFlowTo',
      `accessibilityFlowTo is deprecated. Use aria-flowto.`
    );
  }
  */
  const _ariaFlowTo = ariaFlowTo != null ? ariaFlowTo : accessibilityFlowTo;
  if (_ariaFlowTo != null) {
    domProps['aria-flowto'] = processIDRefList(_ariaFlowTo);
  }

  /*
  if (accessibilityHasPopup != null) {
    warnOnce(
      'accessibilityHasPopup',
      `accessibilityHasPopup is deprecated. Use aria-haspopup.`
    );
  }
  */
  const _ariaHasPopup =
    ariaHasPopup != null ? ariaHasPopup : accessibilityHasPopup;
  if (_ariaHasPopup != null) {
    domProps['aria-haspopup'] = _ariaHasPopup;
  }

  /*
  if (accessibilityHidden != null) {
    warnOnce(
      'accessibilityHidden',
      `accessibilityHidden is deprecated. Use aria-hidden.`
    );
  }
  */
  const _ariaHidden = ariaHidden != null ? ariaHidden : accessibilityHidden;
  if (_ariaHidden === true) {
    domProps['aria-hidden'] = _ariaHidden;
  }

  /*
  if (accessibilityInvalid != null) {
    warnOnce(
      'accessibilityInvalid',
      `accessibilityInvalid is deprecated. Use aria-invalid.`
    );
  }
  */
  const _ariaInvalid = ariaInvalid != null ? ariaInvalid : accessibilityInvalid;
  if (_ariaInvalid != null) {
    domProps['aria-invalid'] = _ariaInvalid;
  }

  /*
  if (accessibilityKeyShortcuts != null) {
    warnOnce(
      'accessibilityKeyShortcuts',
      `accessibilityKeyShortcuts is deprecated. Use aria-keyshortcuts.`
    );
  }
  */
  const _ariaKeyShortcuts =
    ariaKeyShortcuts != null ? ariaKeyShortcuts : accessibilityKeyShortcuts;
  if (_ariaKeyShortcuts != null) {
    domProps['aria-keyshortcuts'] = processIDRefList(_ariaKeyShortcuts);
  }

  /*
  if (accessibilityLabel != null) {
    warnOnce(
      'accessibilityLabel',
      `accessibilityLabel is deprecated. Use aria-label.`
    );
  }
  */
  const _ariaLabel = ariaLabel != null ? ariaLabel : accessibilityLabel;
  if (_ariaLabel != null) {
    domProps['aria-label'] = _ariaLabel;
  }

  /*
  if (accessibilityLabelledBy != null) {
    warnOnce(
      'accessibilityLabelledBy',
      `accessibilityLabelledBy is deprecated. Use aria-labelledby.`
    );
  }
  */
  const _ariaLabelledBy =
    ariaLabelledBy != null ? ariaLabelledBy : accessibilityLabelledBy;
  if (_ariaLabelledBy != null) {
    domProps['aria-labelledby'] = processIDRefList(_ariaLabelledBy);
  }

  /*
  if (accessibilityLevel != null) {
    warnOnce(
      'accessibilityLevel',
      `accessibilityLevel is deprecated. Use aria-level.`
    );
  }
  */
  const _ariaLevel = ariaLevel != null ? ariaLevel : accessibilityLevel;
  if (_ariaLevel != null) {
    domProps['aria-level'] = _ariaLevel;
  }

  /*
  if (accessibilityLiveRegion != null) {
    warnOnce(
      'accessibilityLiveRegion',
      `accessibilityLiveRegion is deprecated. Use aria-live.`
    );
  }
  */
  const _ariaLive = ariaLive != null ? ariaLive : accessibilityLiveRegion;
  if (_ariaLive != null) {
    domProps['aria-live'] = _ariaLive === 'none' ? 'off' : _ariaLive;
  }

  /*
  if (accessibilityModal != null) {
    warnOnce(
      'accessibilityModal',
      `accessibilityModal is deprecated. Use aria-modal.`
    );
  }
  */
  const _ariaModal = ariaModal != null ? ariaModal : accessibilityModal;
  if (_ariaModal != null) {
    domProps['aria-modal'] = _ariaModal;
  }

  /*
  if (accessibilityMultiline != null) {
    warnOnce(
      'accessibilityMultiline',
      `accessibilityMultiline is deprecated. Use aria-multiline.`
    );
  }
  */
  const _ariaMultiline =
    ariaMultiline != null ? ariaMultiline : accessibilityMultiline;
  if (_ariaMultiline != null) {
    domProps['aria-multiline'] = _ariaMultiline;
  }

  /*
  if (accessibilityMultiSelectable != null) {
    warnOnce(
      'accessibilityMultiSelectable',
      `accessibilityMultiSelectable is deprecated. Use aria-multiselectable.`
    );
  }
  */
  const _ariaMultiSelectable =
    ariaMultiSelectable != null
      ? ariaMultiSelectable
      : accessibilityMultiSelectable;
  if (_ariaMultiSelectable != null) {
    domProps['aria-multiselectable'] = _ariaMultiSelectable;
  }

  /*
  if (accessibilityOrientation != null) {
    warnOnce(
      'accessibilityOrientation',
      `accessibilityOrientation is deprecated. Use aria-orientation.`
    );
  }
  */
  const _ariaOrientation =
    ariaOrientation != null ? ariaOrientation : accessibilityOrientation;
  if (_ariaOrientation != null) {
    domProps['aria-orientation'] = _ariaOrientation;
  }

  /*
  if (accessibilityOwns != null) {
    warnOnce(
      'accessibilityOwns',
      `accessibilityOwns is deprecated. Use aria-owns.`
    );
  }
  */
  const _ariaOwns = ariaOwns != null ? ariaOwns : accessibilityOwns;
  if (_ariaOwns != null) {
    domProps['aria-owns'] = processIDRefList(_ariaOwns);
  }

  /*
  if (accessibilityPlaceholder != null) {
    warnOnce(
      'accessibilityPlaceholder',
      `accessibilityPlaceholder is deprecated. Use aria-placeholder.`
    );
  }
  */
  const _ariaPlaceholder =
    ariaPlaceholder != null ? ariaPlaceholder : accessibilityPlaceholder;
  if (_ariaPlaceholder != null) {
    domProps['aria-placeholder'] = _ariaPlaceholder;
  }

  /*
  if (accessibilityPosInSet != null) {
    warnOnce(
      'accessibilityPosInSet',
      `accessibilityPosInSet is deprecated. Use aria-posinset.`
    );
  }
  */
  const _ariaPosInSet =
    ariaPosInSet != null ? ariaPosInSet : accessibilityPosInSet;
  if (_ariaPosInSet != null) {
    domProps['aria-posinset'] = _ariaPosInSet;
  }

  /*
  if (accessibilityPressed != null) {
    warnOnce(
      'accessibilityPressed',
      `accessibilityPressed is deprecated. Use aria-pressed.`
    );
  }
  */
  const _ariaPressed = ariaPressed != null ? ariaPressed : accessibilityPressed;
  if (_ariaPressed != null) {
    domProps['aria-pressed'] = _ariaPressed;
  }

  /*
  if (accessibilityReadOnly != null) {
    warnOnce(
      'accessibilityReadOnly',
      `accessibilityReadOnly is deprecated. Use aria-readonly.`
    );
  }
  */
  const _ariaReadOnly =
    ariaReadOnly != null ? ariaReadOnly : accessibilityReadOnly;
  if (_ariaReadOnly != null) {
    domProps['aria-readonly'] = _ariaReadOnly;
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.readOnly = true;
    }
  }

  /*
  if (accessibilityRequired != null) {
    warnOnce(
      'accessibilityRequired',
      `accessibilityRequired is deprecated. Use aria-required.`
    );
  }
  */
  const _ariaRequired =
    ariaRequired != null ? ariaRequired : accessibilityRequired;
  if (_ariaRequired != null) {
    domProps['aria-required'] = _ariaRequired;
    // Enhance with native semantics
    if (
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      domProps.required = accessibilityRequired;
    }
  }

  /*
  if (accessibilityRole != null) {
    warnOnce('accessibilityRole', `accessibilityRole is deprecated. Use role.`);
  }
  */
  if (role != null) {
    // 'presentation' synonym has wider browser support
    domProps['role'] = role === 'none' ? 'presentation' : role;
  }

  /*
  if (accessibilityRoleDescription != null) {
    warnOnce(
      'accessibilityRoleDescription',
      `accessibilityRoleDescription is deprecated. Use aria-roledescription.`
    );
  }
  */
  const _ariaRoleDescription =
    ariaRoleDescription != null
      ? ariaRoleDescription
      : accessibilityRoleDescription;
  if (_ariaRoleDescription != null) {
    domProps['aria-roledescription'] = _ariaRoleDescription;
  }

  /*
  if (accessibilityRowCount != null) {
    warnOnce(
      'accessibilityRowCount',
      `accessibilityRowCount is deprecated. Use aria-rowcount.`
    );
  }
  */
  const _ariaRowCount =
    ariaRowCount != null ? ariaRowCount : accessibilityRowCount;
  if (_ariaRowCount != null) {
    domProps['aria-rowcount'] = _ariaRowCount;
  }

  /*
  if (accessibilityRowIndex != null) {
    warnOnce(
      'accessibilityRowIndex',
      `accessibilityRowIndex is deprecated. Use aria-rowindex.`
    );
  }
  */
  const _ariaRowIndex =
    ariaRowIndex != null ? ariaRowIndex : accessibilityRowIndex;
  if (_ariaRowIndex != null) {
    domProps['aria-rowindex'] = _ariaRowIndex;
  }

  /*
  if (accessibilityRowSpan != null) {
    warnOnce(
      'accessibilityRowSpan',
      `accessibilityRowSpan is deprecated. Use aria-rowspan.`
    );
  }
  */
  const _ariaRowSpan = ariaRowSpan != null ? ariaRowSpan : accessibilityRowSpan;
  if (_ariaRowSpan != null) {
    domProps['aria-rowspan'] = _ariaRowSpan;
  }

  /*
  if (accessibilitySelected != null) {
    warnOnce(
      'accessibilitySelected',
      `accessibilitySelected is deprecated. Use aria-selected.`
    );
  }
  */
  const _ariaSelected =
    ariaSelected != null ? ariaSelected : accessibilitySelected;
  if (_ariaSelected != null) {
    domProps['aria-selected'] = _ariaSelected;
  }

  /*
  if (accessibilitySetSize != null) {
    warnOnce(
      'accessibilitySetSize',
      `accessibilitySetSize is deprecated. Use aria-setsize.`
    );
  }
  */
  const _ariaSetSize = ariaSetSize != null ? ariaSetSize : accessibilitySetSize;
  if (_ariaSetSize != null) {
    domProps['aria-setsize'] = _ariaSetSize;
  }

  /*
  if (accessibilitySort != null) {
    warnOnce(
      'accessibilitySort',
      `accessibilitySort is deprecated. Use aria-sort.`
    );
  }
  */
  const _ariaSort = ariaSort != null ? ariaSort : accessibilitySort;
  if (_ariaSort != null) {
    domProps['aria-sort'] = _ariaSort;
  }

  /*
  if (accessibilityValueMax != null) {
    warnOnce(
      'accessibilityValueMax',
      `accessibilityValueMax is deprecated. Use aria-valuemax.`
    );
  }
  */
  const _ariaValueMax =
    ariaValueMax != null ? ariaValueMax : accessibilityValueMax;
  if (_ariaValueMax != null) {
    domProps['aria-valuemax'] = _ariaValueMax;
  }

  /*
  if (accessibilityValueMin != null) {
    warnOnce(
      'accessibilityValueMin',
      `accessibilityValueMin is deprecated. Use aria-valuemin.`
    );
  }
  */
  const _ariaValueMin =
    ariaValueMin != null ? ariaValueMin : accessibilityValueMin;
  if (_ariaValueMin != null) {
    domProps['aria-valuemin'] = _ariaValueMin;
  }

  /*
  if (accessibilityValueNow != null) {
    warnOnce(
      'accessibilityValueNow',
      `accessibilityValueNow is deprecated. Use aria-valuenow.`
    );
  }
  */
  const _ariaValueNow =
    ariaValueNow != null ? ariaValueNow : accessibilityValueNow;
  if (_ariaValueNow != null) {
    domProps['aria-valuenow'] = _ariaValueNow;
  }

  /*
  if (accessibilityValueText != null) {
    warnOnce(
      'accessibilityValueText',
      `accessibilityValueText is deprecated. Use aria-valuetext.`
    );
  }
  */
  const _ariaValueText =
    ariaValueText != null ? ariaValueText : accessibilityValueText;
  if (_ariaValueText != null) {
    domProps['aria-valuetext'] = _ariaValueText;
  }

  // "dataSet" replaced with "data-*"
  if (dataSet != null) {
    for (const dataProp in dataSet) {
      if (hasOwnProperty.call(dataSet, dataProp)) {
        const dataName = hyphenateString(dataProp);
        const dataValue = dataSet[dataProp];
        if (dataValue != null) {
          domProps[`data-${dataName}`] = dataValue;
        }
      }
    }
  }

  // FOCUS
  if (
    tabIndex === 0 ||
    tabIndex === '0' ||
    tabIndex === -1 ||
    tabIndex === '-1'
  ) {
    domProps.tabIndex = tabIndex;
  } else {
    /*
    if (focusable != null) {
      warnOnce('focusable', `focusable is deprecated.`);
    }
    */

    // "focusable" indicates that an element may be a keyboard tab-stop.
    if (focusable === false) {
      domProps.tabIndex = '-1';
    }
    if (
      // These native elements are keyboard focusable by default
      elementType === 'a' ||
      elementType === 'button' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      if (focusable === false || accessibilityDisabled === true) {
        domProps.tabIndex = '-1';
      }
    } else if (
      // These roles are made keyboard focusable by default
      role === 'button' ||
      role === 'checkbox' ||
      role === 'link' ||
      role === 'radio' ||
      role === 'textbox' ||
      role === 'switch'
    ) {
      if (focusable !== false) {
        domProps.tabIndex = '0';
      }
    } else {
      // Everything else must explicitly set the prop
      if (focusable === true) {
        domProps.tabIndex = '0';
      }
    }
  }

  // Resolve styles
  if (pointerEvents != null) {
    warnOnce(
      'pointerEvents',
      `props.pointerEvents is deprecated. Use style.pointerEvents`
    );
  }

  const [className, inlineStyle] = StyleSheet(
    [style, pointerEvents && pointerEventsStyles[pointerEvents]],
    {
      writingDirection: 'ltr',
      ...options
    }
  );
  if (className) {
    domProps.className = className;
  }
  if (inlineStyle) {
    domProps.style = inlineStyle;
  }

  // OTHER
  // Native element ID
  /*
  if (nativeID != null) {
    warnOnce('nativeID', `nativeID is deprecated. Use id.`);
  }
  */
  const _id = id != null ? id : nativeID;
  if (_id != null) {
    domProps.id = _id;
  }
  // Automated test IDs
  if (testID != null) {
    domProps['data-testid'] = testID;
  }

  if (domProps.type == null && elementType === 'button') {
    domProps.type = 'button';
  }
  return domProps;
};

export default createDOMProps;
