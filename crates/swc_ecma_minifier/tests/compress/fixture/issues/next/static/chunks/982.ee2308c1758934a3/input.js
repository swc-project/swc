(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[982],{

/***/ 1225:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "X": function() { return /* binding */ Checkbox; }
});

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/system.js + 4 modules
var system = __webpack_require__(5631);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/forward-ref.js
var forward_ref = __webpack_require__(8582);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/use-style-config.js
var use_style_config = __webpack_require__(5692);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/system.utils.js
var system_utils = __webpack_require__(3267);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/function.js
var esm_function = __webpack_require__(4006);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/dom.js
var dom = __webpack_require__(2353);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/assertion.js
var assertion = __webpack_require__(5621);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+react-utils@1.1.2_react@17.0.2/node_modules/@chakra-ui/react-utils/dist/esm/context.js
var context = __webpack_require__(7969);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-callback-ref.js
var use_callback_ref = __webpack_require__(9433);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-controllable.js
var use_controllable = __webpack_require__(5875);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/array.js
var array = __webpack_require__(3524);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/use-checkbox-group.js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





/**
 * React hook that provides all the state management logic
 * for a group of checkboxes.
 *
 * It is consumed by the `CheckboxGroup` component
 */
function useCheckboxGroup(props) {
  if (props === void 0) {
    props = {};
  }

  var {
    defaultValue,
    value: valueProp,
    onChange,
    isDisabled,
    isNative
  } = props;
  var onChangeProp = (0,use_callback_ref/* useCallbackRef */.W)(onChange);
  var [value, setValue] = (0,use_controllable/* useControllableState */.T)({
    value: valueProp,
    defaultValue: defaultValue || [],
    onChange: onChangeProp
  });
  var handleChange = (0,react.useCallback)(eventOrValue => {
    if (!value) return;
    var isChecked = (0,assertion/* isInputEvent */.kA)(eventOrValue) ? eventOrValue.target.checked : !value.includes(eventOrValue);
    var selectedValue = (0,assertion/* isInputEvent */.kA)(eventOrValue) ? eventOrValue.target.value : eventOrValue;
    var nextValue = isChecked ? (0,array/* addItem */.jX)(value, selectedValue) : (0,array/* removeItem */.cl)(value, selectedValue);
    setValue(nextValue);
  }, [setValue, value]);
  var getCheckboxProps = (0,react.useCallback)(function (props) {
    if (props === void 0) {
      props = {};
    }

    var checkedKey = isNative ? "checked" : "isChecked";
    return _extends({}, props, {
      [checkedKey]: value.includes(props.value),
      onChange: handleChange
    });
  }, [handleChange, isNative, value]);
  return {
    value,
    isDisabled,
    onChange: handleChange,
    setValue,
    getCheckboxProps
  };
}
//# sourceMappingURL=use-checkbox-group.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/checkbox-group.js




var [CheckboxGroupProvider, useCheckboxGroupContext] = (0,context/* createContext */.k)({
  name: "CheckboxGroupContext",
  strict: false
});

/**
 * Used for multiple checkboxes which are bound in one group,
 * and it indicates whether one or more options are selected.
 *
 * @see Docs https://chakra-ui.com/checkbox
 */

var CheckboxGroup = props => {
  var {
    colorScheme,
    size,
    variant,
    children,
    isDisabled
  } = props;
  var {
    value,
    onChange
  } = useCheckboxGroup(props);
  var group = react.useMemo(() => ({
    size,
    onChange,
    colorScheme,
    value,
    variant,
    isDisabled
  }), [size, onChange, colorScheme, value, variant, isDisabled]);
  return /*#__PURE__*/react.createElement(CheckboxGroupProvider, {
    value: group
  }, children);
};

if (assertion/* __DEV__ */.Ts) {
  CheckboxGroup.displayName = "CheckboxGroup";
}
//# sourceMappingURL=checkbox-group.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@4.1.17_react-dom@17.0.2+react@17.0.2/node_modules/framer-motion/dist/es/render/dom/motion.js + 150 modules
var motion = __webpack_require__(4716);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@4.1.17_react-dom@17.0.2+react@17.0.2/node_modules/framer-motion/dist/es/components/AnimatePresence/index.js + 2 modules
var AnimatePresence = __webpack_require__(1807);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/checkbox-icon.js
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function checkbox_icon_extends() { checkbox_icon_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return checkbox_icon_extends.apply(this, arguments); }



 // @future: only call `motion(chakra.svg)` when we drop framer-motion v3 support

var MotionSvg = "custom" in motion/* motion */.E ? motion/* motion.custom */.E.custom(system/* chakra.svg */.m$.svg) : (0,motion/* motion */.E)(system/* chakra.svg */.m$.svg);

var CheckIcon = props => /*#__PURE__*/react.createElement(MotionSvg, checkbox_icon_extends({
  width: "1.2em",
  viewBox: "0 0 12 10",
  variants: {
    unchecked: {
      opacity: 0,
      strokeDashoffset: 16
    },
    checked: {
      opacity: 1,
      strokeDashoffset: 0,
      transition: {
        duration: 0.2
      }
    }
  },
  style: {
    fill: "none",
    strokeWidth: 2,
    stroke: "currentColor",
    strokeDasharray: 16
  }
}, props), /*#__PURE__*/react.createElement("polyline", {
  points: "1.5 6 4.5 9 10.5 1"
}));

var IndeterminateIcon = props => /*#__PURE__*/react.createElement(MotionSvg, checkbox_icon_extends({
  width: "1.2em",
  viewBox: "0 0 24 24",
  variants: {
    unchecked: {
      scaleX: 0.65,
      opacity: 0
    },
    checked: {
      scaleX: 1,
      opacity: 1,
      transition: {
        scaleX: {
          duration: 0
        },
        opacity: {
          duration: 0.02
        }
      }
    }
  },
  style: {
    stroke: "currentColor",
    strokeWidth: 4
  }
}, props), /*#__PURE__*/react.createElement("line", {
  x1: "21",
  x2: "3",
  y1: "12",
  y2: "12"
}));

var CheckboxTransition = (_ref) => {
  var {
    open,
    children
  } = _ref;
  return /*#__PURE__*/react.createElement(AnimatePresence/* AnimatePresence */.M, {
    initial: false
  }, open && /*#__PURE__*/react.createElement(motion/* motion.div */.E.div, {
    variants: {
      unchecked: {
        scale: 0.5
      },
      checked: {
        scale: 1
      }
    },
    initial: "unchecked",
    animate: "checked",
    exit: "unchecked",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    }
  }, children));
};

/**
 * CheckboxIcon is used to visually indicate the checked or indeterminate
 * state of a checkbox.
 *
 * @todo allow users pass their own icon svgs
 */
var CheckboxIcon = props => {
  var {
    isIndeterminate,
    isChecked
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["isIndeterminate", "isChecked"]);

  var IconEl = isIndeterminate ? IndeterminateIcon : CheckIcon;
  return /*#__PURE__*/react.createElement(CheckboxTransition, {
    open: isChecked || isIndeterminate
  }, /*#__PURE__*/react.createElement(IconEl, rest));
};
//# sourceMappingURL=checkbox-icon.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/use-checkbox.js
var use_checkbox = __webpack_require__(7319);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/checkbox.js
function checkbox_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function checkbox_extends() { checkbox_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return checkbox_extends.apply(this, arguments); }







var CheckboxControl = (0,system/* chakra */.m$)("span", {
  baseStyle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "top",
    userSelect: "none",
    flexShrink: 0
  }
});
var Label = (0,system/* chakra */.m$)("label", {
  baseStyle: {
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "top",
    position: "relative",
    _disabled: {
      cursor: "not-allowed"
    }
  }
});

/**
 * Checkbox
 *
 * React component used in forms when a user needs to select
 * multiple values from several options.
 *
 * @see Docs https://chakra-ui.com/checkbox
 */
var Checkbox = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var group = useCheckboxGroupContext();

  var mergedProps = checkbox_extends({}, group, props);

  var styles = (0,use_style_config/* useMultiStyleConfig */.j)("Checkbox", mergedProps);
  var ownProps = (0,system_utils/* omitThemingProps */.Lr)(props);

  var {
    spacing = "0.5rem",
    className,
    children,
    iconColor,
    iconSize,
    icon = /*#__PURE__*/react.createElement(CheckboxIcon, null),
    isChecked: isCheckedProp,
    isDisabled = group == null ? void 0 : group.isDisabled,
    onChange: onChangeProp
  } = ownProps,
      rest = checkbox_objectWithoutPropertiesLoose(ownProps, ["spacing", "className", "children", "iconColor", "iconSize", "icon", "isChecked", "isDisabled", "onChange"]);

  var isChecked = isCheckedProp;

  if (group != null && group.value && ownProps.value) {
    isChecked = group.value.includes(ownProps.value);
  }

  var onChange = onChangeProp;

  if (group != null && group.onChange && ownProps.value) {
    onChange = (0,esm_function/* callAll */.PP)(group.onChange, onChangeProp);
  }

  var {
    state,
    getInputProps,
    getCheckboxProps,
    getLabelProps,
    getRootProps
  } = (0,use_checkbox/* useCheckbox */.O)(checkbox_extends({}, rest, {
    isDisabled,
    isChecked,
    onChange
  }));
  var iconStyles = react.useMemo(() => checkbox_extends({
    opacity: state.isChecked || state.isIndeterminate ? 1 : 0,
    transform: state.isChecked || state.isIndeterminate ? "scale(1)" : "scale(0.95)",
    fontSize: iconSize,
    color: iconColor
  }, styles.icon), [iconColor, iconSize, state.isChecked, state.isIndeterminate, styles.icon]);
  var clonedIcon = /*#__PURE__*/react.cloneElement(icon, {
    __css: iconStyles,
    isIndeterminate: state.isIndeterminate,
    isChecked: state.isChecked
  });
  return /*#__PURE__*/react.createElement(Label, checkbox_extends({
    __css: styles.container,
    className: (0,dom.cx)("chakra-checkbox", className)
  }, getRootProps()), /*#__PURE__*/react.createElement("input", checkbox_extends({
    className: "chakra-checkbox__input"
  }, getInputProps({}, ref))), /*#__PURE__*/react.createElement(CheckboxControl, checkbox_extends({
    __css: styles.control,
    className: "chakra-checkbox__control"
  }, getCheckboxProps()), clonedIcon), children && /*#__PURE__*/react.createElement(system/* chakra.span */.m$.span, checkbox_extends({
    className: "chakra-checkbox__label"
  }, getLabelProps(), {
    __css: checkbox_extends({
      marginStart: spacing
    }, styles.label)
  }), children));
});

if (assertion/* __DEV__ */.Ts) {
  Checkbox.displayName = "Checkbox";
}
//# sourceMappingURL=checkbox.js.map

/***/ }),

/***/ 7319:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": function() { return /* binding */ useCheckbox; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9433);
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8047);
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5875);
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3934);
/* harmony import */ var _chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5559);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4006);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1236);
/* harmony import */ var _chakra_ui_visually_hidden__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6781);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }







/**
 * useCheckbox that provides all the state and focus management logic
 * for a checkbox. It is consumed by the `Checkbox` component
 *
 * @see Docs https://chakra-ui.com/checkbox#hooks
 */
function useCheckbox(props) {
  if (props === void 0) {
    props = {};
  }

  var {
    defaultIsChecked,
    defaultChecked = defaultIsChecked,
    isChecked: checkedProp,
    isFocusable,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange,
    isIndeterminate,
    isInvalid,
    name,
    value,
    id,
    onBlur,
    onFocus,
    tabIndex = undefined,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy
  } = props,
      htmlProps = _objectWithoutPropertiesLoose(props, ["defaultIsChecked", "defaultChecked", "isChecked", "isFocusable", "isDisabled", "isReadOnly", "isRequired", "onChange", "isIndeterminate", "isInvalid", "name", "value", "id", "onBlur", "onFocus", "tabIndex", "aria-label", "aria-labelledby", "aria-invalid", "aria-describedby"]);

  var onChangeProp = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useCallbackRef */ .W)(onChange);
  var onBlurProp = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useCallbackRef */ .W)(onBlur);
  var onFocusProp = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useCallbackRef */ .W)(onFocus);
  var [isFocused, setFocused] = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useBoolean */ .k)();
  var [isHovered, setHovered] = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useBoolean */ .k)();
  var [isActive, setActive] = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useBoolean */ .k)();
  var inputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var [rootIsLabelElement, setRootIsLabelElement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  var [checkedState, setCheckedState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!!defaultChecked);
  var [isControlled, isChecked] = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useControllableProp */ .p)(checkedProp, checkedState);
  (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .warn */ .ZK)({
    condition: !!defaultIsChecked,
    message: 'The "defaultIsChecked" prop has been deprecated and will be removed in a future version. ' + 'Please use the "defaultChecked" prop instead, which mirrors default React checkbox behavior.'
  });
  var handleChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (isReadOnly || isDisabled) {
      event.preventDefault();
      return;
    }

    if (!isControlled) {
      if (isChecked) {
        setCheckedState(event.target.checked);
      } else {
        setCheckedState(isIndeterminate ? true : event.target.checked);
      }
    }

    onChangeProp == null ? void 0 : onChangeProp(event);
  }, [isReadOnly, isDisabled, isChecked, isControlled, isIndeterminate, onChangeProp]);
  (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_5__/* .useSafeLayoutEffect */ .G)(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate]);
  var trulyDisabled = isDisabled && !isFocusable;
  var onKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (event.key === " ") {
      setActive.on();
    }
  }, [setActive]);
  var onKeyUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (event.key === " ") {
      setActive.off();
    }
  }, [setActive]);
  /**
   * Sync state with uncontrolled form libraries like `react-hook-form`.
   *
   * These libraries set the checked value for input fields
   * using their refs. For the checkbox, it sets `ref.current.checked = true | false` directly.
   *
   * This means the `isChecked` state will get out of sync with `ref.current.checked`,
   * even though the input validation with work, the UI will not be up to date.
   *
   * Let's correct that by checking and syncing the state accordingly.
   */

  (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_5__/* .useSafeLayoutEffect */ .G)(() => {
    if (!inputRef.current) return;
    var notInSync = inputRef.current.checked !== isChecked;

    if (notInSync) {
      setCheckedState(inputRef.current.checked);
    }
  }, [inputRef.current]);
  var getCheckboxProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    var onPressDown = event => {
      // On mousedown, the input blurs and returns focus to the `body`,
      // we need to prevent this. Native checkboxes keeps focus on `input`
      event.preventDefault();
      setActive.on();
    };

    return _extends({}, props, {
      ref: forwardedRef,
      "data-active": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isActive),
      "data-hover": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isHovered),
      "data-checked": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isChecked),
      "data-focus": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isFocused),
      "data-indeterminate": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isIndeterminate),
      "data-disabled": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isDisabled),
      "data-invalid": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isInvalid),
      "data-readonly": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isReadOnly),
      "aria-hidden": true,
      onMouseDown: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onMouseDown, onPressDown),
      onMouseUp: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onMouseUp, setActive.off),
      onMouseEnter: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onMouseEnter, setHovered.on),
      onMouseLeave: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onMouseLeave, setHovered.off)
    });
  }, [isActive, isChecked, isDisabled, isFocused, isHovered, isIndeterminate, isInvalid, isReadOnly, setActive, setHovered.off, setHovered.on]);
  var getRootProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, htmlProps, props, {
      ref: (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_7__/* .mergeRefs */ .l)(forwardedRef, node => {
        if (!node) return;
        setRootIsLabelElement(node.tagName === "LABEL");
      }),
      onClick: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onClick, () => {
        /**
         * Accessibility:
         *
         * Ideally, `getRootProps` should be spread unto a `label` element.
         *
         * If the element was changed using the `as` prop or changing
         * the dom node `getRootProps` is spread unto (to a `div` or `span`), we'll trigger
         * click on the input when the element is clicked.
         * @see Issue https://github.com/chakra-ui/chakra-ui/issues/3480
         */
        if (!rootIsLabelElement) {
          var _inputRef$current;

          (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.click();
          (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_8__/* .focus */ .T)(inputRef.current, {
            nextTick: true
          });
        }
      }),
      "data-disabled": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isDisabled),
      "data-checked": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isChecked),
      "data-invalid": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isInvalid)
    });
  }, [htmlProps, isDisabled, isChecked, isInvalid, rootIsLabelElement]);
  var getInputProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, {
      ref: (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_7__/* .mergeRefs */ .l)(inputRef, forwardedRef),
      type: "checkbox",
      name,
      value,
      id,
      tabIndex,
      onChange: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onChange, handleChange),
      onBlur: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onBlur, onBlurProp, setFocused.off),
      onFocus: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onFocus, onFocusProp, setFocused.on),
      onKeyDown: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onKeyDown, onKeyDown),
      onKeyUp: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onKeyUp, onKeyUp),
      required: isRequired,
      checked: isChecked,
      disabled: trulyDisabled,
      readOnly: isReadOnly,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": isDisabled,
      style: _chakra_ui_visually_hidden__WEBPACK_IMPORTED_MODULE_9__/* .visuallyHiddenStyle */ .NL
    });
  }, [name, value, id, handleChange, setFocused.off, setFocused.on, onBlurProp, onFocusProp, onKeyDown, onKeyUp, isRequired, isChecked, trulyDisabled, isReadOnly, ariaLabel, ariaLabelledBy, ariaInvalid, isInvalid, ariaDescribedBy, isDisabled, tabIndex]);
  var getLabelProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, {
      ref: forwardedRef,
      onMouseDown: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onMouseDown, stopEvent),
      onTouchStart: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .callAllHandlers */ .v0)(props.onTouchStart, stopEvent),
      "data-disabled": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isDisabled),
      "data-checked": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isChecked),
      "data-invalid": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(isInvalid)
    });
  }, [isChecked, isDisabled, isInvalid]);
  return {
    state: {
      isInvalid,
      isFocused,
      isChecked,
      isActive,
      isHovered,
      isIndeterminate,
      isDisabled,
      isReadOnly,
      isRequired
    },
    getRootProps,
    getCheckboxProps,
    getInputProps,
    getLabelProps,
    htmlProps
  };
}
/**
 * Prevent `onBlur` being fired when the checkbox label is touched
 */

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
//# sourceMappingURL=use-checkbox.js.map

/***/ }),

/***/ 2262:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NJ": function() { return /* binding */ useFormControlContext; },
/* harmony export */   "NI": function() { return /* binding */ FormControl; }
/* harmony export */ });
/* unused harmony export FormHelperText */
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9146);
/* harmony import */ var _chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8047);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3010);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5621);
/* harmony import */ var _chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7969);
/* harmony import */ var _chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5559);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }






var [FormControlProvider, useFormControlContext] = (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_1__/* .createContext */ .k)({
  strict: false,
  name: "FormControlContext"
});


function useFormControlProvider(props) {
  var {
    id: idProp,
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly
  } = props,
      htmlProps = _objectWithoutPropertiesLoose(props, ["id", "isRequired", "isInvalid", "isDisabled", "isReadOnly"]); // Generate all the required ids


  var uuid = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useId */ .Me)();
  var id = idProp || "field-" + uuid;
  var labelId = id + "-label";
  var feedbackId = id + "-feedback";
  var helpTextId = id + "-helptext";
  /**
   * Track whether the `FormErrorMessage` has been rendered.
   * We use this to append its id the the `aria-describedby` of the `input`.
   */

  var [hasFeedbackText, setHasFeedbackText] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  /**
   * Track whether the `FormHelperText` has been rendered.
   * We use this to append its id the the `aria-describedby` of the `input`.
   */

  var [hasHelpText, setHasHelpText] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false); // Track whether the form element (e.g, `input`) has focus.

  var [isFocused, setFocus] = (0,_chakra_ui_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useBoolean */ .k)();
  var getHelpTextProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({
      id: helpTextId
    }, props, {
      /**
       * Notify the field context when the help text is rendered on screen,
       * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
       */
      ref: (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_4__/* .mergeRefs */ .l)(forwardedRef, node => {
        if (!node) return;
        setHasHelpText(true);
      })
    });
  }, [helpTextId]);
  var getLabelProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (props, forwardedRef) {
    var _props$id, _props$htmlFor;

    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, {
      ref: forwardedRef,
      "data-focus": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__/* .dataAttr */ .PB)(isFocused),
      "data-disabled": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__/* .dataAttr */ .PB)(isDisabled),
      "data-invalid": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__/* .dataAttr */ .PB)(isInvalid),
      "data-readonly": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__/* .dataAttr */ .PB)(isReadOnly),
      id: (_props$id = props.id) != null ? _props$id : labelId,
      htmlFor: (_props$htmlFor = props.htmlFor) != null ? _props$htmlFor : id
    });
  }, [id, isDisabled, isFocused, isInvalid, isReadOnly, labelId]);
  var getErrorMessageProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({
      id: feedbackId
    }, props, {
      /**
       * Notify the field context when the error message is rendered on screen,
       * so we can apply the correct `aria-describedby` to the field (e.g. input, textarea).
       */
      ref: (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_4__/* .mergeRefs */ .l)(forwardedRef, node => {
        if (!node) return;
        setHasFeedbackText(true);
      }),
      "aria-live": "polite"
    });
  }, [feedbackId]);
  var getRootProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, htmlProps, {
      ref: forwardedRef,
      role: "group"
    });
  }, [htmlProps]);
  var getRequiredIndicatorProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, {
      ref: forwardedRef,
      role: "presentation",
      "aria-hidden": true,
      children: props.children || "*"
    });
  }, []);
  return {
    isRequired: !!isRequired,
    isInvalid: !!isInvalid,
    isReadOnly: !!isReadOnly,
    isDisabled: !!isDisabled,
    isFocused: !!isFocused,
    onFocus: setFocus.on,
    onBlur: setFocus.off,
    hasFeedbackText,
    setHasFeedbackText,
    hasHelpText,
    setHasHelpText,
    id,
    labelId,
    feedbackId,
    helpTextId,
    htmlProps,
    getHelpTextProps,
    getErrorMessageProps,
    getRootProps,
    getLabelProps,
    getRequiredIndicatorProps
  };
}

/**
 * FormControl provides context such as
 * `isInvalid`, `isDisabled`, and `isRequired` to form elements.
 *
 * This is commonly used in form elements such as `input`,
 * `select`, `textarea`, etc.
 */
var FormControl = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_7__/* .useMultiStyleConfig */ .j)("Form", props);
  var ownProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__/* .omitThemingProps */ .Lr)(props);

  var _useFormControlProvid = useFormControlProvider(ownProps),
      {
    getRootProps
  } = _useFormControlProvid,
      context = _objectWithoutPropertiesLoose(_useFormControlProvid, ["getRootProps", "htmlProps"]);

  var className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__.cx)("chakra-form-control", props.className);
  var contextValue = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => context, [context]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FormControlProvider, {
    value: contextValue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_9__/* .StylesProvider */ .Fo, {
    value: styles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_10__/* .chakra.div */ .m$.div, _extends({}, getRootProps({}, ref), {
    className: className,
    __css: styles["container"]
  }))));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_11__/* .__DEV__ */ .Ts) {
  FormControl.displayName = "FormControl";
}

/**
 * FormHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 */
var FormHelperText = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__/* .forwardRef */ .G)((props, ref) => {
  var field = useFormControlContext();
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_9__/* .useStyles */ .yK)();
  var className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__.cx)("chakra-form__helper-text", props.className);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_10__/* .chakra.div */ .m$.div, _extends({}, field == null ? void 0 : field.getHelpTextProps(props, ref), {
    __css: styles.helperText,
    className: className
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_11__/* .__DEV__ */ .Ts) {
  FormHelperText.displayName = "FormHelperText";
}
//# sourceMappingURL=form-control.js.map

/***/ }),

/***/ 3371:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": function() { return /* binding */ FormLabel; }
/* harmony export */ });
/* unused harmony export RequiredIndicator */
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3010);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
/* harmony import */ var _form_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2262);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }






/**
 * Used to enhance the usability of form controls.
 *
 * It is used to inform users as to what information
 * is requested for a form field.
 *
 * ♿️ Accessibility: Every form field should have a form label.
 */
var FormLabel = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((passedProps, ref) => {
  var _field$getLabelProps;

  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useStyleConfig */ .m)("FormLabel", passedProps);
  var props = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(passedProps);

  var {
    children,
    requiredIndicator = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RequiredIndicator, null)
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["className", "children", "requiredIndicator"]);

  var field = (0,_form_control__WEBPACK_IMPORTED_MODULE_4__/* .useFormControlContext */ .NJ)();
  var ownProps = (_field$getLabelProps = field == null ? void 0 : field.getLabelProps(rest, ref)) != null ? _field$getLabelProps : _extends({
    ref
  }, rest);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.label */ .m$.label, _extends({}, ownProps, {
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__.cx)("chakra-form__label", props.className),
    __css: _extends({
      display: "block",
      textAlign: "start"
    }, styles)
  }), children, field != null && field.isRequired ? requiredIndicator : null);
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .__DEV__ */ .Ts) {
  FormLabel.displayName = "FormLabel";
}

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
var RequiredIndicator = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var field = (0,_form_control__WEBPACK_IMPORTED_MODULE_4__/* .useFormControlContext */ .NJ)();
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__/* .useStyles */ .yK)();
  if (!(field != null && field.isRequired)) return null;
  var className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__.cx)("chakra-form__required-indicator", props.className);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.span */ .m$.span, _extends({}, field == null ? void 0 : field.getRequiredIndicatorProps(props, ref), {
    __css: styles.requiredIndicator,
    className: className
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .__DEV__ */ .Ts) {
  RequiredIndicator.displayName = "RequiredIndicator";
}
//# sourceMappingURL=form-label.js.map

/***/ }),

/***/ 4761:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Y": function() { return /* binding */ useFormControl; }
/* harmony export */ });
/* unused harmony export useFormControlProps */
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4006);
/* harmony import */ var _form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2262);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and helper text.
 *
 * @internal
 */
function useFormControl(props) {
  var _useFormControlProps = useFormControlProps(props),
      {
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired
  } = _useFormControlProps,
      rest = _objectWithoutPropertiesLoose(_useFormControlProps, ["isDisabled", "isInvalid", "isReadOnly", "isRequired"]);

  return _extends({}, rest, {
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    "aria-invalid": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__/* .ariaAttr */ .Qm)(isInvalid),
    "aria-required": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__/* .ariaAttr */ .Qm)(isRequired),
    "aria-readonly": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__/* .ariaAttr */ .Qm)(isReadOnly)
  });
}
/**
 * @internal
 */

function useFormControlProps(props) {
  var _ref, _ref2, _ref3;

  var field = (0,_form_control__WEBPACK_IMPORTED_MODULE_1__/* .useFormControlContext */ .NJ)();

  var {
    id,
    disabled,
    readOnly,
    required,
    isRequired,
    isInvalid,
    isReadOnly,
    isDisabled,
    onFocus,
    onBlur
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["id", "disabled", "readOnly", "required", "isRequired", "isInvalid", "isReadOnly", "isDisabled", "onFocus", "onBlur"]);

  var labelIds = props["aria-describedby"] ? [props["aria-describedby"]] : []; // Error message must be described first in all scenarios.

  if (field != null && field.hasFeedbackText && field != null && field.isInvalid) {
    labelIds.push(field.feedbackId);
  }

  if (field != null && field.hasHelpText) {
    labelIds.push(field.helpTextId);
  }

  return _extends({}, rest, {
    "aria-describedby": labelIds.join(" ") || undefined,
    id: id != null ? id : field == null ? void 0 : field.id,
    isDisabled: (_ref = disabled != null ? disabled : isDisabled) != null ? _ref : field == null ? void 0 : field.isDisabled,
    isReadOnly: (_ref2 = readOnly != null ? readOnly : isReadOnly) != null ? _ref2 : field == null ? void 0 : field.isReadOnly,
    isRequired: (_ref3 = required != null ? required : isRequired) != null ? _ref3 : field == null ? void 0 : field.isRequired,
    isInvalid: isInvalid != null ? isInvalid : field == null ? void 0 : field.isInvalid,
    onFocus: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .callAllHandlers */ .v0)(field == null ? void 0 : field.onFocus, onFocus),
    onBlur: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .callAllHandlers */ .v0)(field == null ? void 0 : field.onBlur, onBlur)
  });
}
//# sourceMappingURL=use-form-control.js.map

/***/ }),

/***/ 8047:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": function() { return /* binding */ useBoolean; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);


/**
 * React hook to manage boolean (on - off) states
 *
 * @param initialState the initial boolean state value
 */
function useBoolean(initialState) {
  if (initialState === void 0) {
    initialState = false;
  }

  var [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialState);
  var on = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setValue(true);
  }, []);
  var off = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setValue(false);
  }, []);
  var toggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setValue(prev => !prev);
  }, []);
  return [value, {
    on,
    off,
    toggle
  }];
}
//# sourceMappingURL=use-boolean.js.map

/***/ }),

/***/ 5875:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": function() { return /* binding */ useControllableProp; },
/* harmony export */   "T": function() { return /* binding */ useControllableState; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4006);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
/* harmony import */ var _use_callback_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9433);



function useControllableProp(prop, state) {
  var isControlled = prop !== undefined;
  var value = isControlled && typeof prop !== "undefined" ? prop : state;
  return [isControlled, value];
}

/**
 * React hook for using controlling component state.
 * @param props
 */
function useControllableState(props) {
  var {
    value: valueProp,
    defaultValue,
    onChange,
    shouldUpdate = (prev, next) => prev !== next
  } = props;
  var onChangeProp = (0,_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__/* .useCallbackRef */ .W)(onChange);
  var shouldUpdateProp = (0,_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__/* .useCallbackRef */ .W)(shouldUpdate);
  var [valueState, setValue] = react__WEBPACK_IMPORTED_MODULE_0__.useState(defaultValue);
  var isControlled = valueProp !== undefined;
  var value = isControlled ? valueProp : valueState;
  var updateValue = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(next => {
    var nextValue = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .runIfFn */ .Pu)(next, value);

    if (!shouldUpdateProp(value, nextValue)) {
      return;
    }

    if (!isControlled) {
      setValue(nextValue);
    }

    onChangeProp(nextValue);
  }, [isControlled, onChangeProp, value, shouldUpdateProp]);
  return [value, updateValue];
}
//# sourceMappingURL=use-controllable.js.map

/***/ }),

/***/ 847:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": function() { return /* binding */ useDisclosure; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4006);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
/* harmony import */ var _use_controllable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5875);
/* harmony import */ var _use_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9146);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





function useDisclosure(props) {
  if (props === void 0) {
    props = {};
  }

  var {
    onClose: onCloseProp,
    onOpen: onOpenProp,
    isOpen: isOpenProp,
    id: idProp
  } = props;
  var [isOpenState, setIsOpen] = react__WEBPACK_IMPORTED_MODULE_0__.useState(props.defaultIsOpen || false);
  var [isControlled, isOpen] = (0,_use_controllable__WEBPACK_IMPORTED_MODULE_1__/* .useControllableProp */ .p)(isOpenProp, isOpenState);
  var id = (0,_use_id__WEBPACK_IMPORTED_MODULE_2__/* .useId */ .Me)(idProp, "disclosure");
  var onClose = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }

    onCloseProp == null ? void 0 : onCloseProp();
  }, [isControlled, onCloseProp]);
  var onOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }

    onOpenProp == null ? void 0 : onOpenProp();
  }, [isControlled, onOpenProp]);
  var onToggle = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    var action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onOpen, onClose]);
  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
    getButtonProps: function getButtonProps(props) {
      if (props === void 0) {
        props = {};
      }

      return _extends({}, props, {
        "aria-expanded": "true",
        "aria-controls": id,
        onClick: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__/* .callAllHandlers */ .v0)(props.onClick, onToggle)
      });
    },
    getDisclosureProps: function getDisclosureProps(props) {
      if (props === void 0) {
        props = {};
      }

      return _extends({}, props, {
        hidden: !isOpen,
        id
      });
    }
  };
}
//# sourceMappingURL=use-disclosure.js.map

/***/ }),

/***/ 1978:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": function() { return /* binding */ Input; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_form_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4761);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }






/**
 * Input
 *
 * Element that allows users enter single valued data.
 */
var Input = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useMultiStyleConfig */ .j)("Input", props);
  var ownProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(props);
  var input = (0,_chakra_ui_form_control__WEBPACK_IMPORTED_MODULE_4__/* .useFormControl */ .Y)(ownProps);

  var _className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__.cx)("chakra-input", props.className);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__/* .chakra.input */ .m$.input, _extends({}, input, {
    __css: styles.field,
    ref: ref,
    className: _className
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .__DEV__ */ .Ts) {
  Input.displayName = "Input";
} // This is used in `input-group.tsx`


Input.id = "Input";
//# sourceMappingURL=input.js.map

/***/ }),

/***/ 7154:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "M": function() { return /* binding */ Center; }
/* harmony export */ });
/* unused harmony export AbsoluteCenter */
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





/**
 * React component used to horizontally and vertically center its child.
 * It uses the popular `display: flex` centering technique.
 *
 * @see Docs https://chakra-ui.com/center
 */
var Center = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra */ .m$)("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Center.displayName = "Center";
}

var centerStyles = {
  horizontal: {
    insetStart: "50%",
    transform: "translateX(-50%)"
  },
  vertical: {
    top: "50%",
    transform: "translateY(-50%)"
  },
  both: {
    insetStart: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  }
};
/**
 * React component used to horizontally and vertically center an element
 * relative to its parent dimensions.
 *
 * It uses the `position: absolute` strategy.
 *
 * @see Docs https://chakra-ui.com/center
 * @see WebDev https://web.dev/centering-in-css/#5.-pop-and-plop
 */

var AbsoluteCenter = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef((props, ref) => {
  var {
    axis = "both"
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["axis"]);

  return /*#__PURE__*/React.createElement(chakra.div, _extends({
    ref: ref,
    __css: centerStyles[axis]
  }, rest, {
    position: "absolute"
  }));
})));
//# sourceMappingURL=center.js.map

/***/ }),

/***/ 7217:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": function() { return /* binding */ Code; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





/**
 * React component to render inline code snippets.
 *
 * @see Docs https://chakra-ui.com/code
 */
var Code = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useStyleConfig */ .m)("Code", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(props),
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, ["className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_4__/* .chakra.code */ .m$.code, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__.cx)("chakra-code", props.className)
  }, rest, {
    __css: _extends({
      display: "inline-block"
    }, styles)
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .__DEV__ */ .Ts) {
  Code.displayName = "Code";
}
//# sourceMappingURL=code.js.map

/***/ }),

/***/ 9982:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": function() { return /* binding */ Grid; }
/* harmony export */ });
/* unused harmony export GridItem */
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





/**
 * React component used to create grid layouts.
 *
 * It renders a `div` with `display: grid` and
 * comes with helpful style shorthand.
 *
 * @see Docs https://chakra-ui.com/grid
 */
var Grid = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var {
    area,
    templateAreas,
    gap,
    rowGap,
    columnGap,
    column,
    row,
    autoFlow,
    autoRows,
    templateRows,
    autoColumns,
    templateColumns
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["area", "templateAreas", "gap", "rowGap", "columnGap", "column", "row", "autoFlow", "autoRows", "templateRows", "autoColumns", "templateColumns"]);

  var styles = {
    display: "grid",
    gridArea: area,
    gridTemplateAreas: templateAreas,
    gridGap: gap,
    gridRowGap: rowGap,
    gridColumnGap: columnGap,
    gridAutoColumns: autoColumns,
    gridColumn: column,
    gridRow: row,
    gridAutoFlow: autoFlow,
    gridAutoRows: autoRows,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    __css: styles
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__/* .__DEV__ */ .Ts) {
  Grid.displayName = "Grid";
}

function spanFn(span) {
  return mapResponsive(span, value => value === "auto" ? "auto" : "span " + value + "/span " + value);
}

var GridItem = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef((props, ref) => {
  var {
    colSpan,
    colStart,
    colEnd,
    rowEnd,
    rowSpan,
    rowStart
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["colSpan", "colStart", "colEnd", "rowEnd", "rowSpan", "rowStart"]);

  var styles = filterUndefined({
    gridColumn: spanFn(colSpan),
    gridRow: spanFn(rowSpan),
    gridColumnStart: colStart,
    gridColumnEnd: colEnd,
    gridRowStart: rowStart,
    gridRowEnd: rowEnd
  });
  return /*#__PURE__*/React.createElement(chakra.div, _extends({
    ref: ref,
    __css: styles
  }, rest));
})));
//# sourceMappingURL=grid.js.map

/***/ }),

/***/ 4374:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": function() { return /* binding */ Heading; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




var Heading = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useStyleConfig */ .m)("Heading", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(props),
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, ["className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_4__/* .chakra.h2 */ .m$.h2, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_5__.cx)("chakra-heading", props.className)
  }, rest, {
    __css: styles
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .__DEV__ */ .Ts) {
  Heading.displayName = "Heading";
}
//# sourceMappingURL=heading.js.map

/***/ }),

/***/ 9292:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": function() { return /* binding */ Text; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3042);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://chakra-ui.com/text
 */
var Text = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useStyleConfig */ .m)("Text", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(props),
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, ["className", "align", "decoration", "casing"]);

  var aliasedProps = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .filterUndefined */ .YU)({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.p */ .m$.p, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__.cx)("chakra-text", props.className)
  }, aliasedProps, rest, {
    __css: styles
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .__DEV__ */ .Ts) {
  Text.displayName = "Text";
}
//# sourceMappingURL=text.js.map

/***/ }),

/***/ 7577:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "u_": function() { return /* binding */ Modal; },
  "fe": function() { return /* binding */ ModalBody; },
  "ol": function() { return /* binding */ ModalCloseButton; },
  "hz": function() { return /* binding */ ModalContent; },
  "mz": function() { return /* binding */ ModalFooter; },
  "xB": function() { return /* binding */ ModalHeader; },
  "ZA": function() { return /* binding */ ModalOverlay; }
});

// UNUSED EXPORTS: ModalContextProvider, ModalFocusScope, useModalContext

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+close-button@1.1.12_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/close-button/dist/esm/close-button.js
var close_button = __webpack_require__(9848);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.15.4/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/.pnpm/@babel+runtime@7.15.4/node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(98);
// EXTERNAL MODULE: ./node_modules/.pnpm/prop-types@15.7.2/node_modules/prop-types/index.js
var prop_types = __webpack_require__(9036);
;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/constants.js
var FOCUS_GROUP = 'data-focus-lock';
var FOCUS_DISABLED = 'data-focus-lock-disabled';
var FOCUS_ALLOW = 'data-no-focus-lock';
var FOCUS_AUTO = 'data-autofocus-inside';

;// CONCATENATED MODULE: ./node_modules/.pnpm/use-callback-ref@1.2.5_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/use-callback-ref/dist/es2015/useRef.js

/**
 * creates a MutableRef with ref change callback
 * @param initialValue - initial ref value
 * @param {Function} callback - a callback to run when value changes
 *
 * @example
 * const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
 * ref.current = 1;
 * // prints 0 -> 1
 *
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 * @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
 * @returns {MutableRefObject}
 */
function useCallbackRef(initialValue, callback) {
    var ref = (0,react.useState)(function () { return ({
        // value
        value: initialValue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            }
        }
    }); })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/use-callback-ref@1.2.5_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref) {
        ref.current = value;
    }
    return ref;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/use-callback-ref@1.2.5_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/use-callback-ref/dist/es2015/useMergeRef.js


/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergeRefs} a version without buit-in memoization
 * @see https://github.com/theKashey/use-callback-ref#usemergerefs
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
function useMergeRefs(refs, defaultValue) {
    return useCallbackRef(defaultValue, function (newValue) {
        return refs.forEach(function (ref) { return assignRef(ref, newValue); });
    });
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/FocusGuard.js


var hiddenGuard = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: '1px',
  left: '1px'
};

var InFocusGuard = function InFocusGuard(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    key: "guard-first",
    "data-focus-guard": true,
    "data-focus-auto-guard": true,
    style: hiddenGuard
  }), children, children && /*#__PURE__*/react.createElement("div", {
    key: "guard-last",
    "data-focus-guard": true,
    "data-focus-auto-guard": true,
    style: hiddenGuard
  }));
};

InFocusGuard.propTypes =  false ? 0 : {};
InFocusGuard.defaultProps = {
  children: null
};
/* harmony default export */ var FocusGuard = ((/* unused pure expression or super */ null && (InFocusGuard)));
;// CONCATENATED MODULE: ./node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/use-sidecar@1.0.5_react@17.0.2/node_modules/use-sidecar/dist/es2015/medium.js

function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function () {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function (data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function () {
                buffer = buffer.filter(function (x) { return x !== item; });
            };
        },
        assignSyncMedium: function (cb) {
            assigned = true;
            while (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function (x) { return cb(x); },
                filter: function () { return buffer; },
            };
        },
        assignMedium: function (cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function () {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function () { return Promise.resolve().then(executeQueue); };
            cycle();
            buffer = {
                push: function (x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function (filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                },
            };
        },
    };
    return medium;
}
function createMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    return innerCreateMedium(defaults, middleware);
}
function createSidecarMedium(options) {
    if (options === void 0) { options = {}; }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/medium.js

var mediumFocus = createMedium({}, function (_ref) {
  var target = _ref.target,
      currentTarget = _ref.currentTarget;
  return {
    target: target,
    currentTarget: currentTarget
  };
});
var mediumBlur = createMedium();
var mediumEffect = createMedium();
var mediumSidecar = createSidecarMedium({
  async: true
});
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/Lock.js







var emptyArray = [];
var FocusLock = /*#__PURE__*/react.forwardRef(function FocusLockUI(props, parentRef) {
  var _extends2;

  var _React$useState = react.useState(),
      realObserved = _React$useState[0],
      setObserved = _React$useState[1];

  var observed = react.useRef();
  var isActive = react.useRef(false);
  var originalFocusedElement = react.useRef(null);
  var children = props.children,
      disabled = props.disabled,
      noFocusGuards = props.noFocusGuards,
      persistentFocus = props.persistentFocus,
      crossFrame = props.crossFrame,
      autoFocus = props.autoFocus,
      allowTextSelection = props.allowTextSelection,
      group = props.group,
      className = props.className,
      whiteList = props.whiteList,
      _props$shards = props.shards,
      shards = _props$shards === void 0 ? emptyArray : _props$shards,
      _props$as = props.as,
      Container = _props$as === void 0 ? 'div' : _props$as,
      _props$lockProps = props.lockProps,
      containerProps = _props$lockProps === void 0 ? {} : _props$lockProps,
      SideCar = props.sideCar,
      shouldReturnFocus = props.returnFocus,
      onActivationCallback = props.onActivation,
      onDeactivationCallback = props.onDeactivation;

  var _React$useState2 = react.useState({}),
      id = _React$useState2[0]; // SIDE EFFECT CALLBACKS


  var onActivation = react.useCallback(function () {
    originalFocusedElement.current = originalFocusedElement.current || document && document.activeElement;

    if (observed.current && onActivationCallback) {
      onActivationCallback(observed.current);
    }

    isActive.current = true;
  }, [onActivationCallback]);
  var onDeactivation = react.useCallback(function () {
    isActive.current = false;

    if (onDeactivationCallback) {
      onDeactivationCallback(observed.current);
    }
  }, [onDeactivationCallback]);
  var returnFocus = react.useCallback(function (allowDefer) {
    var current = originalFocusedElement.current;

    if (Boolean(shouldReturnFocus) && current && current.focus) {
      var focusOptions = typeof shouldReturnFocus === 'object' ? shouldReturnFocus : undefined;
      originalFocusedElement.current = null;

      if (allowDefer) {
        // React might return focus after update
        // it's safer to defer the action
        Promise.resolve().then(function () {
          return current.focus(focusOptions);
        });
      } else {
        current.focus(focusOptions);
      }
    }
  }, [shouldReturnFocus]); // MEDIUM CALLBACKS

  var onFocus = react.useCallback(function (event) {
    if (isActive.current) {
      mediumFocus.useMedium(event);
    }
  }, []);
  var onBlur = mediumBlur.useMedium; // REF PROPAGATION
  // not using real refs due to race conditions

  var setObserveNode = react.useCallback(function (newObserved) {
    if (observed.current !== newObserved) {
      observed.current = newObserved;
      setObserved(newObserved);
    }
  }, []);

  if (false) {}

  var lockProps = (0,esm_extends/* default */.Z)((_extends2 = {}, _extends2[FOCUS_DISABLED] = disabled && 'disabled', _extends2[FOCUS_GROUP] = group, _extends2), containerProps);

  var hasLeadingGuards = noFocusGuards !== true;
  var hasTailingGuards = hasLeadingGuards && noFocusGuards !== 'tail';
  var mergedRef = useMergeRefs([parentRef, setObserveNode]);
  return /*#__PURE__*/react.createElement(react.Fragment, null, hasLeadingGuards && [/*#__PURE__*/react.createElement("div", {
    key: "guard-first",
    "data-focus-guard": true,
    tabIndex: disabled ? -1 : 0,
    style: hiddenGuard
  }),
  /*#__PURE__*/
  // nearest focus guard
  react.createElement("div", {
    key: "guard-nearest",
    "data-focus-guard": true,
    tabIndex: disabled ? -1 : 1,
    style: hiddenGuard
  }) // first tabbed element guard
  ], !disabled && /*#__PURE__*/react.createElement(SideCar, {
    id: id,
    sideCar: mediumSidecar,
    observed: realObserved,
    disabled: disabled,
    persistentFocus: persistentFocus,
    crossFrame: crossFrame,
    autoFocus: autoFocus,
    whiteList: whiteList,
    shards: shards,
    onActivation: onActivation,
    onDeactivation: onDeactivation,
    returnFocus: returnFocus
  }), /*#__PURE__*/react.createElement(Container, (0,esm_extends/* default */.Z)({
    ref: mergedRef
  }, lockProps, {
    className: className,
    onBlur: onBlur,
    onFocus: onFocus
  }), children), hasTailingGuards && /*#__PURE__*/react.createElement("div", {
    "data-focus-guard": true,
    tabIndex: disabled ? -1 : 0,
    style: hiddenGuard
  }));
});
FocusLock.propTypes =  false ? 0 : {};
FocusLock.defaultProps = {
  children: undefined,
  disabled: false,
  returnFocus: false,
  noFocusGuards: false,
  autoFocus: true,
  persistentFocus: false,
  crossFrame: true,
  allowTextSelection: undefined,
  group: undefined,
  className: undefined,
  whiteList: undefined,
  shards: undefined,
  as: 'div',
  lockProps: {},
  onActivation: undefined,
  onDeactivation: undefined
};
/* harmony default export */ var Lock = (FocusLock);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.15.4/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.15.4/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.15.4/node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-clientside-effect@1.2.5_react@17.0.2/node_modules/react-clientside-effect/lib/index.es.js




function withSideEffect(reducePropsToState, handleStateChangeOnClient) {
  if (false) {}

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  return function wrap(WrappedComponent) {
    if (false) {}

    var mountedInstances = [];
    var state;

    function emitChange() {
      state = reducePropsToState(mountedInstances.map(function (instance) {
        return instance.props;
      }));
      handleStateChangeOnClient(state);
    }

    var SideEffect = /*#__PURE__*/function (_PureComponent) {
      _inheritsLoose(SideEffect, _PureComponent);

      function SideEffect() {
        return _PureComponent.apply(this, arguments) || this;
      }

      // Try to use displayName of wrapped component
      SideEffect.peek = function peek() {
        return state;
      };

      var _proto = SideEffect.prototype;

      _proto.componentDidMount = function componentDidMount() {
        mountedInstances.push(this);
        emitChange();
      };

      _proto.componentDidUpdate = function componentDidUpdate() {
        emitChange();
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        var index = mountedInstances.indexOf(this);
        mountedInstances.splice(index, 1);
        emitChange();
      };

      _proto.render = function render() {
        return /*#__PURE__*/react.createElement(WrappedComponent, this.props);
      };

      return SideEffect;
    }(react.PureComponent);

    _defineProperty(SideEffect, "displayName", "SideEffect(" + getDisplayName(WrappedComponent) + ")");

    return SideEffect;
  };
}

/* harmony default export */ var index_es = (withSideEffect);

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/correctFocus.js
var isRadio = function (node) { return node.tagName === 'INPUT' && node.type === 'radio'; };
var findSelectedRadio = function (node, nodes) {
    return nodes
        .filter(isRadio)
        .filter(function (el) { return el.name === node.name; })
        .filter(function (el) { return el.checked; })[0] || node;
};
var correctNode = function (node, nodes) {
    if (isRadio(node) && node.name) {
        return findSelectedRadio(node, nodes);
    }
    return node;
};
var correctNodes = function (nodes) {
    var resultSet = new Set();
    nodes.forEach(function (node) { return resultSet.add(correctNode(node, nodes)); });
    return nodes.filter(function (node) { return resultSet.has(node); });
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/firstFocus.js

var pickFirstFocus = function (nodes) {
    if (nodes[0] && nodes.length > 1) {
        return correctNode(nodes[0], nodes);
    }
    return nodes[0];
};
var pickFocusable = function (nodes, index) {
    if (nodes.length > 1) {
        return nodes.indexOf(correctNode(nodes[index], nodes));
    }
    return index;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/is.js
var isElementHidden = function (computedStyle) {
    if (!computedStyle || !computedStyle.getPropertyValue) {
        return false;
    }
    return (computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden');
};
var isVisible = function (node) {
    return !node ||
        node === document ||
        (node && node.nodeType === Node.DOCUMENT_NODE) ||
        (!isElementHidden(window.getComputedStyle(node, null)) &&
            isVisible(node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                ? node.parentNode.host
                : node.parentNode));
};
var notHiddenInput = function (node) {
    return !((node.tagName === 'INPUT' || node.tagName === 'BUTTON') && (node.type === 'hidden' || node.disabled));
};
var isGuard = function (node) { return Boolean(node && node.dataset && node.dataset.focusGuard); };
var isNotAGuard = function (node) { return !isGuard(node); };
var isDefined = function (x) { return Boolean(x); };

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/solver.js



var NEW_FOCUS = 'NEW_FOCUS';
var newFocus = function (innerNodes, outerNodes, activeElement, lastNode) {
    var cnt = innerNodes.length;
    var firstFocus = innerNodes[0];
    var lastFocus = innerNodes[cnt - 1];
    var isOnGuard = isGuard(activeElement);
    if (innerNodes.indexOf(activeElement) >= 0) {
        return undefined;
    }
    var activeIndex = outerNodes.indexOf(activeElement);
    var lastIndex = lastNode ? outerNodes.indexOf(lastNode) : activeIndex;
    var lastNodeInside = lastNode ? innerNodes.indexOf(lastNode) : -1;
    var indexDiff = activeIndex - lastIndex;
    var firstNodeIndex = outerNodes.indexOf(firstFocus);
    var lastNodeIndex = outerNodes.indexOf(lastFocus);
    var correctedNodes = correctNodes(outerNodes);
    var correctedIndexDiff = correctedNodes.indexOf(activeElement) - (lastNode ? correctedNodes.indexOf(lastNode) : activeIndex);
    var returnFirstNode = pickFocusable(innerNodes, 0);
    var returnLastNode = pickFocusable(innerNodes, cnt - 1);
    if (activeIndex === -1 || lastNodeInside === -1) {
        return NEW_FOCUS;
    }
    if (!indexDiff && lastNodeInside >= 0) {
        return lastNodeInside;
    }
    if (activeIndex <= firstNodeIndex && isOnGuard && Math.abs(indexDiff) > 1) {
        return returnLastNode;
    }
    if (activeIndex >= lastNodeIndex && isOnGuard && Math.abs(indexDiff) > 1) {
        return returnFirstNode;
    }
    if (indexDiff && Math.abs(correctedIndexDiff) > 1) {
        return lastNodeInside;
    }
    if (activeIndex <= firstNodeIndex) {
        return returnLastNode;
    }
    if (activeIndex > lastNodeIndex) {
        return returnFirstNode;
    }
    if (indexDiff) {
        if (Math.abs(indexDiff) > 1) {
            return lastNodeInside;
        }
        return (cnt + lastNodeInside + indexDiff) % cnt;
    }
    return undefined;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/array.js
var toArray = function (a) {
    var ret = Array(a.length);
    for (var i = 0; i < a.length; ++i) {
        ret[i] = a[i];
    }
    return ret;
};
var asArray = function (a) { return (Array.isArray(a) ? a : [a]); };

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/all-affected.js


var filterNested = function (nodes) {
    var contained = new Set();
    var l = nodes.length;
    for (var i = 0; i < l; i += 1) {
        for (var j = i + 1; j < l; j += 1) {
            var position = nodes[i].compareDocumentPosition(nodes[j]);
            if ((position & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0) {
                contained.add(j);
            }
            if ((position & Node.DOCUMENT_POSITION_CONTAINS) > 0) {
                contained.add(i);
            }
        }
    }
    return nodes.filter(function (_, index) { return !contained.has(index); });
};
var getTopParent = function (node) {
    return node.parentNode ? getTopParent(node.parentNode) : node;
};
var getAllAffectedNodes = function (node) {
    var nodes = asArray(node);
    return nodes.filter(Boolean).reduce(function (acc, currentNode) {
        var group = currentNode.getAttribute(FOCUS_GROUP);
        acc.push.apply(acc, (group
            ? filterNested(toArray(getTopParent(currentNode).querySelectorAll("[" + FOCUS_GROUP + "=\"" + group + "\"]:not([" + FOCUS_DISABLED + "=\"disabled\"])")))
            : [currentNode]));
        return acc;
    }, []);
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/tabOrder.js

var tabSort = function (a, b) {
    var tabDiff = a.tabIndex - b.tabIndex;
    var indexDiff = a.index - b.index;
    if (tabDiff) {
        if (!a.tabIndex) {
            return 1;
        }
        if (!b.tabIndex) {
            return -1;
        }
    }
    return tabDiff || indexDiff;
};
var orderByTabIndex = function (nodes, filterNegative, keepGuards) {
    return toArray(nodes)
        .map(function (node, index) { return ({
        node: node,
        index: index,
        tabIndex: keepGuards && node.tabIndex === -1 ? ((node.dataset || {}).focusGuard ? 0 : -1) : node.tabIndex,
    }); })
        .filter(function (data) { return !filterNegative || data.tabIndex >= 0; })
        .sort(tabSort);
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/tabbables.js
var tabbables = [
    'button:enabled',
    'select:enabled',
    'textarea:enabled',
    'input:enabled',
    'a[href]',
    'area[href]',
    'summary',
    'iframe',
    'object',
    'embed',
    'audio[controls]',
    'video[controls]',
    '[tabindex]',
    '[contenteditable]',
    '[autofocus]',
];

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/tabUtils.js



var queryTabbables = tabbables.join(',');
var queryGuardTabbables = queryTabbables + ", [data-focus-guard]";
var getFocusables = function (parents, withGuards) {
    return parents.reduce(function (acc, parent) {
        return acc.concat(toArray(parent.querySelectorAll(withGuards ? queryGuardTabbables : queryTabbables)), parent.parentNode
            ? toArray(parent.parentNode.querySelectorAll(queryTabbables)).filter(function (node) { return node === parent; })
            : []);
    }, []);
};
var getParentAutofocusables = function (parent) {
    var parentFocus = parent.querySelectorAll("[" + FOCUS_AUTO + "]");
    return toArray(parentFocus)
        .map(function (node) { return getFocusables([node]); })
        .reduce(function (acc, nodes) { return acc.concat(nodes); }, []);
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/DOMutils.js




var filterFocusable = function (nodes) {
    return toArray(nodes)
        .filter(function (node) { return isVisible(node); })
        .filter(function (node) { return notHiddenInput(node); });
};
var getTabbableNodes = function (topNodes, withGuards) {
    return orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards)), true, withGuards);
};
var getAllTabbableNodes = function (topNodes) {
    return orderByTabIndex(filterFocusable(getFocusables(topNodes)), false);
};
var parentAutofocusables = function (topNode) {
    return filterFocusable(getParentAutofocusables(topNode));
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/utils/parenting.js


var getParents = function (node, parents) {
    if (parents === void 0) { parents = []; }
    parents.push(node);
    if (node.parentNode) {
        getParents(node.parentNode, parents);
    }
    return parents;
};
var getCommonParent = function (nodeA, nodeB) {
    var parentsA = getParents(nodeA);
    var parentsB = getParents(nodeB);
    for (var i = 0; i < parentsA.length; i += 1) {
        var currentParent = parentsA[i];
        if (parentsB.indexOf(currentParent) >= 0) {
            return currentParent;
        }
    }
    return false;
};
var getTopCommonParent = function (baseActiveElement, leftEntry, rightEntries) {
    var activeElements = asArray(baseActiveElement);
    var leftEntries = asArray(leftEntry);
    var activeElement = activeElements[0];
    var topCommon = false;
    leftEntries.filter(Boolean).forEach(function (entry) {
        topCommon = getCommonParent(topCommon || entry, entry) || topCommon;
        rightEntries.filter(Boolean).forEach(function (subEntry) {
            var common = getCommonParent(activeElement, subEntry);
            if (common) {
                if (!topCommon || common.contains(topCommon)) {
                    topCommon = common;
                }
                else {
                    topCommon = getCommonParent(common, topCommon);
                }
            }
        });
    });
    return topCommon;
};
var allParentAutofocusables = function (entries) {
    return entries.reduce(function (acc, node) { return acc.concat(parentAutofocusables(node)); }, []);
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/focusMerge.js






var findAutoFocused = function (autoFocusables) { return function (node) {
    return node.autofocus || (node.dataset && !!node.dataset.autofocus) || autoFocusables.indexOf(node) >= 0;
}; };
var reorderNodes = function (srcNodes, dstNodes) {
    var remap = new Map();
    dstNodes.forEach(function (entity) { return remap.set(entity.node, entity); });
    return srcNodes.map(function (node) { return remap.get(node); }).filter(isDefined);
};
var getFocusMerge = function (topNode, lastNode) {
    var activeElement = (document && document.activeElement);
    var entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
    var commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);
    var anyFocusable = getAllTabbableNodes(entries);
    var innerElements = getTabbableNodes(entries).filter(function (_a) {
        var node = _a.node;
        return isNotAGuard(node);
    });
    if (!innerElements[0]) {
        innerElements = anyFocusable;
        if (!innerElements[0]) {
            return undefined;
        }
    }
    var outerNodes = getAllTabbableNodes([commonParent]).map(function (_a) {
        var node = _a.node;
        return node;
    });
    var orderedInnerElements = reorderNodes(outerNodes, innerElements);
    var innerNodes = orderedInnerElements.map(function (_a) {
        var node = _a.node;
        return node;
    });
    var newId = newFocus(innerNodes, outerNodes, activeElement, lastNode);
    if (newId === NEW_FOCUS) {
        var autoFocusable = anyFocusable
            .map(function (_a) {
            var node = _a.node;
            return node;
        })
            .filter(findAutoFocused(allParentAutofocusables(entries)));
        return {
            node: autoFocusable && autoFocusable.length ? pickFirstFocus(autoFocusable) : pickFirstFocus(innerNodes),
        };
    }
    if (newId === undefined) {
        return newId;
    }
    return orderedInnerElements[newId];
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/setFocus.js

var focusOn = function (target) {
    target.focus();
    if ('contentWindow' in target && target.contentWindow) {
        target.contentWindow.focus();
    }
};
var guardCount = 0;
var lockDisabled = false;
var setFocus = function (topNode, lastNode) {
    var focusable = getFocusMerge(topNode, lastNode);
    if (lockDisabled) {
        return;
    }
    if (focusable) {
        if (guardCount > 2) {
            console.error('FocusLock: focus-fighting detected. Only one focus management system could be active. ' +
                'See https://github.com/theKashey/focus-lock/#focus-fighting');
            lockDisabled = true;
            setTimeout(function () {
                lockDisabled = false;
            }, 1);
            return;
        }
        guardCount++;
        focusOn(focusable.node);
        guardCount--;
    }
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/index.js










/* harmony default export */ var es2015 = (setFocus);

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/focusIsHidden.js


var focusIsHidden = function () {
    return document &&
        toArray(document.querySelectorAll("[" + FOCUS_ALLOW + "]")).some(function (node) { return node.contains(document.activeElement); });
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/focusInside.js


var focusInFrame = function (frame) { return frame === document.activeElement; };
var focusInsideIframe = function (topNode) {
    return Boolean(toArray(topNode.querySelectorAll('iframe')).some(function (node) { return focusInFrame(node); }));
};
var focusInside = function (topNode) {
    var activeElement = document && document.activeElement;
    if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
        return false;
    }
    return getAllAffectedNodes(topNode).reduce(function (result, node) { return result || node.contains(activeElement) || focusInsideIframe(node); }, false);
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/focus-lock@0.8.1/node_modules/focus-lock/dist/es2015/focusables.js




var getFocusabledIn = function (topNode) {
    var entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
    var commonParent = getTopCommonParent(topNode, topNode, entries);
    var outerNodes = getTabbableNodes([commonParent], true);
    var innerElements = getTabbableNodes(entries)
        .filter(function (_a) {
        var node = _a.node;
        return isNotAGuard(node);
    })
        .map(function (_a) {
        var node = _a.node;
        return node;
    });
    return outerNodes.map(function (_a) {
        var node = _a.node, index = _a.index;
        return ({
            node: node,
            index: index,
            lockItem: innerElements.indexOf(node) >= 0,
            guard: isGuard(node),
        });
    });
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/util.js
function deferAction(action) {
  // Hidding setImmediate from Webpack to avoid inserting polyfill
  var _window = window,
      setImmediate = _window.setImmediate;

  if (typeof setImmediate !== 'undefined') {
    setImmediate(action);
  } else {
    setTimeout(action, 1);
  }
}
var inlineProp = function inlineProp(name, value) {
  var obj = {};
  obj[name] = value;
  return obj;
};
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/Trap.js







var focusOnBody = function focusOnBody() {
  return document && document.activeElement === document.body;
};

var isFreeFocus = function isFreeFocus() {
  return focusOnBody() || focusIsHidden();
};

var lastActiveTrap = null;
var lastActiveFocus = null;
var lastPortaledElement = null;
var focusWasOutsideWindow = false;

var defaultWhitelist = function defaultWhitelist() {
  return true;
};

var focusWhitelisted = function focusWhitelisted(activeElement) {
  return (lastActiveTrap.whiteList || defaultWhitelist)(activeElement);
};

var recordPortal = function recordPortal(observerNode, portaledElement) {
  lastPortaledElement = {
    observerNode: observerNode,
    portaledElement: portaledElement
  };
};

var focusIsPortaledPair = function focusIsPortaledPair(element) {
  return lastPortaledElement && lastPortaledElement.portaledElement === element;
};

function autoGuard(startIndex, end, step, allNodes) {
  var lastGuard = null;
  var i = startIndex;

  do {
    var item = allNodes[i];

    if (item.guard) {
      if (item.node.dataset.focusAutoGuard) {
        lastGuard = item;
      }
    } else if (item.lockItem) {
      if (i !== startIndex) {
        // we will tab to the next element
        return;
      }

      lastGuard = null;
    } else {
      break;
    }
  } while ((i += step) !== end);

  if (lastGuard) {
    lastGuard.node.tabIndex = 0;
  }
}

var extractRef = function extractRef(ref) {
  return ref && 'current' in ref ? ref.current : ref;
};

var focusWasOutside = function focusWasOutside(crossFrameOption) {
  if (crossFrameOption) {
    // with cross frame return true for any value
    return Boolean(focusWasOutsideWindow);
  } // in other case return only of focus went a while aho


  return focusWasOutsideWindow === 'meanwhile';
};

var activateTrap = function activateTrap() {
  var result = false;

  if (lastActiveTrap) {
    var _lastActiveTrap = lastActiveTrap,
        observed = _lastActiveTrap.observed,
        persistentFocus = _lastActiveTrap.persistentFocus,
        autoFocus = _lastActiveTrap.autoFocus,
        shards = _lastActiveTrap.shards,
        crossFrame = _lastActiveTrap.crossFrame;
    var workingNode = observed || lastPortaledElement && lastPortaledElement.portaledElement;
    var activeElement = document && document.activeElement;

    if (workingNode) {
      var workingArea = [workingNode].concat(shards.map(extractRef).filter(Boolean));

      if (!activeElement || focusWhitelisted(activeElement)) {
        if (persistentFocus || focusWasOutside(crossFrame) || !isFreeFocus() || !lastActiveFocus && autoFocus) {
          if (workingNode && !(focusInside(workingArea) || focusIsPortaledPair(activeElement, workingNode))) {
            if (document && !lastActiveFocus && activeElement && !autoFocus) {
              // Check if blur() exists, which is missing on certain elements on IE
              if (activeElement.blur) {
                activeElement.blur();
              }

              document.body.focus();
            } else {
              result = es2015(workingArea, lastActiveFocus);
              lastPortaledElement = {};
            }
          }

          focusWasOutsideWindow = false;
          lastActiveFocus = document && document.activeElement;
        }
      }

      if (document) {
        var newActiveElement = document && document.activeElement;
        var allNodes = getFocusabledIn(workingArea);
        var focusedIndex = allNodes.map(function (_ref) {
          var node = _ref.node;
          return node;
        }).indexOf(newActiveElement);

        if (focusedIndex > -1) {
          // remove old focus
          allNodes.filter(function (_ref2) {
            var guard = _ref2.guard,
                node = _ref2.node;
            return guard && node.dataset.focusAutoGuard;
          }).forEach(function (_ref3) {
            var node = _ref3.node;
            return node.removeAttribute('tabIndex');
          });
          autoGuard(focusedIndex, allNodes.length, +1, allNodes);
          autoGuard(focusedIndex, -1, -1, allNodes);
        }
      }
    }
  }

  return result;
};

var onTrap = function onTrap(event) {
  if (activateTrap() && event) {
    // prevent scroll jump
    event.stopPropagation();
    event.preventDefault();
  }
};

var onBlur = function onBlur() {
  return deferAction(activateTrap);
};

var onFocus = function onFocus(event) {
  // detect portal
  var source = event.target;
  var currentNode = event.currentTarget;

  if (!currentNode.contains(source)) {
    recordPortal(currentNode, source);
  }
};

var FocusWatcher = function FocusWatcher() {
  return null;
};

var FocusTrap = function FocusTrap(_ref4) {
  var children = _ref4.children;
  return /*#__PURE__*/react.createElement("div", {
    onBlur: onBlur,
    onFocus: onFocus
  }, children);
};

FocusTrap.propTypes =  false ? 0 : {};

var onWindowBlur = function onWindowBlur() {
  focusWasOutsideWindow = 'just'; // using setTimeout to set  this variable after React/sidecar reaction

  setTimeout(function () {
    focusWasOutsideWindow = 'meanwhile';
  }, 0);
};

var attachHandler = function attachHandler() {
  document.addEventListener('focusin', onTrap, true);
  document.addEventListener('focusout', onBlur);
  window.addEventListener('blur', onWindowBlur);
};

var detachHandler = function detachHandler() {
  document.removeEventListener('focusin', onTrap, true);
  document.removeEventListener('focusout', onBlur);
  window.removeEventListener('blur', onWindowBlur);
};

function reducePropsToState(propsList) {
  return propsList.filter(function (_ref5) {
    var disabled = _ref5.disabled;
    return !disabled;
  });
}

function handleStateChangeOnClient(traps) {
  var trap = traps.slice(-1)[0];

  if (trap && !lastActiveTrap) {
    attachHandler();
  }

  var lastTrap = lastActiveTrap;
  var sameTrap = lastTrap && trap && trap.id === lastTrap.id;
  lastActiveTrap = trap;

  if (lastTrap && !sameTrap) {
    lastTrap.onDeactivation(); // return focus only of last trap was removed

    if (!traps.filter(function (_ref6) {
      var id = _ref6.id;
      return id === lastTrap.id;
    }).length) {
      // allow defer is no other trap is awaiting restore
      lastTrap.returnFocus(!trap);
    }
  }

  if (trap) {
    lastActiveFocus = null;

    if (!sameTrap || lastTrap.observed !== trap.observed) {
      trap.onActivation();
    }

    activateTrap(true);
    deferAction(activateTrap);
  } else {
    detachHandler();
    lastActiveFocus = null;
  }
} // bind medium


mediumFocus.assignSyncMedium(onFocus);
mediumBlur.assignMedium(onBlur);
mediumEffect.assignMedium(function (cb) {
  return cb({
    moveFocusInside: es2015,
    focusInside: focusInside
  });
});
/* harmony default export */ var Trap = (index_es(reducePropsToState, handleStateChangeOnClient)(FocusWatcher));
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/Combination.js





/* that would be a BREAKING CHANGE!
// delaying sidecar execution till the first usage
const RequireSideCar = (props) => {
  // eslint-disable-next-line global-require
  const SideCar = require('./Trap').default;
  return <SideCar {...props} />;
};
*/

var FocusLockCombination = /*#__PURE__*/react.forwardRef(function FocusLockUICombination(props, ref) {
  return /*#__PURE__*/react.createElement(Lock, (0,esm_extends/* default */.Z)({
    sideCar: Trap,
    ref: ref
  }, props));
});

var _ref = Lock.propTypes || {},
    sideCar = _ref.sideCar,
    propTypes = _objectWithoutPropertiesLoose(_ref, ["sideCar"]);

FocusLockCombination.propTypes =  false ? 0 : {};
/* harmony default export */ var Combination = (FocusLockCombination);
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-focus-lock@2.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-focus-lock/dist/es2015/index.js


/* harmony default export */ var dist_es2015 = (Combination);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/tabbable.js
var tabbable = __webpack_require__(3714);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/dom-query.js


var focusableElList = ["input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "embed", "iframe", "object", "a[href]", "area[href]", "button:not([disabled])", "[tabindex]", "audio[controls]", "video[controls]", "*[tabindex]:not([aria-disabled])", "*[contenteditable]"];
var focusableElSelector = focusableElList.join();
function getAllFocusable(container) {
  var focusableEls = Array.from(container.querySelectorAll(focusableElSelector));
  focusableEls.unshift(container);
  return focusableEls.filter(tabbable/* isFocusable */.EB).filter(el => window.getComputedStyle(el).display !== "none");
}
function getFirstFocusable(container) {
  var allFocusable = getAllFocusable(container);
  return allFocusable.length ? allFocusable[0] : null;
}
function getAllTabbable(container, fallbackToFocusable) {
  var allFocusable = Array.from(container.querySelectorAll(focusableElSelector));
  var allTabbable = allFocusable.filter(isTabbable);

  if (isTabbable(container)) {
    allTabbable.unshift(container);
  }

  if (!allTabbable.length && fallbackToFocusable) {
    return allFocusable;
  }

  return allTabbable;
}
function getFirstTabbableIn(container, fallbackToFocusable) {
  var [first] = getAllTabbable(container, fallbackToFocusable);
  return first || null;
}
function getLastTabbableIn(container, fallbackToFocusable) {
  var allTabbable = getAllTabbable(container, fallbackToFocusable);
  return allTabbable[allTabbable.length - 1] || null;
}
function getNextTabbable(container, fallbackToFocusable) {
  var allFocusable = getAllFocusable(container);
  var index = allFocusable.indexOf(document.activeElement);
  var slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
function getPreviousTabbable(container, fallbackToFocusable) {
  var allFocusable = getAllFocusable(container).reverse();
  var index = allFocusable.indexOf(document.activeElement);
  var slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
function focusNextTabbable(container, fallbackToFocusable) {
  var nextTabbable = getNextTabbable(container, fallbackToFocusable);

  if (nextTabbable && isHTMLElement(nextTabbable)) {
    nextTabbable.focus();
  }
}
function focusPreviousTabbable(container, fallbackToFocusable) {
  var previousTabbable = getPreviousTabbable(container, fallbackToFocusable);

  if (previousTabbable && isHTMLElement(previousTabbable)) {
    previousTabbable.focus();
  }
}

function matches(element, selectors) {
  if ("matches" in element) return element.matches(selectors);
  if ("msMatchesSelector" in element) return element.msMatchesSelector(selectors);
  return element.webkitMatchesSelector(selectors);
}

function closest(element, selectors) {
  if ("closest" in element) return element.closest(selectors);

  do {
    if (matches(element, selectors)) return element;
    element = element.parentElement || element.parentNode;
  } while (element !== null && element.nodeType === 1);

  return null;
}
//# sourceMappingURL=dom-query.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/focus.js
var esm_focus = __webpack_require__(1236);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/assertion.js
var assertion = __webpack_require__(5621);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+focus-lock@1.1.11_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/@chakra-ui/focus-lock/dist/esm/index.js



var esm_FocusLock = props => {
  var {
    initialFocusRef,
    finalFocusRef,
    contentRef,
    restoreFocus,
    children,
    isDisabled,
    autoFocus,
    persistentFocus,
    lockFocusAcrossFrames
  } = props;
  var onActivation = react.useCallback(() => {
    if (initialFocusRef != null && initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else if (contentRef != null && contentRef.current) {
      var focusables = getAllFocusable(contentRef.current);

      if (focusables.length === 0) {
        (0,esm_focus/* focus */.T)(contentRef.current, {
          nextTick: true
        });
      }
    }
  }, [initialFocusRef, contentRef]);
  var onDeactivation = react.useCallback(() => {
    var _finalFocusRef$curren;

    finalFocusRef == null ? void 0 : (_finalFocusRef$curren = finalFocusRef.current) == null ? void 0 : _finalFocusRef$curren.focus();
  }, [finalFocusRef]);
  var returnFocus = restoreFocus && !finalFocusRef;
  return /*#__PURE__*/react.createElement(dist_es2015, {
    crossFrame: lockFocusAcrossFrames,
    persistentFocus: persistentFocus,
    autoFocus: autoFocus,
    disabled: isDisabled,
    onActivation: onActivation,
    onDeactivation: onDeactivation,
    returnFocus: returnFocus
  }, children);
};

if (assertion/* __DEV__ */.Ts) {
  esm_FocusLock.displayName = "FocusLock";
}

/* harmony default export */ var esm = ((/* unused pure expression or super */ null && (esm_FocusLock)));
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-unmount-effect.js

function useUnmountEffect(fn, deps) {
  if (deps === void 0) {
    deps = [];
  }

  return react.useEffect(() => () => fn(), // eslint-disable-next-line react-hooks/exhaustive-deps
  deps);
}
//# sourceMappingURL=use-unmount-effect.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-force-update.js


function useForceUpdate() {
  var unloadingRef = react.useRef(false);
  var [count, setCount] = react.useState(0);
  useUnmountEffect(() => {
    unloadingRef.current = true;
  });
  return react.useCallback(() => {
    if (!unloadingRef.current) {
      setCount(count + 1);
    }
  }, [count]);
}
//# sourceMappingURL=use-force-update.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-safe-layout-effect.js
var use_safe_layout_effect = __webpack_require__(3934);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/dom.js
var dom = __webpack_require__(2353);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+react-utils@1.1.2_react@17.0.2/node_modules/@chakra-ui/react-utils/dist/esm/context.js
var context = __webpack_require__(7969);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-dom@17.0.2_react@17.0.2/node_modules/react-dom/index.js
var react_dom = __webpack_require__(7995);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+portal@1.2.10_react-dom@17.0.2+react@17.0.2/node_modules/@chakra-ui/portal/dist/esm/portal-manager.js
var portal_manager = __webpack_require__(1461);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+portal@1.2.10_react-dom@17.0.2+react@17.0.2/node_modules/@chakra-ui/portal/dist/esm/portal.js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function portal_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }







var [PortalContextProvider, usePortalContext] = (0,context/* createContext */.k)({
  strict: false,
  name: "PortalContext"
});
var PORTAL_CLASSNAME = "chakra-portal";
var PORTAL_SELECTOR = ".chakra-portal";

var Container = props => /*#__PURE__*/react.createElement("div", {
  className: "chakra-portal-zIndex",
  style: {
    position: "absolute",
    zIndex: props.zIndex,
    top: 0,
    left: 0,
    right: 0 // NB: Don't add `bottom: 0`, it makes the entire app unusable
    // @see https://github.com/chakra-ui/chakra-ui/issues/3201

  }
}, props.children);
/**
 * Portal that uses `document.body` as container
 */


var DefaultPortal = props => {
  var {
    appendToParentPortal,
    children
  } = props;
  var tempNode = react.useRef(null);
  var portal = react.useRef(null);
  var forceUpdate = useForceUpdate();
  var parentPortal = usePortalContext();
  var manager = (0,portal_manager/* usePortalManager */.L)();
  (0,use_safe_layout_effect/* useSafeLayoutEffect */.G)(() => {
    if (!tempNode.current) return;
    var doc = tempNode.current.ownerDocument;
    var host = appendToParentPortal ? parentPortal != null ? parentPortal : doc.body : doc.body;
    if (!host) return;
    portal.current = doc.createElement("div");
    portal.current.className = PORTAL_CLASSNAME;
    host.appendChild(portal.current);
    forceUpdate();
    var portalNode = portal.current;
    return () => {
      if (host.contains(portalNode)) {
        host.removeChild(portalNode);
      }
    };
  }, []);

  var _children = manager != null && manager.zIndex ? /*#__PURE__*/react.createElement(Container, {
    zIndex: manager == null ? void 0 : manager.zIndex
  }, children) : children;

  return portal.current ? /*#__PURE__*/(0,react_dom.createPortal)( /*#__PURE__*/react.createElement(PortalContextProvider, {
    value: portal.current
  }, _children), portal.current) : /*#__PURE__*/react.createElement("span", {
    ref: tempNode
  });
};

/**
 * Portal that uses a custom container
 */
var ContainerPortal = props => {
  var {
    children,
    containerRef,
    appendToParentPortal
  } = props;
  var containerEl = containerRef.current;
  var host = containerEl != null ? containerEl : dom/* isBrowser */.jU ? document.body : undefined;
  var portal = react.useMemo(() => {
    var node = containerEl == null ? void 0 : containerEl.ownerDocument.createElement("div");
    if (node) node.className = PORTAL_CLASSNAME;
    return node;
  }, [containerEl]);
  var forceUpdate = useForceUpdate();
  (0,use_safe_layout_effect/* useSafeLayoutEffect */.G)(() => {
    forceUpdate();
  }, []);
  (0,use_safe_layout_effect/* useSafeLayoutEffect */.G)(() => {
    if (!portal || !host) return;
    host.appendChild(portal);
    return () => {
      host.removeChild(portal);
    };
  }, [portal, host]);

  if (host && portal) {
    return /*#__PURE__*/(0,react_dom.createPortal)( /*#__PURE__*/react.createElement(PortalContextProvider, {
      value: appendToParentPortal ? portal : null
    }, children), portal);
  }

  return null;
};

/**
 * Portal
 *
 * Declarative component used to render children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 *
 * @see Docs https://chakra-ui.com/portal
 */
function Portal(props) {
  var {
    containerRef
  } = props,
      rest = portal_objectWithoutPropertiesLoose(props, ["containerRef"]);

  return containerRef ? /*#__PURE__*/react.createElement(ContainerPortal, _extends({
    containerRef: containerRef
  }, rest)) : /*#__PURE__*/react.createElement(DefaultPortal, rest);
}
Portal.defaultProps = {
  appendToParentPortal: true
};
Portal.className = PORTAL_CLASSNAME;
Portal.selector = PORTAL_SELECTOR;

if (assertion/* __DEV__ */.Ts) {
  Portal.displayName = "Portal";
}
//# sourceMappingURL=portal.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/use-style-config.js
var use_style_config = __webpack_require__(5692);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/providers.js
var providers = __webpack_require__(3010);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/system.js + 4 modules
var system = __webpack_require__(5631);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/forward-ref.js
var forward_ref = __webpack_require__(8582);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@4.1.17_react-dom@17.0.2+react@17.0.2/node_modules/framer-motion/dist/es/components/AnimatePresence/index.js + 2 modules
var AnimatePresence = __webpack_require__(1807);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@4.1.17_react-dom@17.0.2+react@17.0.2/node_modules/framer-motion/dist/es/render/dom/motion.js + 150 modules
var motion = __webpack_require__(4716);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+transition@1.3.6_6e811357ed36e65ef860931c3f3c4cd0/node_modules/@chakra-ui/transition/dist/esm/transition-utils.js
function transition_utils_extends() { transition_utils_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return transition_utils_extends.apply(this, arguments); }


var TransitionEasings = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1]
};
var TransitionVariants = {
  scale: {
    enter: {
      scale: 1
    },
    exit: {
      scale: 0.95
    }
  },
  fade: {
    enter: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  },
  pushLeft: {
    enter: {
      x: "100%"
    },
    exit: {
      x: "-30%"
    }
  },
  pushRight: {
    enter: {
      x: "-100%"
    },
    exit: {
      x: "30%"
    }
  },
  pushUp: {
    enter: {
      y: "100%"
    },
    exit: {
      y: "-30%"
    }
  },
  pushDown: {
    enter: {
      y: "-100%"
    },
    exit: {
      y: "30%"
    }
  },
  slideLeft: {
    position: {
      left: 0,
      top: 0,
      bottom: 0,
      width: "100%"
    },
    enter: {
      x: 0,
      y: 0
    },
    exit: {
      x: "-100%",
      y: 0
    }
  },
  slideRight: {
    position: {
      right: 0,
      top: 0,
      bottom: 0,
      width: "100%"
    },
    enter: {
      x: 0,
      y: 0
    },
    exit: {
      x: "100%",
      y: 0
    }
  },
  slideUp: {
    position: {
      top: 0,
      left: 0,
      right: 0,
      maxWidth: "100vw"
    },
    enter: {
      x: 0,
      y: 0
    },
    exit: {
      x: 0,
      y: "-100%"
    }
  },
  slideDown: {
    position: {
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: "100vw"
    },
    enter: {
      x: 0,
      y: 0
    },
    exit: {
      x: 0,
      y: "100%"
    }
  }
};
function slideTransition(options) {
  var _options$direction;

  var side = (_options$direction = options == null ? void 0 : options.direction) != null ? _options$direction : "right";

  switch (side) {
    case "right":
      return TransitionVariants.slideRight;

    case "left":
      return TransitionVariants.slideLeft;

    case "bottom":
      return TransitionVariants.slideDown;

    case "top":
      return TransitionVariants.slideUp;

    default:
      return TransitionVariants.slideRight;
  }
}
var TransitionDefaults = {
  enter: {
    duration: 0.2,
    ease: TransitionEasings.easeOut
  },
  exit: {
    duration: 0.1,
    ease: TransitionEasings.easeIn
  }
};
var withDelay = {
  enter: (transition, delay) => transition_utils_extends({}, transition, {
    delay: (0,assertion/* isNumber */.hj)(delay) ? delay : delay == null ? void 0 : delay["enter"]
  }),
  exit: (transition, delay) => transition_utils_extends({}, transition, {
    delay: (0,assertion/* isNumber */.hj)(delay) ? delay : delay == null ? void 0 : delay["exit"]
  })
};
//# sourceMappingURL=transition-utils.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+transition@1.3.6_6e811357ed36e65ef860931c3f3c4cd0/node_modules/@chakra-ui/transition/dist/esm/fade.js
function fade_extends() { fade_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return fade_extends.apply(this, arguments); }

function fade_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var variants = {
  enter: function enter(_temp) {
    var _transition$enter;

    var {
      transition,
      transitionEnd,
      delay
    } = _temp === void 0 ? {} : _temp;
    return {
      opacity: 1,
      transition: (_transition$enter = transition == null ? void 0 : transition.enter) != null ? _transition$enter : withDelay.enter(TransitionDefaults.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  },
  exit: function exit(_temp2) {
    var _transition$exit;

    var {
      transition,
      transitionEnd,
      delay
    } = _temp2 === void 0 ? {} : _temp2;
    return {
      opacity: 0,
      transition: (_transition$exit = transition == null ? void 0 : transition.exit) != null ? _transition$exit : withDelay.exit(TransitionDefaults.exit, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    };
  }
};
var fadeConfig = {
  initial: "exit",
  animate: "enter",
  exit: "exit",
  variants: variants
};
var Fade = /*#__PURE__*/react.forwardRef((props, ref) => {
  var {
    unmountOnExit,
    in: isOpen,
    className,
    transition,
    transitionEnd,
    delay
  } = props,
      rest = fade_objectWithoutPropertiesLoose(props, ["unmountOnExit", "in", "className", "transition", "transitionEnd", "delay"]);

  var animate = isOpen || unmountOnExit ? "enter" : "exit";
  var show = unmountOnExit ? isOpen && unmountOnExit : true;
  var custom = {
    transition,
    transitionEnd,
    delay
  };
  return /*#__PURE__*/react.createElement(AnimatePresence/* AnimatePresence */.M, {
    custom: custom
  }, show && /*#__PURE__*/react.createElement(motion/* motion.div */.E.div, fade_extends({
    ref: ref,
    className: (0,dom.cx)("chakra-fade", className),
    custom: custom
  }, fadeConfig, {
    animate: animate
  }, rest)));
});

if (assertion/* __DEV__ */.Ts) {
  Fade.displayName = "Fade";
}
//# sourceMappingURL=fade.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/function.js
var esm_function = __webpack_require__(4006);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@4.1.17_react-dom@17.0.2+react@17.0.2/node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.js
var use_presence = __webpack_require__(4640);
;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll-bar@2.2.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
var removedBarSizeVariable = '--removed-body-scroll-bar-size';

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/medium.js

var effectCar = createSidecarMedium();

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/UI.js





var nothing = function () {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */
var RemoveScroll = react.forwardRef(function (props, parentRef) {
    var ref = react.useRef(null);
    var _a = react.useState({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as"]);
    var SideCar = sideCar;
    var containerRef = useMergeRefs([
        ref,
        parentRef
    ]);
    var containerProps = __assign({}, rest, callbacks);
    return (react.createElement(react.Fragment, null,
        enabled && (react.createElement(SideCar, { sideCar: effectCar, removeScrollBar: removeScrollBar, shards: shards, noIsolation: noIsolation, inert: inert, setCallbacks: setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref })),
        forwardProps ? (react.cloneElement(react.Children.only(children), __assign({}, containerProps, { ref: containerRef }))) : (react.createElement(Container, __assign({}, containerProps, { className: className, ref: containerRef }), children))));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
};
RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/use-sidecar@1.0.5_react@17.0.2/node_modules/use-sidecar/dist/es2015/exports.js


var SideCar = function (_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return react.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var setNonce = function (nonce) {
    currentNonce = nonce;
};
var getNonce = function () {
    if (currentNonce) {
        return currentNonce;
    }
    if (true) {
        return __webpack_require__.nc;
    }
    return undefined;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-style-singleton@2.1.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-style-singleton/dist/es2015/singleton.js

function makeStyleTag() {
    if (!document)
        return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = getNonce();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    if (tag.styleSheet) {
        tag.styleSheet.cssText = css;
    }
    else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function (style) {
            if (counter == 0) {
                if (stylesheet = makeStyleTag()) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function () {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        }
    };
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-style-singleton@2.1.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-style-singleton/dist/es2015/hook.js


var styleHookSingleton = function () {
    var sheet = stylesheetSingleton();
    return function (styles) {
        react.useEffect(function () {
            sheet.add(styles);
            return function () {
                sheet.remove();
            };
        }, []);
    };
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-style-singleton@2.1.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-style-singleton/dist/es2015/component.js

var styleSingleton = function () {
    var useStyle = styleHookSingleton();
    var Sheet = function (_a) {
        var styles = _a.styles;
        useStyle(styles);
        return null;
    };
    return Sheet;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-style-singleton@2.1.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-style-singleton/dist/es2015/index.js




;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll-bar@2.2.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
};
var parse = function (x) { return parseInt(x || '', 10) || 0; };
var getOffset = function (gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [
        parse(left),
        parse(top),
        parse(right),
    ];
};
var getGapWidth = function (gapMode) {
    if (gapMode === void 0) { gapMode = 'margin'; }
    if (typeof window === 'undefined') {
        return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0]),
    };
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll-bar@2.2.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll-bar/dist/es2015/component.js




var Style = styleSingleton();
var getStyles = function (_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) { gapMode = 'margin'; }
    return "\n  ." + noScrollbarsClassName + " {\n   overflow: hidden " + important + ";\n   padding-right: " + gap + "px " + important + ";\n  }\n  body {\n    overflow: hidden " + important + ";\n    " + [
        allowRelative && "position: relative " + important + ";",
        gapMode === 'margin' && "\n    padding-left: " + left + "px;\n    padding-top: " + top + "px;\n    padding-right: " + right + "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: " + gap + "px " + important + ";\n    ",
        gapMode === 'padding' && "padding-right: " + gap + "px " + important + ";",
    ].filter(Boolean).join('') + "\n  }\n  \n  ." + zeroRightClassName + " {\n    right: " + gap + "px " + important + ";\n  }\n  \n  ." + fullWidthClassName + " {\n    margin-right: " + gap + "px " + important + ";\n  }\n  \n  ." + zeroRightClassName + " ." + zeroRightClassName + " {\n    right: 0 " + important + ";\n  }\n  \n  ." + fullWidthClassName + " ." + fullWidthClassName + " {\n    margin-right: 0 " + important + ";\n  }\n  \n  body {\n    " + removedBarSizeVariable + ": " + gap + "px;\n  }\n";
};
var RemoveScrollBar = function (props) {
    var _a = react.useState(getGapWidth(props.gapMode)), gap = _a[0], setGap = _a[1];
    react.useEffect(function () {
        setGap(getGapWidth(props.gapMode));
    }, [props.gapMode]);
    var noRelative = props.noRelative, noImportant = props.noImportant, _b = props.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    return react.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : '') });
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll-bar@2.2.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll-bar/dist/es2015/index.js





;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var elementCouldBeVScrolled = function (node) {
    var styles = window.getComputedStyle(node);
    return (styles.overflowY !== 'hidden' && // not-not-scrollable
        !(styles.overflowY === styles.overflowX && styles.overflowY === 'visible') // scrollable
    );
};
var elementCouldBeHScrolled = function (node) {
    var styles = window.getComputedStyle(node);
    return (styles.overflowX !== 'hidden' && // not-not-scrollable
        !(styles.overflowY === styles.overflowX && styles.overflowX === 'visible') // scrollable
    );
};
var locationCouldBeScrolled = function (axis, node) {
    var current = node;
    do {
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), s = _a[1], d = _a[2];
            if (s > d) {
                return true;
            }
        }
        current = current.parentNode;
    } while (current && current !== document.body);
    return false;
};
var getVScrollVariables = function (_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [scrollTop, scrollHeight, clientHeight];
};
var getHScrollVariables = function (_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [scrollLeft, scrollWidth, clientWidth];
};
var elementCouldBeScrolled = function (axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function (axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var handleScroll = function (axis, endTarget, event, sourceDelta, noOverscroll) {
    var delta = sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        target = target.parentNode;
    } while (
    // portaled content
    (!targetInLock && target !== document.body) ||
        // self content
        (targetInLock && (endTarget.contains(target) || endTarget === target)));
    if (isDeltaPositive &&
        ((noOverscroll && availableScroll === 0) ||
            (!noOverscroll && delta > availableScroll))) {
        shouldCancelScroll = true;
    }
    else if (!isDeltaPositive &&
        ((noOverscroll && availableScrollTop === 0) ||
            (!noOverscroll && -delta > availableScrollTop))) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
                return true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
var nonPassive = passiveSupported ? { passive: false } : false;

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/SideEffect.js





var getTouchXY = function (event) {
    return 'changedTouches' in event
        ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
        : [0, 0];
};
var getDeltaXY = function (event) { return [event.deltaX, event.deltaY]; };
var SideEffect_extractRef = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function (x, y) {
    return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function (id) { return "\n  .block-interactivity-" + id + " {pointer-events: none;}\n  .allow-interactivity-" + id + " {pointer-events: all;}\n"; };
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = react.useRef([]);
    var touchStartRef = react.useRef([0, 0]);
    var activeAxis = react.useRef();
    var id = react.useState(idCounter++)[0];
    var Style = react.useState(function () { return styleSingleton(); })[0];
    var lastProps = react.useRef(props);
    react.useEffect(function () {
        lastProps.current = props;
    }, [props]);
    react.useEffect(function () {
        if (props.inert) {
            document.body.classList.add("block-interactivity-" + id);
            var allow_1 = [
                props.lockRef.current
            ].concat((props.shards || []).map(SideEffect_extractRef)).filter(Boolean);
            allow_1.forEach(function (el) { return el.classList.add("allow-interactivity-" + id); });
            return function () {
                document.body.classList.remove("block-interactivity-" + id);
                allow_1.forEach(function (el) {
                    return el.classList.remove("allow-interactivity-" + id);
                });
            };
        }
        return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = react.useCallback(function (event, parent) {
        if ('touches' in event && event.touches.length === 2) {
            return !lastProps.current.allowPinchZoom;
        }
        var touch = getTouchXY(event);
        var touchStart = touchStartRef.current;
        var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
        var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
        var currentAxis;
        var target = event.target;
        var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
        var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
        if (!canBeScrolledInMainDirection) {
            return true;
        }
        if (canBeScrolledInMainDirection) {
            currentAxis = moveDirection;
        }
        else {
            currentAxis = moveDirection === 'v' ? 'h' : 'v';
            canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
            // other axis might be not scrollable
        }
        if (!canBeScrolledInMainDirection) {
            return false;
        }
        if (!activeAxis.current &&
            'changedTouches' in event &&
            (deltaX || deltaY)) {
            activeAxis.current = currentAxis;
        }
        if (!currentAxis) {
            return true;
        }
        var cancelingAxis = activeAxis.current || currentAxis;
        return handleScroll(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = react.useCallback(function (_event) {
        var event = _event;
        if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
            // not the last active
            return;
        }
        var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
        var sourceEvent = shouldPreventQueue.current.filter(function (e) {
            return e.name === event.type &&
                e.target === event.target &&
                deltaCompare(e.delta, delta);
        })[0];
        // self event, and should be canceled
        if (sourceEvent && sourceEvent.should) {
            event.preventDefault();
            return;
        }
        // outside or shard event
        if (!sourceEvent) {
            var shardNodes = (lastProps.current.shards || [])
                .map(SideEffect_extractRef)
                .filter(Boolean)
                .filter(function (node) { return node.contains(event.target); });
            var shouldStop = shardNodes.length > 0
                ? shouldCancelEvent(event, shardNodes[0])
                : !lastProps.current.noIsolation;
            if (shouldStop) {
                event.preventDefault();
            }
        }
    }, []);
    var shouldCancel = react.useCallback(function (name, delta, target, should) {
        var event = { name: name, delta: delta, target: target, should: should };
        shouldPreventQueue.current.push(event);
        setTimeout(function () {
            shouldPreventQueue.current = shouldPreventQueue.current.filter(function (e) { return e !== event; });
        }, 1);
    }, []);
    var scrollTouchStart = react.useCallback(function (event) {
        touchStartRef.current = getTouchXY(event);
        activeAxis.current = undefined;
    }, []);
    var scrollWheel = react.useCallback(function (event) {
        shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = react.useCallback(function (event) {
        shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    react.useEffect(function () {
        lockStack.push(Style);
        props.setCallbacks({
            onScrollCapture: scrollWheel,
            onWheelCapture: scrollWheel,
            onTouchMoveCapture: scrollTouchMove
        });
        document.addEventListener('wheel', shouldPrevent, nonPassive);
        document.addEventListener('touchmove', shouldPrevent, nonPassive);
        document.addEventListener('touchstart', scrollTouchStart, nonPassive);
        return function () {
            lockStack = lockStack.filter(function (inst) { return inst !== Style; });
            document.removeEventListener('wheel', shouldPrevent, nonPassive);
            document.removeEventListener('touchmove', shouldPrevent, nonPassive);
            document.removeEventListener('touchstart', scrollTouchStart, nonPassive);
        };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return (react.createElement(react.Fragment, null,
        inert ? react.createElement(Style, { styles: generateStyle(id) }) : null,
        removeScrollBar ? react.createElement(RemoveScrollBar, { gapMode: "margin" }) : null));
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/sidecar.js



/* harmony default export */ var sidecar = (exportSidecar(effectCar, RemoveScrollSideCar));

;// CONCATENATED MODULE: ./node_modules/.pnpm/react-remove-scroll@2.4.1_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/react-remove-scroll/dist/es2015/Combination.js




var ReactRemoveScroll = react.forwardRef(function (props, ref) { return (react.createElement(RemoveScroll, __assign({}, props, { ref: ref, sideCar: sidecar }))); });
ReactRemoveScroll.classNames = RemoveScroll.classNames;
/* harmony default export */ var es2015_Combination = (ReactRemoveScroll);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+transition@1.3.6_6e811357ed36e65ef860931c3f3c4cd0/node_modules/@chakra-ui/transition/dist/esm/slide-fade.js
function slide_fade_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function slide_fade_extends() { slide_fade_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return slide_fade_extends.apply(this, arguments); }





var slide_fade_variants = {
  initial: (_ref) => {
    var _transition$exit;

    var {
      offsetX,
      offsetY,
      transition,
      transitionEnd,
      delay
    } = _ref;
    return {
      opacity: 0,
      x: offsetX,
      y: offsetY,
      transition: (_transition$exit = transition == null ? void 0 : transition.exit) != null ? _transition$exit : withDelay.exit(TransitionDefaults.exit, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    };
  },
  enter: (_ref2) => {
    var _transition$enter;

    var {
      transition,
      transitionEnd,
      delay
    } = _ref2;
    return {
      opacity: 1,
      x: 0,
      y: 0,
      transition: (_transition$enter = transition == null ? void 0 : transition.enter) != null ? _transition$enter : withDelay.enter(TransitionDefaults.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  },
  exit: (_ref3) => {
    var _transition$exit2;

    var {
      offsetY,
      offsetX,
      transition,
      transitionEnd,
      reverse,
      delay
    } = _ref3;
    var offset = {
      x: offsetX,
      y: offsetY
    };
    return slide_fade_extends({
      opacity: 0,
      transition: (_transition$exit2 = transition == null ? void 0 : transition.exit) != null ? _transition$exit2 : withDelay.exit(TransitionDefaults.exit, delay)
    }, reverse ? slide_fade_extends({}, offset, {
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    }) : {
      transitionEnd: slide_fade_extends({}, offset, transitionEnd == null ? void 0 : transitionEnd.exit)
    });
  }
};
var slideFadeConfig = {
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants: slide_fade_variants
};
var SlideFade = /*#__PURE__*/react.forwardRef((props, ref) => {
  var {
    unmountOnExit,
    in: isOpen,
    reverse = true,
    className,
    offsetX = 0,
    offsetY = 8,
    transition,
    transitionEnd,
    delay
  } = props,
      rest = slide_fade_objectWithoutPropertiesLoose(props, ["unmountOnExit", "in", "reverse", "className", "offsetX", "offsetY", "transition", "transitionEnd", "delay"]);

  var show = unmountOnExit ? isOpen && unmountOnExit : true;
  var animate = isOpen || unmountOnExit ? "enter" : "exit";
  var custom = {
    offsetX,
    offsetY,
    reverse,
    transition,
    transitionEnd,
    delay
  };
  return /*#__PURE__*/react.createElement(AnimatePresence/* AnimatePresence */.M, {
    custom: custom
  }, show && /*#__PURE__*/react.createElement(motion/* motion.div */.E.div, slide_fade_extends({
    ref: ref,
    className: (0,dom.cx)("chakra-offset-slide", className),
    custom: custom
  }, slideFadeConfig, {
    animate: animate
  }, rest)));
});

if (assertion/* __DEV__ */.Ts) {
  SlideFade.displayName = "SlideFade";
}
//# sourceMappingURL=slide-fade.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+transition@1.3.6_6e811357ed36e65ef860931c3f3c4cd0/node_modules/@chakra-ui/transition/dist/esm/scale-fade.js
function scale_fade_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function scale_fade_extends() { scale_fade_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return scale_fade_extends.apply(this, arguments); }





var scale_fade_variants = {
  exit: (_ref) => {
    var _transition$exit;

    var {
      reverse,
      initialScale,
      transition,
      transitionEnd,
      delay
    } = _ref;
    return scale_fade_extends({
      opacity: 0
    }, reverse ? {
      scale: initialScale,
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    } : {
      transitionEnd: scale_fade_extends({
        scale: initialScale
      }, transitionEnd == null ? void 0 : transitionEnd.exit)
    }, {
      transition: (_transition$exit = transition == null ? void 0 : transition.exit) != null ? _transition$exit : withDelay.exit(TransitionDefaults.exit, delay)
    });
  },
  enter: (_ref2) => {
    var _transition$enter;

    var {
      transitionEnd,
      transition,
      delay
    } = _ref2;
    return {
      opacity: 1,
      scale: 1,
      transition: (_transition$enter = transition == null ? void 0 : transition.enter) != null ? _transition$enter : withDelay.enter(TransitionDefaults.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  }
};
var scaleFadeConfig = {
  initial: "exit",
  animate: "enter",
  exit: "exit",
  variants: scale_fade_variants
};
var ScaleFade = /*#__PURE__*/react.forwardRef((props, ref) => {
  var {
    unmountOnExit,
    in: isOpen,
    reverse = true,
    initialScale = 0.95,
    className,
    transition,
    transitionEnd,
    delay
  } = props,
      rest = scale_fade_objectWithoutPropertiesLoose(props, ["unmountOnExit", "in", "reverse", "initialScale", "className", "transition", "transitionEnd", "delay"]);

  var show = unmountOnExit ? isOpen && unmountOnExit : true;
  var animate = isOpen || unmountOnExit ? "enter" : "exit";
  var custom = {
    initialScale,
    reverse,
    transition,
    transitionEnd,
    delay
  };
  return /*#__PURE__*/react.createElement(AnimatePresence/* AnimatePresence */.M, {
    custom: custom
  }, show && /*#__PURE__*/react.createElement(motion/* motion.div */.E.div, scale_fade_extends({
    ref: ref,
    className: (0,dom.cx)("chakra-offset-slide", className)
  }, scaleFadeConfig, {
    animate: animate,
    custom: custom
  }, rest)));
});

if (assertion/* __DEV__ */.Ts) {
  ScaleFade.displayName = "ScaleFade";
}
//# sourceMappingURL=scale-fade.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+modal@1.9.2_cacd6ee922b9c38ab3f71436888dc32b/node_modules/@chakra-ui/modal/dist/esm/modal-transition.js
function modal_transition_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function modal_transition_extends() { modal_transition_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return modal_transition_extends.apply(this, arguments); }





var transitions = {
  slideInBottom: modal_transition_extends({}, slideFadeConfig, {
    custom: {
      offsetY: 16,
      reverse: true
    }
  }),
  slideInRight: modal_transition_extends({}, slideFadeConfig, {
    custom: {
      offsetX: 16,
      reverse: true
    }
  }),
  scale: modal_transition_extends({}, scaleFadeConfig, {
    custom: {
      initialScale: 0.95,
      reverse: true
    }
  }),
  none: {}
};
var Motion = (0,system/* chakra */.m$)(motion/* motion.section */.E.section);
var ModalTransition = /*#__PURE__*/react.forwardRef((props, ref) => {
  var {
    preset
  } = props,
      rest = modal_transition_objectWithoutPropertiesLoose(props, ["preset"]);

  var motionProps = transitions[preset];
  return /*#__PURE__*/react.createElement(Motion, modal_transition_extends({
    ref: ref
  }, motionProps, rest));
});
//# sourceMappingURL=modal-transition.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-id.js
var use_id = __webpack_require__(9146);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+react-utils@1.1.2_react@17.0.2/node_modules/@chakra-ui/react-utils/dist/esm/refs.js
var refs = __webpack_require__(5559);
;// CONCATENATED MODULE: ./node_modules/.pnpm/aria-hidden@1.1.3/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (parentNode === void 0) { parentNode = getDefaultParent(originalTarget); }
    if (markerName === void 0) { markerName = "data-aria-hidden"; }
    var targets = Array.isArray(originalTarget) ? originalTarget : [originalTarget];
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var keep = (function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    });
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || targets.indexOf(parent) >= 0) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                var attr = node.getAttribute('aria-hidden');
                var alreadyHidden = attr !== null && attr !== 'false';
                var counterValue = (counterMap.get(node) || 0) + 1;
                var markerValue = (markerCounter.get(node) || 0) + 1;
                counterMap.set(node, counterValue);
                markerCounter.set(node, markerValue);
                hiddenNodes.push(node);
                if (counterValue === 1 && alreadyHidden) {
                    uncontrolledNodes.set(node, true);
                }
                if (markerValue === 1) {
                    node.setAttribute(markerName, 'true');
                }
                if (!alreadyHidden) {
                    node.setAttribute('aria-hidden', 'true');
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute('aria-hidden');
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+modal@1.9.2_cacd6ee922b9c38ab3f71436888dc32b/node_modules/@chakra-ui/modal/dist/esm/modal-manager.js
function modal_manager_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/**
 * Proper state management for nested modals.
 * Simplified, but inspired by material-ui's ModalManager class.
 */

class ModalManager {
  constructor() {
    modal_manager_defineProperty(this, "modals", void 0);

    this.modals = [];
  }

  add(modal) {
    this.modals.push(modal);
  }

  remove(modal) {
    this.modals = this.modals.filter(_modal => _modal !== modal);
  }

  isTopModal(modal) {
    var topmostModal = this.modals[this.modals.length - 1];
    return topmostModal === modal;
  }

}

var manager = new ModalManager();
function useModalManager(ref, isOpen) {
  (0,react.useEffect)(() => {
    if (isOpen) {
      manager.add(ref);
    }

    return () => {
      manager.remove(ref);
    };
  }, [isOpen, ref]);
}
//# sourceMappingURL=modal-manager.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+modal@1.9.2_cacd6ee922b9c38ab3f71436888dc32b/node_modules/@chakra-ui/modal/dist/esm/use-modal.js
function use_modal_extends() { use_modal_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return use_modal_extends.apply(this, arguments); }








/**
 * Modal hook that manages all the logic for the modal dialog widget
 * and returns prop getters, state and actions.
 *
 * @param props
 */
function useModal(props) {
  var {
    isOpen,
    onClose,
    id,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    useInert = true,
    onOverlayClick: onOverlayClickProp,
    onEsc
  } = props;
  var dialogRef = (0,react.useRef)(null);
  var overlayRef = (0,react.useRef)(null);
  var [dialogId, headerId, bodyId] = (0,use_id/* useIds */.ZS)(id, "chakra-modal", "chakra-modal--header", "chakra-modal--body");
  /**
   * Hook used to polyfill `aria-modal` for older browsers.
   * It uses `aria-hidden` to all other nodes.
   *
   * @see https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
   */

  useAriaHidden(dialogRef, isOpen && useInert);
  /**
   * Hook use to manage multiple or nested modals
   */

  useModalManager(dialogRef, isOpen);
  var mouseDownTarget = (0,react.useRef)(null);
  var onMouseDown = (0,react.useCallback)(event => {
    mouseDownTarget.current = event.target;
  }, []);
  var onKeyDown = (0,react.useCallback)(event => {
    if (event.key === "Escape") {
      event.stopPropagation();

      if (closeOnEsc) {
        onClose == null ? void 0 : onClose();
      }

      onEsc == null ? void 0 : onEsc();
    }
  }, [closeOnEsc, onClose, onEsc]);
  var [headerMounted, setHeaderMounted] = (0,react.useState)(false);
  var [bodyMounted, setBodyMounted] = (0,react.useState)(false);
  var getDialogProps = (0,react.useCallback)(function (props, ref) {
    if (props === void 0) {
      props = {};
    }

    if (ref === void 0) {
      ref = null;
    }

    return use_modal_extends({
      role: "dialog"
    }, props, {
      ref: (0,refs/* mergeRefs */.l)(ref, dialogRef),
      id: dialogId,
      tabIndex: -1,
      "aria-modal": true,
      "aria-labelledby": headerMounted ? headerId : undefined,
      "aria-describedby": bodyMounted ? bodyId : undefined,
      onClick: (0,esm_function/* callAllHandlers */.v0)(props.onClick, event => event.stopPropagation())
    });
  }, [bodyId, bodyMounted, dialogId, headerId, headerMounted]);
  var onOverlayClick = (0,react.useCallback)(event => {
    event.stopPropagation();
    /**
     * Make sure the event starts and ends on the same DOM element.
     *
     * This is used to prevent the modal from closing when you
     * start dragging from the content, and release drag outside the content.
     *
     * We prevent this because it is technically not a considered "click outside"
     */

    if (mouseDownTarget.current !== event.target) return;
    /**
     * When you click on the overlay, we want to remove only the topmost modal
     */

    if (!manager.isTopModal(dialogRef)) return;

    if (closeOnOverlayClick) {
      onClose == null ? void 0 : onClose();
    }

    onOverlayClickProp == null ? void 0 : onOverlayClickProp();
  }, [onClose, closeOnOverlayClick, onOverlayClickProp]);
  var getDialogContainerProps = (0,react.useCallback)(function (props, ref) {
    if (props === void 0) {
      props = {};
    }

    if (ref === void 0) {
      ref = null;
    }

    return use_modal_extends({}, props, {
      ref: (0,refs/* mergeRefs */.l)(ref, overlayRef),
      onClick: (0,esm_function/* callAllHandlers */.v0)(props.onClick, onOverlayClick),
      onKeyDown: (0,esm_function/* callAllHandlers */.v0)(props.onKeyDown, onKeyDown),
      onMouseDown: (0,esm_function/* callAllHandlers */.v0)(props.onMouseDown, onMouseDown)
    });
  }, [onKeyDown, onMouseDown, onOverlayClick]);
  return {
    isOpen,
    onClose,
    headerId,
    bodyId,
    setBodyMounted,
    setHeaderMounted,
    dialogRef,
    overlayRef,
    getDialogProps,
    getDialogContainerProps
  };
}

/**
 * Modal hook to polyfill `aria-modal`.
 *
 * It applies `aria-hidden` to elements behind the modal
 * to indicate that they're `inert`.
 *
 * @param ref React ref of the node
 * @param shouldHide whether `aria-hidden` should be applied
 */
function useAriaHidden(ref, shouldHide) {
  (0,react.useEffect)(() => {
    if (!ref.current) return undefined;
    var undo = null;

    if (shouldHide && ref.current) {
      undo = hideOthers(ref.current);
    }

    return () => {
      if (shouldHide) {
        undo == null ? void 0 : undo();
      }
    };
  }, [shouldHide, ref]);
}
//# sourceMappingURL=use-modal.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+modal@1.9.2_cacd6ee922b9c38ab3f71436888dc32b/node_modules/@chakra-ui/modal/dist/esm/modal.js
function modal_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function modal_extends() { modal_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return modal_extends.apply(this, arguments); }













var [ModalContextProvider, useModalContext] = (0,context/* createContext */.k)({
  strict: true,
  name: "ModalContext",
  errorMessage: "useModalContext: `context` is undefined. Seems you forgot to wrap modal components in `<Modal />`"
});

/**
 * Modal provides context, theming, and accessibility properties
 * to all other modal components.
 *
 * It doesn't render any DOM node.
 */

var Modal = props => {
  var {
    portalProps,
    children,
    autoFocus,
    trapFocus,
    initialFocusRef,
    finalFocusRef,
    returnFocusOnClose,
    blockScrollOnMount,
    allowPinchZoom,
    preserveScrollBarGap,
    motionPreset,
    lockFocusAcrossFrames
  } = props;
  var styles = (0,use_style_config/* useMultiStyleConfig */.j)("Modal", props);
  var modal = useModal(props);

  var context = modal_extends({}, modal, {
    autoFocus,
    trapFocus,
    initialFocusRef,
    finalFocusRef,
    returnFocusOnClose,
    blockScrollOnMount,
    allowPinchZoom,
    preserveScrollBarGap,
    motionPreset,
    lockFocusAcrossFrames
  });

  return /*#__PURE__*/react.createElement(ModalContextProvider, {
    value: context
  }, /*#__PURE__*/react.createElement(providers/* StylesProvider */.Fo, {
    value: styles
  }, /*#__PURE__*/react.createElement(AnimatePresence/* AnimatePresence */.M, null, context.isOpen && /*#__PURE__*/react.createElement(Portal, portalProps, children))));
};
Modal.defaultProps = {
  lockFocusAcrossFrames: true,
  returnFocusOnClose: true,
  scrollBehavior: "outside",
  trapFocus: true,
  autoFocus: true,
  blockScrollOnMount: true,
  allowPinchZoom: false,
  motionPreset: "scale"
};

if (assertion/* __DEV__ */.Ts) {
  Modal.displayName = "Modal";
}

var MotionDiv = (0,system/* chakra */.m$)(motion/* motion.div */.E.div);
/**
 * ModalContent is used to group modal's content. It has all the
 * necessary `aria-*` properties to indicate that it is a modal
 */

var ModalContent = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    className,
    children,
    containerProps: rootProps
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["className", "children", "containerProps"]);

  var {
    getDialogProps,
    getDialogContainerProps
  } = useModalContext();
  var dialogProps = getDialogProps(rest, ref);
  var containerProps = getDialogContainerProps(rootProps);

  var _className = (0,dom.cx)("chakra-modal__content", className);

  var styles = (0,providers/* useStyles */.yK)();

  var dialogStyles = modal_extends({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    outline: 0
  }, styles.dialog);

  var dialogContainerStyles = modal_extends({
    display: "flex",
    width: "100vw",
    height: "100vh",
    "@supports(height: -webkit-fill-available)": {
      height: "-webkit-fill-available"
    },
    position: "fixed",
    left: 0,
    top: 0
  }, styles.dialogContainer);

  var {
    motionPreset
  } = useModalContext();
  return /*#__PURE__*/react.createElement(ModalFocusScope, null, /*#__PURE__*/react.createElement(system/* chakra.div */.m$.div, modal_extends({}, containerProps, {
    className: "chakra-modal__content-container" // tabindex="-1" means that the element is not reachable via sequential keyboard navigation, @see #4686
    ,
    tabIndex: -1,
    __css: dialogContainerStyles
  }), /*#__PURE__*/react.createElement(ModalTransition, modal_extends({
    preset: motionPreset,
    className: _className
  }, dialogProps, {
    __css: dialogStyles
  }), children)));
});

if (assertion/* __DEV__ */.Ts) {
  ModalContent.displayName = "ModalContent";
}

function ModalFocusScope(props) {
  var {
    autoFocus,
    trapFocus,
    dialogRef,
    initialFocusRef,
    blockScrollOnMount,
    allowPinchZoom,
    finalFocusRef,
    returnFocusOnClose,
    preserveScrollBarGap,
    lockFocusAcrossFrames
  } = useModalContext();
  var [isPresent, safeToRemove] = (0,use_presence/* usePresence */.oO)();
  react.useEffect(() => {
    if (!isPresent && safeToRemove) {
      setTimeout(safeToRemove);
    }
  }, [isPresent, safeToRemove]);
  return /*#__PURE__*/react.createElement(esm_FocusLock, {
    autoFocus: autoFocus,
    isDisabled: !trapFocus,
    initialFocusRef: initialFocusRef,
    finalFocusRef: finalFocusRef,
    restoreFocus: returnFocusOnClose,
    contentRef: dialogRef,
    lockFocusAcrossFrames: lockFocusAcrossFrames
  }, /*#__PURE__*/react.createElement(es2015_Combination, {
    removeScrollBar: !preserveScrollBarGap,
    allowPinchZoom: allowPinchZoom,
    enabled: blockScrollOnMount,
    forwardProps: true
  }, props.children));
}

/**
 * ModalOverlay renders a backdrop behind the modal. It is
 * also used as a wrapper for the modal content for better positioning.
 *
 * @see Docs https://chakra-ui.com/modal
 */
var ModalOverlay = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    className
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["className", "transition"]);

  var _className = (0,dom.cx)("chakra-modal__overlay", className);

  var styles = (0,providers/* useStyles */.yK)();

  var overlayStyle = modal_extends({
    pos: "fixed",
    left: "0",
    top: "0",
    w: "100vw",
    h: "100vh"
  }, styles.overlay);

  var {
    motionPreset
  } = useModalContext();
  var motionProps = motionPreset === "none" ? {} : fadeConfig;
  return /*#__PURE__*/react.createElement(MotionDiv, modal_extends({}, motionProps, {
    __css: overlayStyle,
    ref: ref,
    className: _className
  }, rest));
});

if (assertion/* __DEV__ */.Ts) {
  ModalOverlay.displayName = "ModalOverlay";
}

/**
 * ModalHeader
 *
 * React component that houses the title of the modal.
 *
 * @see Docs https://chakra-ui.com/modal
 */
var ModalHeader = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    className
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["className"]);

  var {
    headerId,
    setHeaderMounted
  } = useModalContext();
  /**
   * Notify us if this component was rendered or used
   * so we can append `aria-labelledby` automatically
   */

  react.useEffect(() => {
    setHeaderMounted(true);
    return () => setHeaderMounted(false);
  }, [setHeaderMounted]);

  var _className = (0,dom.cx)("chakra-modal__header", className);

  var styles = (0,providers/* useStyles */.yK)();

  var headerStyles = modal_extends({
    flex: 0
  }, styles.header);

  return /*#__PURE__*/react.createElement(system/* chakra.header */.m$.header, modal_extends({
    ref: ref,
    className: _className,
    id: headerId
  }, rest, {
    __css: headerStyles
  }));
});

if (assertion/* __DEV__ */.Ts) {
  ModalHeader.displayName = "ModalHeader";
}

/**
 * ModalBody
 *
 * React component that houses the main content of the modal.
 *
 * @see Docs https://chakra-ui.com/modal
 */
var ModalBody = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    className
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["className"]);

  var {
    bodyId,
    setBodyMounted
  } = useModalContext();
  /**
   * Notify us if this component was rendered or used
   * so we can append `aria-describedby` automatically
   */

  react.useEffect(() => {
    setBodyMounted(true);
    return () => setBodyMounted(false);
  }, [setBodyMounted]);

  var _className = (0,dom.cx)("chakra-modal__body", className);

  var styles = (0,providers/* useStyles */.yK)();
  return /*#__PURE__*/react.createElement(system/* chakra.div */.m$.div, modal_extends({
    ref: ref,
    className: _className,
    id: bodyId
  }, rest, {
    __css: styles.body
  }));
});

if (assertion/* __DEV__ */.Ts) {
  ModalBody.displayName = "ModalBody";
}

/**
 * ModalFooter houses the action buttons of the modal.
 * @see Docs https://chakra-ui.com/modal
 */
var ModalFooter = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    className
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["className"]);

  var _className = (0,dom.cx)("chakra-modal__footer", className);

  var styles = (0,providers/* useStyles */.yK)();

  var footerStyles = modal_extends({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  }, styles.footer);

  return /*#__PURE__*/react.createElement(system/* chakra.footer */.m$.footer, modal_extends({
    ref: ref
  }, rest, {
    __css: footerStyles,
    className: _className
  }));
});

if (assertion/* __DEV__ */.Ts) {
  ModalFooter.displayName = "ModalFooter";
}
/**
 * ModalCloseButton is used closes the modal.
 *
 * You don't need to pass the `onClick` to it, it reads the
 * `onClose` action from the modal context.
 */


var ModalCloseButton = /*#__PURE__*/(0,forward_ref/* forwardRef */.G)((props, ref) => {
  var {
    onClick,
    className
  } = props,
      rest = modal_objectWithoutPropertiesLoose(props, ["onClick", "className"]);

  var {
    onClose
  } = useModalContext();

  var _className = (0,dom.cx)("chakra-modal__close-btn", className);

  var styles = (0,providers/* useStyles */.yK)();
  return /*#__PURE__*/react.createElement(close_button/* CloseButton */.P, modal_extends({
    ref: ref,
    __css: styles.closeButton,
    className: _className,
    onClick: (0,esm_function/* callAllHandlers */.v0)(onClick, event => {
      event.stopPropagation();
      onClose();
    })
  }, rest));
});

if (assertion/* __DEV__ */.Ts) {
  ModalCloseButton.displayName = "ModalCloseButton";
}
//# sourceMappingURL=modal.js.map

/***/ }),

/***/ 2069:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "D": function() { return /* binding */ CircularProgress; }
});

// UNUSED EXPORTS: CircularProgressLabel

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+system@1.7.4_5a47a31437ffba27a84f7efb2b21ce86/node_modules/@chakra-ui/system/dist/esm/system.js + 4 modules
var system = __webpack_require__(5631);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/assertion.js
var assertion = __webpack_require__(5621);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
// EXTERNAL MODULE: ./node_modules/.pnpm/@emotion+react@11.5.0_6d27d6abd5fcfff70e832fae7f4b0d02/node_modules/@emotion/react/dist/emotion-react.browser.esm.js
var emotion_react_browser_esm = __webpack_require__(7747);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+utils@1.8.3/node_modules/@chakra-ui/utils/dist/esm/number.js


var minSafeInteger = Number.MIN_SAFE_INTEGER || -9007199254740991;
var maxSafeInteger = Number.MAX_SAFE_INTEGER || 9007199254740991;

function toNumber(value) {
  var num = parseFloat(value);
  return isNotNumber(num) ? 0 : num;
}
/**
 * Converts a value to a specific precision (or decimal points).
 *
 * Returns a string representing a number in fixed-point notation.
 *
 * @param value the value to convert
 * @param precision the precision or decimal points
 */


function toPrecision(value, precision) {
  var nextValue = toNumber(value);
  var scaleFactor = 10 ** (precision != null ? precision : 10);
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor;
  return precision ? nextValue.toFixed(precision) : nextValue.toString();
}
/**
 * Counts the number of decimal places a number has
 *
 * @param value the decimal value to count
 */

function countDecimalPlaces(value) {
  if (!Number.isFinite(value)) return 0;
  var e = 1;
  var p = 0;

  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }

  return p;
}
/**
 * Convert a value to percentage based on lower and upper bound values
 *
 * @param value the value in number
 * @param min the minimum value
 * @param max the maximum value
 */

function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
}
/**
 * Calculate the value based on percentage, lower and upper bound values
 *
 * @param percent the percent value in decimals (e.g 0.6, 0.3)
 * @param min the minimum value
 * @param max the maximum value
 */

function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}
/**
 * Rounds a specific value to the next or previous step
 *
 * @param value the value to round
 * @param from the number that stepping started from
 * @param step the specified step
 */

function roundValueToStep(value, from, step) {
  var nextValue = Math.round((value - from) / step) * step + from;
  var precision = countDecimalPlaces(step);
  return toPrecision(nextValue, precision);
}
/**
 * Clamps a value to ensure it stays within the min and max range.
 *
 * @param value the value to clamp
 * @param min the minimum value
 * @param max the maximum value
 */

function clampValue(value, min, max) {
  if (value == null) return value;
  warn({
    condition: max < min,
    message: "clamp: max cannot be less than min"
  });
  return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=number.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+progress@1.1.15_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/progress/dist/esm/progress.utils.js


var spin = (0,emotion_react_browser_esm/* keyframes */.F4)({
  "0%": {
    strokeDasharray: "1, 400",
    strokeDashoffset: "0"
  },
  "50%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-100"
  },
  "100%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-260"
  }
});
var rotate = (0,emotion_react_browser_esm/* keyframes */.F4)({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
var progress = (0,emotion_react_browser_esm/* keyframes */.F4)({
  "0%": {
    left: "-40%"
  },
  "100%": {
    left: "100%"
  }
});
var stripe = (0,emotion_react_browser_esm/* keyframes */.F4)({
  from: {
    backgroundPosition: "1rem 0"
  },
  to: {
    backgroundPosition: "0 0"
  }
});

/**
 * Get the common `aria-*` attributes for both the linear and circular
 * progress components.
 */
function getProgressProps(options) {
  var {
    value = 0,
    min,
    max,
    valueText,
    getValueText,
    isIndeterminate
  } = options;
  var percent = valueToPercent(value, min, max);

  var getAriaValueText = () => {
    if (value == null) return undefined;
    return (0,assertion/* isFunction */.mf)(getValueText) ? getValueText(value, percent) : valueText;
  };

  return {
    bind: {
      "data-indeterminate": isIndeterminate ? "" : undefined,
      "aria-valuemax": max,
      "aria-valuemin": min,
      "aria-valuenow": isIndeterminate ? undefined : value,
      "aria-valuetext": getAriaValueText(),
      role: "progressbar"
    },
    percent,
    value
  };
}
//# sourceMappingURL=progress.utils.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/@chakra-ui+progress@1.1.15_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/progress/dist/esm/circular-progress.js
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }






var Circle = props => /*#__PURE__*/react.createElement(system/* chakra.circle */.m$.circle, _extends({
  cx: 50,
  cy: 50,
  r: 42,
  fill: "transparent"
}, props));

if (assertion/* __DEV__ */.Ts) {
  Circle.displayName = "Circle";
}

var Shape = props => {
  var {
    size,
    isIndeterminate
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["size", "isIndeterminate"]);

  return /*#__PURE__*/react.createElement(system/* chakra.svg */.m$.svg, _extends({
    viewBox: "0 0 100 100",
    __css: {
      width: size,
      height: size,
      animation: isIndeterminate ? rotate + " 2s linear infinite" : undefined
    }
  }, rest));
};

if (assertion/* __DEV__ */.Ts) {
  Shape.displayName = "Shape";
}

/**
 * CircularProgress is used to indicate the progress of an activity.
 * It is built using `svg` and `circle` components with support for
 * theming and `indeterminate` state
 *
 * @see Docs https://chakra-ui.com/circularprogress
 * @todo add theming support for circular progress
 */
var CircularProgress = props => {
  var _progress$percent;

  var {
    size = "48px",
    max = 100,
    min = 0,
    valueText,
    getValueText,
    value,
    capIsRound,
    children,
    thickness = "10px",
    color = "#0078d4",
    trackColor = "#edebe9",
    isIndeterminate
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["size", "max", "min", "valueText", "getValueText", "value", "capIsRound", "children", "thickness", "color", "trackColor", "isIndeterminate"]);

  var progress = getProgressProps({
    min,
    max,
    value,
    valueText,
    getValueText,
    isIndeterminate
  });
  var determinant = isIndeterminate ? undefined : ((_progress$percent = progress.percent) != null ? _progress$percent : 0) * 2.64;
  var strokeDasharray = (0,assertion/* isUndefined */.o8)(determinant) ? undefined : determinant + " " + (264 - determinant);
  var indicatorProps = isIndeterminate ? {
    css: {
      animation: spin + " 1.5s linear infinite"
    }
  } : {
    strokeDashoffset: 66,
    strokeDasharray,
    transitionProperty: "stroke-dasharray, stroke",
    transitionDuration: "0.6s",
    transitionTimingFunction: "ease"
  };
  var rootStyles = {
    display: "inline-block",
    position: "relative",
    verticalAlign: "middle",
    fontSize: size
  };
  return /*#__PURE__*/react.createElement(system/* chakra.div */.m$.div, _extends({
    className: "chakra-progress"
  }, progress.bind, rest, {
    __css: rootStyles
  }), /*#__PURE__*/react.createElement(Shape, {
    size: size,
    isIndeterminate: isIndeterminate
  }, /*#__PURE__*/react.createElement(Circle, {
    stroke: trackColor,
    strokeWidth: thickness,
    className: "chakra-progress__track"
  }), /*#__PURE__*/react.createElement(Circle, _extends({
    stroke: color,
    strokeWidth: thickness,
    className: "chakra-progress__indicator",
    strokeLinecap: capIsRound ? "round" : undefined
    /**
     * fix issue in Safari where indictor still shows when value is 0
     * @see Issue https://github.com/chakra-ui/chakra-ui/issues/3754
     */
    ,
    opacity: progress.value === 0 && !isIndeterminate ? 0 : undefined
  }, indicatorProps))), children);
};

if (assertion/* __DEV__ */.Ts) {
  CircularProgress.displayName = "CircularProgress";
}
/**
 * CircularProgress component label. In most cases it is a numeric indicator
 * of the circular progress component's value
 */


var CircularProgressLabel = (0,system/* chakra */.m$)("div", {
  baseStyle: {
    fontSize: "0.24em",
    top: "50%",
    left: "50%",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)"
  }
});

if (assertion/* __DEV__ */.Ts) {
  CircularProgressLabel.displayName = "CircularProgressLabel";
}
//# sourceMappingURL=circular-progress.js.map

/***/ }),

/***/ 5559:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": function() { return /* binding */ mergeRefs; }
/* harmony export */ });
/* unused harmony export assignRef */
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5621);


/**
 * Assigns a value to a ref function or object
 *
 * @param ref the ref to assign to
 * @param value the value
 */
function assignRef(ref, value) {
  if (ref == null) return;

  if ((0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_0__/* .isFunction */ .mf)(ref)) {
    ref(value);
    return;
  }

  try {
    // @ts-ignore
    ref.current = value;
  } catch (error) {
    throw new Error("Cannot assign value '" + value + "' to ref '" + ref + "'");
  }
}
/**
 * Combine multiple React refs into a single ref function.
 * This is used mostly when you need to allow consumers forward refs to
 * internal components
 *
 * @param refs refs to assign to value to
 */

function mergeRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return node => {
    refs.forEach(ref => assignRef(ref, node));
  };
}
//# sourceMappingURL=refs.js.map

/***/ }),

/***/ 683:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ph": function() { return /* binding */ Select; }
/* harmony export */ });
/* unused harmony exports SelectField, DefaultIcon */
/* harmony import */ var _chakra_ui_form_control__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4761);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3067);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5621);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3042);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1138);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var SelectField = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var {
    children,
    placeholder,
    className
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["children", "placeholder", "className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .chakra.select */ .m$.select, _extends({}, rest, {
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__.cx)("chakra-select", className)
  }), placeholder && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", {
    value: ""
  }, placeholder), children);
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .__DEV__ */ .Ts) {
  SelectField.displayName = "SelectField";
}

/**
 * React component used to select one item from a list of options.
 */
var Select = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .useMultiStyleConfig */ .j)("Select", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_6__/* .omitThemingProps */ .Lr)(props),
      {
    rootProps,
    placeholder,
    icon,
    color,
    height,
    h,
    minH,
    minHeight,
    iconColor,
    iconSize
  } = _omitThemingProps,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, ["rootProps", "placeholder", "icon", "color", "height", "h", "minH", "minHeight", "iconColor", "iconSize", "isFullWidth"]);

  var [layoutProps, otherProps] = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .split */ .Vl)(rest, _chakra_ui_system__WEBPACK_IMPORTED_MODULE_8__.layoutPropNames);
  var ownProps = (0,_chakra_ui_form_control__WEBPACK_IMPORTED_MODULE_9__/* .useFormControl */ .Y)(otherProps);
  var rootStyles = {
    width: "100%",
    height: "fit-content",
    position: "relative",
    color
  };
  var fieldStyles = _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_10___default()({}, styles.field, {
    paddingEnd: "2rem",
    _focus: {
      zIndex: "unset"
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .chakra.div */ .m$.div, _extends({
    className: "chakra-select__wrapper",
    __css: rootStyles
  }, layoutProps, rootProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(SelectField, _extends({
    ref: ref,
    height: h != null ? h : height,
    minH: minH != null ? minH : minHeight,
    placeholder: placeholder
  }, ownProps, {
    __css: fieldStyles
  }), props.children), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(SelectIcon, _extends({
    "data-disabled": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_3__/* .dataAttr */ .PB)(ownProps.disabled)
  }, (iconColor || color) && {
    color: iconColor || color
  }, {
    __css: styles.icon
  }, iconSize && {
    fontSize: iconSize
  }), icon));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .__DEV__ */ .Ts) {
  Select.displayName = "Select";
}

var DefaultIcon = props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
  viewBox: "0 0 24 24"
}, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
  fill: "currentColor",
  d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
}));
var IconWrapper = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .chakra */ .m$)("div", {
  baseStyle: {
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    top: "50%",
    transform: "translateY(-50%)"
  }
});

var SelectIcon = props => {
  var {
    children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultIcon, null)
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["children"]);

  var clone = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, {
    role: "presentation",
    className: "chakra-select__icon",
    focusable: false,
    "aria-hidden": true,
    // force icon to adhere to `IconWrapper` styles
    style: {
      width: "1em",
      height: "1em",
      color: "currentColor"
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(IconWrapper, _extends({}, rest, {
    className: "chakra-select__icon-wrapper"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children) ? clone : null);
};

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_4__/* .__DEV__ */ .Ts) {
  SelectIcon.displayName = "SelectIcon";
}
//# sourceMappingURL=select.js.map

/***/ }),

/***/ 4614:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": function() { return /* binding */ Switch; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7319);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8582);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3267);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5631);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2353);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5621);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var Switch = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .G)((props, ref) => {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_2__/* .useMultiStyleConfig */ .j)("Switch", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_3__/* .omitThemingProps */ .Lr)(props),
      {
    spacing = "0.5rem",
    children
  } = _omitThemingProps,
      ownProps = _objectWithoutPropertiesLoose(_omitThemingProps, ["spacing", "children"]);

  var {
    state,
    getInputProps,
    getCheckboxProps,
    getRootProps,
    getLabelProps
  } = (0,_chakra_ui_checkbox__WEBPACK_IMPORTED_MODULE_4__/* .useCheckbox */ .O)(ownProps);
  var containerStyles = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => _extends({
    display: "inline-block",
    verticalAlign: "middle",
    lineHeight: "normal"
  }, styles.container), [styles.container]);
  var trackStyles = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => _extends({
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "flex-start",
    boxSizing: "content-box",
    cursor: "pointer"
  }, styles.track), [styles.track]);
  var labelStyles = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => _extends({
    userSelect: "none",
    marginStart: spacing
  }, styles.label), [spacing, styles.label]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.label */ .m$.label, _extends({}, getRootProps(), {
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__.cx)("chakra-switch", props.className),
    __css: containerStyles
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", _extends({
    className: "chakra-switch__input"
  }, getInputProps({}, ref))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.span */ .m$.span, _extends({}, getCheckboxProps(), {
    className: "chakra-switch__track",
    __css: trackStyles
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.span */ .m$.span, {
    __css: styles.thumb,
    className: "chakra-switch__thumb",
    "data-checked": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(state.isChecked),
    "data-hover": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_6__/* .dataAttr */ .PB)(state.isHovered)
  })), children && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .chakra.span */ .m$.span, _extends({
    className: "chakra-switch__label"
  }, getLabelProps(), {
    __css: labelStyles
  }), children));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_7__/* .__DEV__ */ .Ts) {
  Switch.displayName = "Switch";
}
//# sourceMappingURL=switch.js.map

/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": function() { return /* binding */ focus; }
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2353);
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4006);
/* harmony import */ var _tabbable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3714);
// Original licensing for the following methods can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/calvellido/focus-options-polyfill
// See https://github.com/adobe/react-spectrum



function focus(element, options) {
  if (options === void 0) {
    options = {};
  }

  var {
    isActive = _tabbable__WEBPACK_IMPORTED_MODULE_0__/* .isActiveElement */ .H9,
    nextTick,
    preventScroll = true,
    selectTextIfInput = true
  } = options;
  if (!element || isActive(element)) return -1;

  function triggerFocus() {
    if (!element) {
      (0,_function__WEBPACK_IMPORTED_MODULE_1__/* .warn */ .ZK)({
        condition: true,
        message: "[chakra-ui]: can't call focus() on `null` or `undefined` element"
      });
      return;
    }

    if (supportsPreventScroll()) {
      element.focus({
        preventScroll
      });
    } else {
      element.focus();

      if (preventScroll) {
        var scrollableElements = getScrollableElements(element);
        restoreScrollPosition(scrollableElements);
      }
    }

    if ((0,_tabbable__WEBPACK_IMPORTED_MODULE_0__/* .isInputElement */ .cK)(element) && selectTextIfInput) {
      element.select();
    }
  }

  if (nextTick) {
    return requestAnimationFrame(triggerFocus);
  }

  triggerFocus();
  return -1;
}
var supportsPreventScrollCached = null;

function supportsPreventScroll() {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;

    try {
      var div = document.createElement("div");
      div.focus({
        get preventScroll() {
          supportsPreventScrollCached = true;
          return true;
        }

      });
    } catch (e) {// Ignore
    }
  }

  return supportsPreventScrollCached;
}

function getScrollableElements(element) {
  var _doc$defaultView;

  var doc = (0,_dom__WEBPACK_IMPORTED_MODULE_2__/* .getOwnerDocument */ .lZ)(element);
  var win = (_doc$defaultView = doc.defaultView) != null ? _doc$defaultView : window;
  var parent = element.parentNode;
  var scrollableElements = [];
  var rootScrollingElement = doc.scrollingElement || doc.documentElement;

  while (parent instanceof win.HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft
      });
    }

    parent = parent.parentNode;
  }

  if (rootScrollingElement instanceof win.HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft
    });
  }

  return scrollableElements;
}

function restoreScrollPosition(scrollableElements) {
  for (var {
    element,
    scrollTop,
    scrollLeft
  } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}
//# sourceMappingURL=focus.js.map

/***/ }),

/***/ 3714:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cK": function() { return /* binding */ isInputElement; },
/* harmony export */   "H9": function() { return /* binding */ isActiveElement; },
/* harmony export */   "EB": function() { return /* binding */ isFocusable; }
/* harmony export */ });
/* unused harmony exports hasDisplayNone, hasTabIndex, hasNegativeTabIndex, isDisabled, hasFocusWithin, isHidden, isContentEditable, isTabbable */
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2353);
// Really great work done by Diego Haz on this one
// https://github.com/reakit/reakit/blob/master/packages/reakit-utils/src/tabbable.ts

var hasDisplayNone = element => window.getComputedStyle(element).display === "none";
var hasTabIndex = element => element.hasAttribute("tabindex");
var hasNegativeTabIndex = element => hasTabIndex(element) && element.tabIndex === -1;
function isDisabled(element) {
  return Boolean(element.getAttribute("disabled")) === true || Boolean(element.getAttribute("aria-disabled")) === true;
}
function isInputElement(element) {
  return (0,_dom__WEBPACK_IMPORTED_MODULE_0__/* .isHTMLElement */ .Re)(element) && element.tagName.toLowerCase() === "input" && "select" in element;
}
function isActiveElement(element) {
  var doc = (0,_dom__WEBPACK_IMPORTED_MODULE_0__/* .isHTMLElement */ .Re)(element) ? (0,_dom__WEBPACK_IMPORTED_MODULE_0__/* .getOwnerDocument */ .lZ)(element) : document;
  return doc.activeElement === element;
}
function hasFocusWithin(element) {
  if (!document.activeElement) return false;
  return element.contains(document.activeElement);
}
function isHidden(element) {
  if (element.parentElement && isHidden(element.parentElement)) return true;
  return element.hidden;
}
function isContentEditable(element) {
  var value = element.getAttribute("contenteditable");
  return value !== "false" && value != null;
}
function isFocusable(element) {
  if (!(0,_dom__WEBPACK_IMPORTED_MODULE_0__/* .isHTMLElement */ .Re)(element) || isHidden(element) || isDisabled(element)) {
    return false;
  }

  var {
    localName
  } = element;
  var focusableTags = ["input", "select", "textarea", "button"];
  if (focusableTags.indexOf(localName) >= 0) return true;
  var others = {
    a: () => element.hasAttribute("href"),
    audio: () => element.hasAttribute("controls"),
    video: () => element.hasAttribute("controls")
  };

  if (localName in others) {
    return others[localName]();
  }

  if (isContentEditable(element)) return true;
  return hasTabIndex(element);
}
function isTabbable(element) {
  if (!element) return false;
  return isHTMLElement(element) && isFocusable(element) && !hasNegativeTabIndex(element);
}
//# sourceMappingURL=tabbable.js.map

/***/ }),

/***/ 4702:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ZP": function() { return /* reexport */ es_Editor; },
  "_m": function() { return /* reexport */ es_loader; },
  "Ik": function() { return /* reexport */ hooks_useMonaco; }
});

// UNUSED EXPORTS: DiffEditor

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}



;// CONCATENATED MODULE: ./node_modules/.pnpm/state-local@1.0.7/node_modules/state-local/lib/es/state-local.js
function state_local_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function state_local_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function state_local_objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      state_local_ownKeys(Object(source), true).forEach(function (key) {
        state_local_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      state_local_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
}

function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function isFunction(value) {
  return typeof value === 'function';
}

function state_local_hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function validateChanges(initial, changes) {
  if (!isObject(changes)) errorHandler('changeType');
  if (Object.keys(changes).some(function (field) {
    return !state_local_hasOwnProperty(initial, field);
  })) errorHandler('changeField');
  return changes;
}

function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler('selectorType');
}

function validateHandler(handler) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler('handlerType');
  if (isObject(handler) && Object.values(handler).some(function (_handler) {
    return !isFunction(_handler);
  })) errorHandler('handlersType');
}

function validateInitial(initial) {
  if (!initial) errorHandler('initialIsRequired');
  if (!isObject(initial)) errorHandler('initialType');
  if (isEmpty(initial)) errorHandler('initialContent');
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  initialIsRequired: 'initial state is required',
  initialType: 'initial state should be an object',
  initialContent: 'initial state shouldn\'t be an empty object',
  handlerType: 'handler should be an object or a function',
  handlersType: 'all handlers should be a functions',
  selectorType: 'selector should be a function',
  changeType: 'provided value of changes should be an object',
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": 'an unknown error accured in `state-local` package'
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};

function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  validators.initial(initial);
  validators.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry(didStateUpdate)(state, handler);
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);

  function getState() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
      return state;
    };
    validators.selector(selector);
    return selector(state.current);
  }

  function setState(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }

  return [getState, setState];
}

function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}

function updateState(state, changes) {
  state.current = state_local_objectSpread2(state_local_objectSpread2({}, state.current), changes);
  return changes;
}

function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function (field) {
    var _handler$field;

    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}

var index = {
  create: create
};

/* harmony default export */ var state_local = (index);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/config/index.js
var config = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.28.1/min/vs'
  }
};

/* harmony default export */ var es_config = (config);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/utils/curry.js
function curry_curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

/* harmony default export */ var utils_curry = (curry_curry);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
function isObject_isObject(value) {
  return {}.toString.call(value).includes('Object');
}

/* harmony default export */ var utils_isObject = (isObject_isObject);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/validators/index.js



/**
 * validates the configuration object and informs about deprecation
 * @param {Object} config - the configuration object 
 * @return {Object} config - the validated configuration object
 */

function validateConfig(config) {
  if (!config) validators_errorHandler('configIsRequired');
  if (!utils_isObject(config)) validators_errorHandler('configType');

  if (config.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config.urls.monacoBase
      }
    };
  }

  return config;
}
/**
 * logs deprecation message
 */


function informAboutDeprecation() {
  console.warn(validators_errorMessages.deprecation);
}

function validators_throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var validators_errorMessages = {
  configIsRequired: 'the configuration object is required',
  configType: 'the configuration object should be an object',
  "default": 'an unknown error accured in `@monaco-editor/loader` package',
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var validators_errorHandler = utils_curry(validators_throwError)(validators_errorMessages);
var validators_validators = {
  config: validateConfig
};

/* harmony default export */ var es_validators = (validators_validators);


;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/utils/compose.js
var compose_compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
};

/* harmony default export */ var utils_compose = (compose_compose);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js


function merge(target, source) {
  Object.keys(source).forEach(function (key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _objectSpread2(_objectSpread2({}, target), source);
}

/* harmony default export */ var deepMerge = (merge);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
// The source (has been changed) is https://github.com/facebook/react/issues/5465#issuecomment-157888325
var CANCELATION_MESSAGE = {
  type: 'cancelation',
  msg: 'operation is manually canceled'
};

function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function () {
    return hasCanceled_ = true;
  }, wrappedPromise;
}

/* harmony default export */ var utils_makeCancelable = (makeCancelable);


;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/loader/index.js








/** the local state of the module */

var _state$create = state_local.create({
  config: es_config,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}),
    _state$create2 = _slicedToArray(_state$create, 2),
    getState = _state$create2[0],
    setState = _state$create2[1];
/**
 * set the loader configuration
 * @param {Object} config - the configuration object
 */


function loader_config(config) {
  setState(function (state) {
    return {
      config: deepMerge(state.config, es_validators.config(config))
    };
  });
}
/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */


function init() {
  var state = getState(function (_ref) {
    var isInitialized = _ref.isInitialized;
    return {
      isInitialized: isInitialized
    };
  });

  if (!state.isInitialized) {
    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      return utils_makeCancelable(Promise.resolve(window.monaco));
    }

    utils_compose(injectScripts, getMonacoLoaderScript)(configureLoader);
    setState({
      isInitialized: true
    });
  }

  return utils_makeCancelable(wrapperPromise);
}
/**
 * injects provided scripts into the document.body
 * @param {Object} script - an HTML script element
 * @return {Object} - the injected HTML script element
 */


function injectScripts(script) {
  return document.body.appendChild(script);
}
/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {Object} - the created HTML script element
 */


function createScript(src) {
  var script = document.createElement('script');
  return src && (script.src = src), script;
}
/**
 * creates an HTML script element with the monaco loader src
 * @return {Object} - the created HTML script element
 */


function getMonacoLoaderScript(configureLoader) {
  var state = getState(function (_ref2) {
    var config = _ref2.config,
        reject = _ref2.reject;
    return {
      config: config,
      reject: reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));

  loaderScript.onload = function () {
    return configureLoader();
  };

  loaderScript.onerror = state.reject;
  return loaderScript;
}
/**
 * configures the monaco loader
 */


function configureLoader() {
  var state = getState(function (_ref3) {
    var config = _ref3.config,
        resolve = _ref3.resolve,
        reject = _ref3.reject;
    return {
      config: config,
      resolve: resolve,
      reject: reject
    };
  });
  var require = window.require;

  require.config(state.config);

  require(['vs/editor/editor.main'], function (monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function (error) {
    state.reject(error);
  });
}
/**
 * store monaco instance in local state
 */


function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco: monaco
    });
  }
}
/**
 * internal helper function
 * extracts stored monaco instance
 * @return {Object|null} - the monaco instance
 */


function __getMonacoInstance() {
  return getState(function (_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}

var wrapperPromise = new Promise(function (resolve, reject) {
  return setState({
    resolve: resolve,
    reject: reject
  });
});
var loader = {
  config: loader_config,
  init: init,
  __getMonacoInstance: __getMonacoInstance
};

/* harmony default export */ var es_loader = (loader);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+loader@1.2.0_monaco-editor@0.29.1/node_modules/@monaco-editor/loader/lib/es/index.js



// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
// EXTERNAL MODULE: ./node_modules/.pnpm/prop-types@15.7.2/node_modules/prop-types/index.js
var prop_types = __webpack_require__(9036);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/_virtual/_rollupPluginBabelHelpers.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}



;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/Loading/Loading.js


const loadingStyles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
};

function Loading({
  content
}) {
  return /*#__PURE__*/react.createElement("div", {
    style: loadingStyles
  }, content);
}

/* harmony default export */ var Loading_Loading = (Loading);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/MonacoContainer/styles.js
const styles = {
  wrapper: {
    display: 'flex',
    position: 'relative',
    textAlign: 'initial'
  },
  fullWidth: {
    width: '100%'
  },
  hide: {
    display: 'none'
  }
};

/* harmony default export */ var MonacoContainer_styles = (styles);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/MonacoContainer/MonacoContainer.js






// one of the reasons why we use a separate prop for passing ref instead of using forwardref

function MonacoContainer({
  width,
  height,
  isEditorReady,
  loading,
  _ref,
  className,
  wrapperProps
}) {
  return /*#__PURE__*/react.createElement("section", _extends({
    style: { ...MonacoContainer_styles.wrapper,
      width,
      height
    }
  }, wrapperProps), !isEditorReady && /*#__PURE__*/react.createElement(Loading_Loading, {
    content: loading
  }), /*#__PURE__*/react.createElement("div", {
    ref: _ref,
    style: { ...MonacoContainer_styles.fullWidth,
      ...(!isEditorReady && MonacoContainer_styles.hide)
    },
    className: className
  }));
}

MonacoContainer.propTypes = {
  width: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]).isRequired,
  height: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]).isRequired,
  loading: prop_types_default().oneOfType([(prop_types_default()).element, (prop_types_default()).string]).isRequired,
  isEditorReady: (prop_types_default()).bool.isRequired,
  className: (prop_types_default()).string,
  wrapperProps: (prop_types_default()).object
};

/* harmony default export */ var MonacoContainer_MonacoContainer = (MonacoContainer);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/MonacoContainer/index.js



var es_MonacoContainer_MonacoContainer = /*#__PURE__*/(0,react.memo)(MonacoContainer_MonacoContainer);

/* harmony default export */ var es_MonacoContainer = (es_MonacoContainer_MonacoContainer);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/hooks/useMount/index.js


function useMount(effect) {
  (0,react.useEffect)(effect, []);
}

/* harmony default export */ var hooks_useMount = (useMount);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/hooks/useUpdate/index.js


function useUpdate(effect, deps, applyChanges = true) {
  const isInitialMount = (0,react.useRef)(true);
  (0,react.useEffect)(isInitialMount.current || !applyChanges ? () => {
    isInitialMount.current = false;
  } : effect, deps);
}

/* harmony default export */ var hooks_useUpdate = (useUpdate);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/utils/index.js
function noop() {}

function getOrCreateModel(monaco, value, language, path) {
  return getModel(monaco, path) || createModel(monaco, value, language, path);
}

function getModel(monaco, path) {
  return monaco.editor.getModel(createModelUri(monaco, path));
}

function createModel(monaco, value, language, path) {
  return monaco.editor.createModel(value, language, path && createModelUri(monaco, path));
}

function createModelUri(monaco, path) {
  return monaco.Uri.parse(path);
}

function isUndefined(input) {
  return input === undefined;
}



;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/DiffEditor/DiffEditor.js








function DiffEditor({
  original,
  modified,
  language,
  originalLanguage,
  modifiedLanguage,

  /* === */
  originalModelPath,
  modifiedModelPath,
  keepCurrentOriginalModel,
  keepCurrentModifiedModel,
  theme,
  loading,
  options,

  /* === */
  height,
  width,
  className,
  wrapperProps,

  /* === */
  beforeMount,
  onMount
}) {
  const [isEditorReady, setIsEditorReady] = (0,react.useState)(false);
  const [isMonacoMounting, setIsMonacoMounting] = (0,react.useState)(true);
  const editorRef = (0,react.useRef)(null);
  const monacoRef = (0,react.useRef)(null);
  const containerRef = (0,react.useRef)(null);
  const onMountRef = (0,react.useRef)(onMount);
  const beforeMountRef = (0,react.useRef)(beforeMount);
  hooks_useMount(() => {
    const cancelable = es_loader.init();
    cancelable.then(monaco => (monacoRef.current = monaco) && setIsMonacoMounting(false)).catch(error => (error === null || error === void 0 ? void 0 : error.type) !== 'cancelation' && console.error('Monaco initialization: error:', error));
    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  });
  hooks_useUpdate(() => {
    const modifiedEditor = editorRef.current.getModifiedEditor();

    if (modifiedEditor.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      modifiedEditor.setValue(modified);
    } else {
      if (modified !== modifiedEditor.getValue()) {
        modifiedEditor.executeEdits('', [{
          range: modifiedEditor.getModel().getFullModelRange(),
          text: modified,
          forceMoveMarkers: true
        }]);
        modifiedEditor.pushUndoStop();
      }
    }
  }, [modified], isEditorReady);
  hooks_useUpdate(() => {
    editorRef.current.getModel().original.setValue(original);
  }, [original], isEditorReady);
  hooks_useUpdate(() => {
    const {
      original,
      modified
    } = editorRef.current.getModel();
    monacoRef.current.editor.setModelLanguage(original, originalLanguage || language);
    monacoRef.current.editor.setModelLanguage(modified, modifiedLanguage || language);
  }, [language, originalLanguage, modifiedLanguage], isEditorReady);
  hooks_useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);
  hooks_useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);
  const setModels = (0,react.useCallback)(() => {
    beforeMountRef.current(monacoRef.current);
    const originalModel = getOrCreateModel(monacoRef.current, original, originalLanguage || language, originalModelPath);
    const modifiedModel = getOrCreateModel(monacoRef.current, modified, modifiedLanguage || language, modifiedModelPath);
    editorRef.current.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }, [language, modified, modifiedLanguage, original, originalLanguage, originalModelPath, modifiedModelPath]);
  const createEditor = (0,react.useCallback)(() => {
    editorRef.current = monacoRef.current.editor.createDiffEditor(containerRef.current, {
      automaticLayout: true,
      ...options
    });
    setModels();
    monacoRef.current.editor.setTheme(theme);
    setIsEditorReady(true);
  }, [options, theme, setModels]);
  (0,react.useEffect)(() => {
    if (isEditorReady) {
      onMountRef.current(editorRef.current, monacoRef.current);
    }
  }, [isEditorReady]);
  (0,react.useEffect)(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);

  function disposeEditor() {
    const models = editorRef.current.getModel();

    if (!keepCurrentOriginalModel) {
      var _models$original;

      (_models$original = models.original) === null || _models$original === void 0 ? void 0 : _models$original.dispose();
    }

    if (!keepCurrentModifiedModel) {
      var _models$modified;

      (_models$modified = models.modified) === null || _models$modified === void 0 ? void 0 : _models$modified.dispose();
    }

    editorRef.current.dispose();
  }

  return /*#__PURE__*/react.createElement(es_MonacoContainer, {
    width: width,
    height: height,
    isEditorReady: isEditorReady,
    loading: loading,
    _ref: containerRef,
    className: className,
    wrapperProps: wrapperProps
  });
}

DiffEditor.propTypes = {
  original: (prop_types_default()).string,
  modified: (prop_types_default()).string,
  language: (prop_types_default()).string,
  originalLanguage: (prop_types_default()).string,
  modifiedLanguage: (prop_types_default()).string,

  /* === */
  originalModelPath: (prop_types_default()).string,
  modifiedModelPath: (prop_types_default()).string,
  keepCurrentOriginalModel: (prop_types_default()).bool,
  keepCurrentModifiedModel: (prop_types_default()).bool,
  theme: (prop_types_default()).string,
  loading: prop_types_default().oneOfType([(prop_types_default()).element, (prop_types_default()).string]),
  options: (prop_types_default()).object,

  /* === */
  width: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]),
  height: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]),
  className: (prop_types_default()).string,
  wrapperProps: (prop_types_default()).object,

  /* === */
  beforeMount: (prop_types_default()).func,
  onMount: (prop_types_default()).func
};
DiffEditor.defaultProps = {
  theme: 'light',
  loading: 'Loading...',
  options: {},
  keepCurrentOriginalModel: false,
  keepCurrentModifiedModel: false,

  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},

  /* === */
  beforeMount: noop,
  onMount: noop
};

/* harmony default export */ var DiffEditor_DiffEditor = (DiffEditor);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/DiffEditor/index.js



var DiffEditor_index = /*#__PURE__*/(0,react.memo)(DiffEditor_DiffEditor);

/* harmony default export */ var es_DiffEditor = ((/* unused pure expression or super */ null && (DiffEditor_index)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/hooks/useMonaco/index.js




function useMonaco() {
  const [monaco, setMonaco] = (0,react.useState)(es_loader.__getMonacoInstance());
  hooks_useMount(() => {
    let cancelable;

    if (!monaco) {
      cancelable = es_loader.init();
      cancelable.then(monaco => {
        setMonaco(monaco);
      });
    }

    return () => {
      var _cancelable;

      return (_cancelable = cancelable) === null || _cancelable === void 0 ? void 0 : _cancelable.cancel();
    };
  });
  return monaco;
}

/* harmony default export */ var hooks_useMonaco = (useMonaco);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/hooks/usePrevious/index.js


function usePrevious(value) {
  const ref = (0,react.useRef)();
  (0,react.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/* harmony default export */ var hooks_usePrevious = (usePrevious);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/Editor/Editor.js









const viewStates = new Map();

function Editor({
  defaultValue,
  defaultLanguage,
  defaultPath,
  value,
  language,
  path,

  /* === */
  theme,
  line,
  loading,
  options,
  overrideServices,
  saveViewState,
  keepCurrentModel,

  /* === */
  width,
  height,
  className,
  wrapperProps,

  /* === */
  beforeMount,
  onMount,
  onChange,
  onValidate
}) {
  const [isEditorReady, setIsEditorReady] = (0,react.useState)(false);
  const [isMonacoMounting, setIsMonacoMounting] = (0,react.useState)(true);
  const monacoRef = (0,react.useRef)(null);
  const editorRef = (0,react.useRef)(null);
  const containerRef = (0,react.useRef)(null);
  const onMountRef = (0,react.useRef)(onMount);
  const beforeMountRef = (0,react.useRef)(beforeMount);
  const subscriptionRef = (0,react.useRef)(null);
  const valueRef = (0,react.useRef)(value);
  const previousPath = hooks_usePrevious(path);
  hooks_useMount(() => {
    const cancelable = es_loader.init();
    cancelable.then(monaco => (monacoRef.current = monaco) && setIsMonacoMounting(false)).catch(error => (error === null || error === void 0 ? void 0 : error.type) !== 'cancelation' && console.error('Monaco initialization: error:', error));
    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  });
  hooks_useUpdate(() => {
    const model = getOrCreateModel(monacoRef.current, defaultValue || value, defaultLanguage || language, path);

    if (model !== editorRef.current.getModel()) {
      saveViewState && viewStates.set(previousPath, editorRef.current.saveViewState());
      editorRef.current.setModel(model);
      saveViewState && editorRef.current.restoreViewState(viewStates.get(path));
    }
  }, [path], isEditorReady);
  hooks_useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);
  hooks_useUpdate(() => {
    if (editorRef.current.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      editorRef.current.setValue(value);
    } else {
      if (value !== editorRef.current.getValue()) {
        editorRef.current.executeEdits('', [{
          range: editorRef.current.getModel().getFullModelRange(),
          text: value,
          forceMoveMarkers: true
        }]);
        editorRef.current.pushUndoStop();
      }
    }
  }, [value], isEditorReady);
  hooks_useUpdate(() => {
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [language], isEditorReady);
  hooks_useUpdate(() => {
    // reason for undefined check: https://github.com/suren-atoyan/monaco-react/pull/188
    if (!isUndefined(line)) {
      editorRef.current.revealLine(line);
    }
  }, [line], isEditorReady);
  hooks_useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);
  const createEditor = (0,react.useCallback)(() => {
    beforeMountRef.current(monacoRef.current);
    const autoCreatedModelPath = path || defaultPath;
    const defaultModel = getOrCreateModel(monacoRef.current, value || defaultValue, defaultLanguage || language, autoCreatedModelPath);
    editorRef.current = monacoRef.current.editor.create(containerRef.current, {
      model: defaultModel,
      automaticLayout: true,
      ...options
    }, overrideServices);
    saveViewState && editorRef.current.restoreViewState(viewStates.get(autoCreatedModelPath));
    monacoRef.current.editor.setTheme(theme);
    setIsEditorReady(true);
  }, [defaultValue, defaultLanguage, defaultPath, value, language, path, options, overrideServices, saveViewState, theme]);
  (0,react.useEffect)(() => {
    if (isEditorReady) {
      onMountRef.current(editorRef.current, monacoRef.current);
    }
  }, [isEditorReady]);
  (0,react.useEffect)(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]); // subscription
  // to avoid unnecessary updates (attach - dispose listener) in subscription

  valueRef.current = value;
  (0,react.useEffect)(() => {
    if (isEditorReady && onChange) {
      var _subscriptionRef$curr, _editorRef$current;

      (_subscriptionRef$curr = subscriptionRef.current) === null || _subscriptionRef$curr === void 0 ? void 0 : _subscriptionRef$curr.dispose();
      subscriptionRef.current = (_editorRef$current = editorRef.current) === null || _editorRef$current === void 0 ? void 0 : _editorRef$current.onDidChangeModelContent(event => {
        const editorValue = editorRef.current.getValue();

        if (valueRef.current !== editorValue) {
          onChange(editorValue, event);
        }
      });
    }
  }, [isEditorReady, onChange]); // onValidate

  (0,react.useEffect)(() => {
    if (isEditorReady) {
      const changeMarkersListener = monacoRef.current.editor.onDidChangeMarkers(uris => {
        var _editorRef$current$ge;

        const editorUri = (_editorRef$current$ge = editorRef.current.getModel()) === null || _editorRef$current$ge === void 0 ? void 0 : _editorRef$current$ge.uri;

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find(uri => uri.path === editorUri.path);

          if (currentEditorHasMarkerChanges) {
            const markers = monacoRef.current.editor.getModelMarkers({
              resource: editorUri
            });
            onValidate === null || onValidate === void 0 ? void 0 : onValidate(markers);
          }
        }
      });
      return () => {
        changeMarkersListener === null || changeMarkersListener === void 0 ? void 0 : changeMarkersListener.dispose();
      };
    }
  }, [isEditorReady, onValidate]);

  function disposeEditor() {
    var _subscriptionRef$curr2;

    (_subscriptionRef$curr2 = subscriptionRef.current) === null || _subscriptionRef$curr2 === void 0 ? void 0 : _subscriptionRef$curr2.dispose();

    if (keepCurrentModel) {
      saveViewState && viewStates.set(path, editorRef.current.saveViewState());
    } else {
      var _editorRef$current$ge2;

      (_editorRef$current$ge2 = editorRef.current.getModel()) === null || _editorRef$current$ge2 === void 0 ? void 0 : _editorRef$current$ge2.dispose();
    }

    editorRef.current.dispose();
  }

  return /*#__PURE__*/react.createElement(es_MonacoContainer, {
    width: width,
    height: height,
    isEditorReady: isEditorReady,
    loading: loading,
    _ref: containerRef,
    className: className,
    wrapperProps: wrapperProps
  });
}

Editor.propTypes = {
  defaultValue: (prop_types_default()).string,
  defaultPath: (prop_types_default()).string,
  defaultLanguage: (prop_types_default()).string,
  value: (prop_types_default()).string,
  language: (prop_types_default()).string,
  path: (prop_types_default()).string,

  /* === */
  theme: (prop_types_default()).string,
  line: (prop_types_default()).number,
  loading: prop_types_default().oneOfType([(prop_types_default()).element, (prop_types_default()).string]),
  options: (prop_types_default()).object,
  overrideServices: (prop_types_default()).object,
  saveViewState: (prop_types_default()).bool,
  keepCurrentModel: (prop_types_default()).bool,

  /* === */
  width: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]),
  height: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string]),
  className: (prop_types_default()).string,
  wrapperProps: (prop_types_default()).object,

  /* === */
  beforeMount: (prop_types_default()).func,
  onMount: (prop_types_default()).func,
  onChange: (prop_types_default()).func,
  onValidate: (prop_types_default()).func
};
Editor.defaultProps = {
  theme: 'light',
  loading: 'Loading...',
  options: {},
  overrideServices: {},
  saveViewState: true,
  keepCurrentModel: false,

  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},

  /* === */
  beforeMount: noop,
  onMount: noop,
  onValidate: noop
};

/* harmony default export */ var Editor_Editor = (Editor);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/Editor/index.js



var Editor_index = /*#__PURE__*/(0,react.memo)(Editor_Editor);

/* harmony default export */ var es_Editor = (Editor_index);

;// CONCATENATED MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/index.js






/***/ }),

/***/ 4968:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cn": function() { return /* binding */ atom; },
/* harmony export */   "KO": function() { return /* binding */ useAtom; }
/* harmony export */ });
/* unused harmony exports Provider, SECRET_INTERNAL_getScopeContext */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9496);
/* provided dependency */ var process = __webpack_require__(9517);


var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const hasInitialValue = (atom) => "init" in atom;
const IS_EQUAL_PROMISE = Symbol();
const INTERRUPT_PROMISE = Symbol();
const isInterruptablePromise = (promise) => !!promise[INTERRUPT_PROMISE];
const createInterruptablePromise = (promise) => {
  let interrupt;
  const interruptablePromise = new Promise((resolve, reject) => {
    interrupt = () => {
      delete interruptablePromise[INTERRUPT_PROMISE];
      resolve();
    };
    promise.then(resolve, reject);
  });
  interruptablePromise[IS_EQUAL_PROMISE] = (p) => interruptablePromise === p || promise === p || isInterruptablePromise(promise) && promise[IS_EQUAL_PROMISE](p);
  interruptablePromise[INTERRUPT_PROMISE] = interrupt;
  return interruptablePromise;
};
const READ_ATOM = "r";
const WRITE_ATOM = "w";
const COMMIT_ATOM = "c";
const SUBSCRIBE_ATOM = "s";
const RESTORE_ATOMS = "h";
const DEV_SUBSCRIBE_STATE = "n";
const DEV_GET_MOUNTED_ATOMS = "l";
const DEV_GET_ATOM_STATE = "a";
const DEV_GET_MOUNTED = "m";
const createStore = (initialValues) => {
  const atomStateMap = new WeakMap();
  const mountedMap = new WeakMap();
  const pendingMap = new Map();
  let stateListeners;
  let mountedAtoms;
  if (typeof process === "object" && "production" !== "production") {}
  if (initialValues) {
    for (const [atom, value] of initialValues) {
      const atomState = { v: value, r: 0, d: new Map() };
      if (typeof process === "object" && "production" !== "production") {}
      atomStateMap.set(atom, atomState);
    }
  }
  const getAtomState = (atom) => atomStateMap.get(atom);
  const setAtomState = (atom, atomState, prevDependencies) => {
    if (typeof process === "object" && "production" !== "production") {}
    const isNewAtom = !atomStateMap.has(atom);
    atomStateMap.set(atom, atomState);
    if (!pendingMap.has(atom)) {
      pendingMap.set(atom, [prevDependencies, isNewAtom]);
    }
  };
  const prepareNextAtomState = (atom, dependencies) => {
    const atomState = getAtomState(atom);
    const nextAtomState = __spreadProps(__spreadValues({
      r: 0
    }, atomState), {
      d: dependencies ? new Map(Array.from(dependencies).map((a) => {
        var _a, _b;
        return [a, (_b = (_a = getAtomState(a)) == null ? void 0 : _a.r) != null ? _b : 0];
      })) : (atomState == null ? void 0 : atomState.d) || new Map()
    });
    return [nextAtomState, (atomState == null ? void 0 : atomState.d) || new Map()];
  };
  const setAtomValue = (atom, value, dependencies, promise) => {
    var _a, _b;
    const [atomState, prevDependencies] = prepareNextAtomState(atom, dependencies);
    if (promise && !((_a = atomState.p) == null ? void 0 : _a[IS_EQUAL_PROMISE](promise))) {
      return;
    }
    (_b = atomState.c) == null ? void 0 : _b.call(atomState);
    if ("e" in atomState || atomState.p || !("v" in atomState) || !Object.is(atomState.v, value)) {
      ++atomState.r;
      if (atomState.d.has(atom)) {
        atomState.d.set(atom, atomState.r);
      }
    }
    atomState.v = value;
    delete atomState.e;
    delete atomState.p;
    delete atomState.c;
    delete atomState.i;
    setAtomState(atom, atomState, dependencies && prevDependencies);
  };
  const setAtomReadError = (atom, error, dependencies, promise) => {
    var _a, _b;
    const [atomState, prevDependencies] = prepareNextAtomState(atom, dependencies);
    if (promise && !((_a = atomState.p) == null ? void 0 : _a[IS_EQUAL_PROMISE](promise))) {
      return;
    }
    (_b = atomState.c) == null ? void 0 : _b.call(atomState);
    delete atomState.p;
    delete atomState.c;
    delete atomState.i;
    atomState.e = error;
    setAtomState(atom, atomState, prevDependencies);
  };
  const setAtomReadPromise = (atom, promise, dependencies) => {
    var _a, _b;
    const [atomState, prevDependencies] = prepareNextAtomState(atom, dependencies);
    if ((_a = atomState.p) == null ? void 0 : _a[IS_EQUAL_PROMISE](promise)) {
      return;
    }
    (_b = atomState.c) == null ? void 0 : _b.call(atomState);
    delete atomState.e;
    const interruptablePromise = createInterruptablePromise(promise);
    atomState.p = interruptablePromise;
    atomState.c = interruptablePromise[INTERRUPT_PROMISE];
    setAtomState(atom, atomState, prevDependencies);
  };
  const setAtomInvalidated = (atom) => {
    const [atomState] = prepareNextAtomState(atom);
    atomState.i = atomState.r;
    setAtomState(atom, atomState);
  };
  const readAtomState = (atom, force) => {
    if (!force) {
      const atomState = getAtomState(atom);
      if (atomState) {
        atomState.d.forEach((_, a) => {
          if (a !== atom) {
            if (!mountedMap.has(a)) {
              readAtomState(a);
            } else {
              const aState = getAtomState(a);
              if (aState && !("e" in aState) && !aState.p && aState.r === aState.i) {
                readAtomState(a, true);
              }
            }
          }
        });
        if (Array.from(atomState.d.entries()).every(([a, r]) => {
          const aState = getAtomState(a);
          return aState && !("e" in aState) && !aState.p && aState.r !== aState.i && aState.r === r;
        })) {
          return atomState;
        }
      }
    }
    let error;
    let promise;
    let value;
    const dependencies = new Set();
    try {
      const promiseOrValue = atom.read((a) => {
        dependencies.add(a);
        const aState = a === atom ? getAtomState(a) : readAtomState(a);
        if (aState) {
          if ("e" in aState) {
            throw aState.e;
          }
          if (aState.p) {
            throw aState.p;
          }
          return aState.v;
        }
        if (hasInitialValue(a)) {
          return a.init;
        }
        throw new Error("no atom init");
      });
      if (promiseOrValue instanceof Promise) {
        promise = promiseOrValue.then((value2) => {
          setAtomValue(atom, value2, dependencies, promise);
          flushPending();
        }).catch((e) => {
          if (e instanceof Promise) {
            if (!isInterruptablePromise(e) || !e[INTERRUPT_PROMISE]) {
              e.finally(() => readAtomState(atom, true));
            }
            return e;
          }
          setAtomReadError(atom, e, dependencies, promise);
          flushPending();
        });
      } else {
        value = promiseOrValue;
      }
    } catch (errorOrPromise) {
      if (errorOrPromise instanceof Promise) {
        promise = errorOrPromise;
      } else {
        error = errorOrPromise;
      }
    }
    if (error) {
      setAtomReadError(atom, error, dependencies);
    } else if (promise) {
      setAtomReadPromise(atom, promise, dependencies);
    } else {
      setAtomValue(atom, value, dependencies);
    }
    return getAtomState(atom);
  };
  const readAtom = (readingAtom) => {
    const atomState = readAtomState(readingAtom);
    return atomState;
  };
  const addAtom = (addingAtom) => {
    let mounted = mountedMap.get(addingAtom);
    if (!mounted) {
      mounted = mountAtom(addingAtom);
    }
    return mounted;
  };
  const canUnmountAtom = (atom, mounted) => !mounted.l.size && (!mounted.d.size || mounted.d.size === 1 && mounted.d.has(atom));
  const delAtom = (deletingAtom) => {
    const mounted = mountedMap.get(deletingAtom);
    if (mounted && canUnmountAtom(deletingAtom, mounted)) {
      unmountAtom(deletingAtom);
    }
  };
  const invalidateDependents = (atom) => {
    const mounted = mountedMap.get(atom);
    mounted == null ? void 0 : mounted.d.forEach((dependent) => {
      if (dependent === atom) {
        return;
      }
      setAtomInvalidated(dependent);
      invalidateDependents(dependent);
    });
  };
  const writeAtomState = (atom, update) => {
    const writeGetter = (a, unstable_promise = false) => {
      const aState = readAtomState(a);
      if ("e" in aState) {
        throw aState.e;
      }
      if (aState.p) {
        if (typeof process === "object" && "production" !== "production") {}
        if (unstable_promise) {
          return aState.p.then(() => writeGetter(a, unstable_promise));
        }
        throw aState.p;
      }
      if ("v" in aState) {
        return aState.v;
      }
      if (typeof process === "object" && "production" !== "production") {}
      throw new Error("no value found");
    };
    const setter = (a, v) => {
      let promiseOrVoid2;
      if (a === atom) {
        if (!hasInitialValue(a)) {
          throw new Error("no atom init");
        }
        if (v instanceof Promise) {
          promiseOrVoid2 = v.then((resolvedValue) => {
            setAtomValue(a, resolvedValue);
            invalidateDependents(a);
            flushPending();
          }).catch((e) => {
            setAtomReadError(atom, e);
            flushPending();
          });
          setAtomReadPromise(atom, promiseOrVoid2);
        } else {
          setAtomValue(a, v);
        }
        invalidateDependents(a);
        flushPending();
      } else {
        promiseOrVoid2 = writeAtomState(a, v);
      }
      return promiseOrVoid2;
    };
    const promiseOrVoid = atom.write(writeGetter, setter, update);
    flushPending();
    return promiseOrVoid;
  };
  const writeAtom = (writingAtom, update) => {
    const promiseOrVoid = writeAtomState(writingAtom, update);
    return promiseOrVoid;
  };
  const isActuallyWritableAtom = (atom) => !!atom.write;
  const mountAtom = (atom, initialDependent) => {
    const atomState = readAtomState(atom);
    atomState.d.forEach((_, a) => {
      if (a !== atom) {
        const aMounted = mountedMap.get(a);
        if (aMounted) {
          aMounted.d.add(atom);
        } else {
          mountAtom(a, atom);
        }
      }
    });
    const mounted = {
      d: new Set(initialDependent && [initialDependent]),
      l: new Set(),
      u: void 0
    };
    mountedMap.set(atom, mounted);
    if (typeof process === "object" && "production" !== "production") {}
    if (isActuallyWritableAtom(atom) && atom.onMount) {
      const setAtom = (update) => writeAtom(atom, update);
      mounted.u = atom.onMount(setAtom);
    }
    return mounted;
  };
  const unmountAtom = (atom) => {
    var _a;
    const onUnmount = (_a = mountedMap.get(atom)) == null ? void 0 : _a.u;
    if (onUnmount) {
      onUnmount();
    }
    mountedMap.delete(atom);
    if (typeof process === "object" && "production" !== "production") {}
    const atomState = getAtomState(atom);
    if (atomState) {
      atomState.d.forEach((_, a) => {
        if (a !== atom) {
          const mounted = mountedMap.get(a);
          if (mounted) {
            mounted.d.delete(atom);
            if (canUnmountAtom(a, mounted)) {
              unmountAtom(a);
            }
          }
        }
      });
    } else if (typeof process === "object" && "production" !== "production") {}
  };
  const mountDependencies = (atom, atomState, prevDependencies) => {
    const dependencies = new Set(atomState.d.keys());
    prevDependencies.forEach((_, a) => {
      if (dependencies.has(a)) {
        dependencies.delete(a);
        return;
      }
      const mounted = mountedMap.get(a);
      if (mounted) {
        mounted.d.delete(atom);
        if (canUnmountAtom(a, mounted)) {
          unmountAtom(a);
        }
      }
    });
    dependencies.forEach((a) => {
      const mounted = mountedMap.get(a);
      if (mounted) {
        const dependents = mounted.d;
        dependents.add(atom);
      } else {
        mountAtom(a, atom);
      }
    });
  };
  const flushPending = () => {
    const pending = Array.from(pendingMap);
    pendingMap.clear();
    pending.forEach(([atom, [prevDependencies, isNewAtom]]) => {
      if (prevDependencies) {
        const atomState = getAtomState(atom);
        if (atomState) {
          mountDependencies(atom, atomState, prevDependencies);
        }
      }
      const mounted = mountedMap.get(atom);
      mounted == null ? void 0 : mounted.l.forEach((listener) => listener());
      if (typeof process === "object" && "production" !== "production") {}
    });
  };
  const commitAtom = (_atom) => {
    flushPending();
  };
  const subscribeAtom = (atom, callback) => {
    const mounted = addAtom(atom);
    const listeners = mounted.l;
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
      delAtom(atom);
    };
  };
  const restoreAtoms = (values) => {
    for (const [atom, value] of values) {
      if (hasInitialValue(atom)) {
        setAtomValue(atom, value);
        invalidateDependents(atom);
      }
    }
    flushPending();
  };
  if (typeof process === "object" && "production" !== "production") {}
  return {
    [READ_ATOM]: readAtom,
    [WRITE_ATOM]: writeAtom,
    [COMMIT_ATOM]: commitAtom,
    [SUBSCRIBE_ATOM]: subscribeAtom,
    [RESTORE_ATOMS]: restoreAtoms
  };
};

const createScopeContainer = (initialValues) => {
  const store = createStore(initialValues);
  return { s: store };
};
const ScopeContextMap = new Map();
const getScopeContext = (scope) => {
  if (!ScopeContextMap.has(scope)) {
    ScopeContextMap.set(scope, (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(createScopeContainer()));
  }
  return ScopeContextMap.get(scope);
};

const Provider = ({
  initialValues,
  scope,
  children
}) => {
  const scopeContainerRef = useRef();
  if (!scopeContainerRef.current) {
    scopeContainerRef.current = createScopeContainer(initialValues);
  }
  if (typeof process === "object" && "production" !== "production" && 0) {}
  const ScopeContainerContext = getScopeContext(scope);
  return createElement(ScopeContainerContext.Provider, {
    value: scopeContainerRef.current
  }, children);
};
const atomToPrintable = (atom) => atom.debugLabel || atom.toString();
const stateToPrintable = ([store, atoms]) => Object.fromEntries(atoms.flatMap((atom) => {
  var _a, _b;
  const mounted = (_a = store[DEV_GET_MOUNTED]) == null ? void 0 : _a.call(store, atom);
  if (!mounted) {
    return [];
  }
  const dependents = mounted.d;
  const atomState = ((_b = store[DEV_GET_ATOM_STATE]) == null ? void 0 : _b.call(store, atom)) || {};
  return [
    [
      atomToPrintable(atom),
      {
        value: atomState.e || atomState.p || atomState.v,
        dependents: Array.from(dependents).map(atomToPrintable)
      }
    ]
  ];
}));
const useDebugState = (scopeContainer) => {
  const store = scopeContainer.s;
  const [atoms, setAtoms] = useState([]);
  useEffect(() => {
    var _a;
    const callback = () => {
      var _a2;
      setAtoms(Array.from(((_a2 = store[DEV_GET_MOUNTED_ATOMS]) == null ? void 0 : _a2.call(store)) || []));
    };
    const unsubscribe = (_a = store[DEV_SUBSCRIBE_STATE]) == null ? void 0 : _a.call(store, callback);
    callback();
    return unsubscribe;
  }, [store]);
  useDebugValue([store, atoms], stateToPrintable);
};

let keyCount = 0;
function atom(read, write) {
  const key = `atom${++keyCount}`;
  const config = {
    toString: () => key
  };
  if (typeof read === "function") {
    config.read = read;
  } else {
    config.init = read;
    config.read = (get) => get(config);
    config.write = (get, set, update) => set(config, typeof update === "function" ? update(get(config)) : update);
  }
  if (write) {
    config.write = write;
  }
  return config;
}

const isWritable = (atom) => !!atom.write;
function useAtom(atom, scope) {
  if ("scope" in atom) {
    console.warn("atom.scope is deprecated. Please do useAtom(atom, scope) instead.");
    scope = atom.scope;
  }
  const ScopeContext = getScopeContext(scope);
  const store = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ScopeContext).s;
  const getAtomValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const atomState = store[READ_ATOM](atom);
    if ("e" in atomState) {
      throw atomState.e;
    }
    if (atomState.p) {
      throw atomState.p;
    }
    if ("v" in atomState) {
      return atomState.v;
    }
    throw new Error("no atom value");
  }, [store, atom]);
  const [value, forceUpdate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(getAtomValue, void 0, getAtomValue);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const unsubscribe = store[SUBSCRIBE_ATOM](atom, forceUpdate);
    forceUpdate();
    return unsubscribe;
  }, [store, atom]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    store[COMMIT_ATOM](atom);
  });
  const setAtom = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((update) => {
    if (isWritable(atom)) {
      return store[WRITE_ATOM](atom, update);
    } else {
      throw new Error("not writable atom");
    }
  }, [store, atom]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useDebugValue)(value);
  return [value, setAtom];
}




/***/ }),

/***/ 9517:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__.g.process || __webpack_require__(3142);

//# sourceMappingURL=process.js.map

/***/ }),

/***/ 4676:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={991:function(e,r){"use strict";r.byteLength=byteLength;r.toByteArray=toByteArray;r.fromByteArray=fromByteArray;var t=[];var f=[];var n=typeof Uint8Array!=="undefined"?Uint8Array:Array;var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var o=0,u=i.length;o<u;++o){t[o]=i[o];f[i.charCodeAt(o)]=o}f["-".charCodeAt(0)]=62;f["_".charCodeAt(0)]=63;function getLens(e){var r=e.length;if(r%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var t=e.indexOf("=");if(t===-1)t=r;var f=t===r?0:4-t%4;return[t,f]}function byteLength(e){var r=getLens(e);var t=r[0];var f=r[1];return(t+f)*3/4-f}function _byteLength(e,r,t){return(r+t)*3/4-t}function toByteArray(e){var r;var t=getLens(e);var i=t[0];var o=t[1];var u=new n(_byteLength(e,i,o));var a=0;var s=o>0?i-4:i;var h;for(h=0;h<s;h+=4){r=f[e.charCodeAt(h)]<<18|f[e.charCodeAt(h+1)]<<12|f[e.charCodeAt(h+2)]<<6|f[e.charCodeAt(h+3)];u[a++]=r>>16&255;u[a++]=r>>8&255;u[a++]=r&255}if(o===2){r=f[e.charCodeAt(h)]<<2|f[e.charCodeAt(h+1)]>>4;u[a++]=r&255}if(o===1){r=f[e.charCodeAt(h)]<<10|f[e.charCodeAt(h+1)]<<4|f[e.charCodeAt(h+2)]>>2;u[a++]=r>>8&255;u[a++]=r&255}return u}function tripletToBase64(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[e&63]}function encodeChunk(e,r,t){var f;var n=[];for(var i=r;i<t;i+=3){f=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(e[i+2]&255);n.push(tripletToBase64(f))}return n.join("")}function fromByteArray(e){var r;var f=e.length;var n=f%3;var i=[];var o=16383;for(var u=0,a=f-n;u<a;u+=o){i.push(encodeChunk(e,u,u+o>a?a:u+o))}if(n===1){r=e[f-1];i.push(t[r>>2]+t[r<<4&63]+"==")}else if(n===2){r=(e[f-2]<<8)+e[f-1];i.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")}return i.join("")}},293:function(e,r,t){"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var f=t(991);var n=t(759);var i=typeof Symbol==="function"&&typeof Symbol.for==="function"?Symbol.for("nodejs.util.inspect.custom"):null;r.Buffer=Buffer;r.SlowBuffer=SlowBuffer;r.INSPECT_MAX_BYTES=50;var o=2147483647;r.kMaxLength=o;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var e=new Uint8Array(1);var r={foo:function(){return 42}};Object.setPrototypeOf(r,Uint8Array.prototype);Object.setPrototypeOf(e,r);return e.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(e){if(e>o){throw new RangeError('The value "'+e+'" is invalid for option "size"')}var r=new Uint8Array(e);Object.setPrototypeOf(r,Buffer.prototype);return r}function Buffer(e,r,t){if(typeof e==="number"){if(typeof r==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(e)}return from(e,r,t)}Buffer.poolSize=8192;function from(e,r,t){if(typeof e==="string"){return fromString(e,r)}if(ArrayBuffer.isView(e)){return fromArrayLike(e)}if(e==null){throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)){return fromArrayBuffer(e,r,t)}if(typeof SharedArrayBuffer!=="undefined"&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer))){return fromArrayBuffer(e,r,t)}if(typeof e==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var f=e.valueOf&&e.valueOf();if(f!=null&&f!==e){return Buffer.from(f,r,t)}var n=fromObject(e);if(n)return n;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]==="function"){return Buffer.from(e[Symbol.toPrimitive]("string"),r,t)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}Buffer.from=function(e,r,t){return from(e,r,t)};Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype);Object.setPrototypeOf(Buffer,Uint8Array);function assertSize(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be of type number')}else if(e<0){throw new RangeError('The value "'+e+'" is invalid for option "size"')}}function alloc(e,r,t){assertSize(e);if(e<=0){return createBuffer(e)}if(r!==undefined){return typeof t==="string"?createBuffer(e).fill(r,t):createBuffer(e).fill(r)}return createBuffer(e)}Buffer.alloc=function(e,r,t){return alloc(e,r,t)};function allocUnsafe(e){assertSize(e);return createBuffer(e<0?0:checked(e)|0)}Buffer.allocUnsafe=function(e){return allocUnsafe(e)};Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)};function fromString(e,r){if(typeof r!=="string"||r===""){r="utf8"}if(!Buffer.isEncoding(r)){throw new TypeError("Unknown encoding: "+r)}var t=byteLength(e,r)|0;var f=createBuffer(t);var n=f.write(e,r);if(n!==t){f=f.slice(0,n)}return f}function fromArrayLike(e){var r=e.length<0?0:checked(e.length)|0;var t=createBuffer(r);for(var f=0;f<r;f+=1){t[f]=e[f]&255}return t}function fromArrayBuffer(e,r,t){if(r<0||e.byteLength<r){throw new RangeError('"offset" is outside of buffer bounds')}if(e.byteLength<r+(t||0)){throw new RangeError('"length" is outside of buffer bounds')}var f;if(r===undefined&&t===undefined){f=new Uint8Array(e)}else if(t===undefined){f=new Uint8Array(e,r)}else{f=new Uint8Array(e,r,t)}Object.setPrototypeOf(f,Buffer.prototype);return f}function fromObject(e){if(Buffer.isBuffer(e)){var r=checked(e.length)|0;var t=createBuffer(r);if(t.length===0){return t}e.copy(t,0,0,r);return t}if(e.length!==undefined){if(typeof e.length!=="number"||numberIsNaN(e.length)){return createBuffer(0)}return fromArrayLike(e)}if(e.type==="Buffer"&&Array.isArray(e.data)){return fromArrayLike(e.data)}}function checked(e){if(e>=o){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+o.toString(16)+" bytes")}return e|0}function SlowBuffer(e){if(+e!=e){e=0}return Buffer.alloc(+e)}Buffer.isBuffer=function isBuffer(e){return e!=null&&e._isBuffer===true&&e!==Buffer.prototype};Buffer.compare=function compare(e,r){if(isInstance(e,Uint8Array))e=Buffer.from(e,e.offset,e.byteLength);if(isInstance(r,Uint8Array))r=Buffer.from(r,r.offset,r.byteLength);if(!Buffer.isBuffer(e)||!Buffer.isBuffer(r)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(e===r)return 0;var t=e.length;var f=r.length;for(var n=0,i=Math.min(t,f);n<i;++n){if(e[n]!==r[n]){t=e[n];f=r[n];break}}if(t<f)return-1;if(f<t)return 1;return 0};Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(e,r){if(!Array.isArray(e)){throw new TypeError('"list" argument must be an Array of Buffers')}if(e.length===0){return Buffer.alloc(0)}var t;if(r===undefined){r=0;for(t=0;t<e.length;++t){r+=e[t].length}}var f=Buffer.allocUnsafe(r);var n=0;for(t=0;t<e.length;++t){var i=e[t];if(isInstance(i,Uint8Array)){i=Buffer.from(i)}if(!Buffer.isBuffer(i)){throw new TypeError('"list" argument must be an Array of Buffers')}i.copy(f,n);n+=i.length}return f};function byteLength(e,r){if(Buffer.isBuffer(e)){return e.length}if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof e)}var t=e.length;var f=arguments.length>2&&arguments[2]===true;if(!f&&t===0)return 0;var n=false;for(;;){switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return base64ToBytes(e).length;default:if(n){return f?-1:utf8ToBytes(e).length}r=(""+r).toLowerCase();n=true}}}Buffer.byteLength=byteLength;function slowToString(e,r,t){var f=false;if(r===undefined||r<0){r=0}if(r>this.length){return""}if(t===undefined||t>this.length){t=this.length}if(t<=0){return""}t>>>=0;r>>>=0;if(t<=r){return""}if(!e)e="utf8";while(true){switch(e){case"hex":return hexSlice(this,r,t);case"utf8":case"utf-8":return utf8Slice(this,r,t);case"ascii":return asciiSlice(this,r,t);case"latin1":case"binary":return latin1Slice(this,r,t);case"base64":return base64Slice(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,r,t);default:if(f)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase();f=true}}}Buffer.prototype._isBuffer=true;function swap(e,r,t){var f=e[r];e[r]=e[t];e[t]=f}Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<e;r+=2){swap(this,r,r+1)}return this};Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<e;r+=4){swap(this,r,r+3);swap(this,r+1,r+2)}return this};Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<e;r+=8){swap(this,r,r+7);swap(this,r+1,r+6);swap(this,r+2,r+5);swap(this,r+3,r+4)}return this};Buffer.prototype.toString=function toString(){var e=this.length;if(e===0)return"";if(arguments.length===0)return utf8Slice(this,0,e);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(this===e)return true;return Buffer.compare(this,e)===0};Buffer.prototype.inspect=function inspect(){var e="";var t=r.INSPECT_MAX_BYTES;e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim();if(this.length>t)e+=" ... ";return"<Buffer "+e+">"};if(i){Buffer.prototype[i]=Buffer.prototype.inspect}Buffer.prototype.compare=function compare(e,r,t,f,n){if(isInstance(e,Uint8Array)){e=Buffer.from(e,e.offset,e.byteLength)}if(!Buffer.isBuffer(e)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof e)}if(r===undefined){r=0}if(t===undefined){t=e?e.length:0}if(f===undefined){f=0}if(n===undefined){n=this.length}if(r<0||t>e.length||f<0||n>this.length){throw new RangeError("out of range index")}if(f>=n&&r>=t){return 0}if(f>=n){return-1}if(r>=t){return 1}r>>>=0;t>>>=0;f>>>=0;n>>>=0;if(this===e)return 0;var i=n-f;var o=t-r;var u=Math.min(i,o);var a=this.slice(f,n);var s=e.slice(r,t);for(var h=0;h<u;++h){if(a[h]!==s[h]){i=a[h];o=s[h];break}}if(i<o)return-1;if(o<i)return 1;return 0};function bidirectionalIndexOf(e,r,t,f,n){if(e.length===0)return-1;if(typeof t==="string"){f=t;t=0}else if(t>2147483647){t=2147483647}else if(t<-2147483648){t=-2147483648}t=+t;if(numberIsNaN(t)){t=n?0:e.length-1}if(t<0)t=e.length+t;if(t>=e.length){if(n)return-1;else t=e.length-1}else if(t<0){if(n)t=0;else return-1}if(typeof r==="string"){r=Buffer.from(r,f)}if(Buffer.isBuffer(r)){if(r.length===0){return-1}return arrayIndexOf(e,r,t,f,n)}else if(typeof r==="number"){r=r&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(n){return Uint8Array.prototype.indexOf.call(e,r,t)}else{return Uint8Array.prototype.lastIndexOf.call(e,r,t)}}return arrayIndexOf(e,[r],t,f,n)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,r,t,f,n){var i=1;var o=e.length;var u=r.length;if(f!==undefined){f=String(f).toLowerCase();if(f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le"){if(e.length<2||r.length<2){return-1}i=2;o/=2;u/=2;t/=2}}function read(e,r){if(i===1){return e[r]}else{return e.readUInt16BE(r*i)}}var a;if(n){var s=-1;for(a=t;a<o;a++){if(read(e,a)===read(r,s===-1?0:a-s)){if(s===-1)s=a;if(a-s+1===u)return s*i}else{if(s!==-1)a-=a-s;s=-1}}}else{if(t+u>o)t=o-u;for(a=t;a>=0;a--){var h=true;for(var c=0;c<u;c++){if(read(e,a+c)!==read(r,c)){h=false;break}}if(h)return a}}return-1}Buffer.prototype.includes=function includes(e,r,t){return this.indexOf(e,r,t)!==-1};Buffer.prototype.indexOf=function indexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,false)};function hexWrite(e,r,t,f){t=Number(t)||0;var n=e.length-t;if(!f){f=n}else{f=Number(f);if(f>n){f=n}}var i=r.length;if(f>i/2){f=i/2}for(var o=0;o<f;++o){var u=parseInt(r.substr(o*2,2),16);if(numberIsNaN(u))return o;e[t+o]=u}return o}function utf8Write(e,r,t,f){return blitBuffer(utf8ToBytes(r,e.length-t),e,t,f)}function asciiWrite(e,r,t,f){return blitBuffer(asciiToBytes(r),e,t,f)}function latin1Write(e,r,t,f){return asciiWrite(e,r,t,f)}function base64Write(e,r,t,f){return blitBuffer(base64ToBytes(r),e,t,f)}function ucs2Write(e,r,t,f){return blitBuffer(utf16leToBytes(r,e.length-t),e,t,f)}Buffer.prototype.write=function write(e,r,t,f){if(r===undefined){f="utf8";t=this.length;r=0}else if(t===undefined&&typeof r==="string"){f=r;t=this.length;r=0}else if(isFinite(r)){r=r>>>0;if(isFinite(t)){t=t>>>0;if(f===undefined)f="utf8"}else{f=t;t=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var n=this.length-r;if(t===undefined||t>n)t=n;if(e.length>0&&(t<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!f)f="utf8";var i=false;for(;;){switch(f){case"hex":return hexWrite(this,e,r,t);case"utf8":case"utf-8":return utf8Write(this,e,r,t);case"ascii":return asciiWrite(this,e,r,t);case"latin1":case"binary":return latin1Write(this,e,r,t);case"base64":return base64Write(this,e,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,r,t);default:if(i)throw new TypeError("Unknown encoding: "+f);f=(""+f).toLowerCase();i=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(e,r,t){if(r===0&&t===e.length){return f.fromByteArray(e)}else{return f.fromByteArray(e.slice(r,t))}}function utf8Slice(e,r,t){t=Math.min(e.length,t);var f=[];var n=r;while(n<t){var i=e[n];var o=null;var u=i>239?4:i>223?3:i>191?2:1;if(n+u<=t){var a,s,h,c;switch(u){case 1:if(i<128){o=i}break;case 2:a=e[n+1];if((a&192)===128){c=(i&31)<<6|a&63;if(c>127){o=c}}break;case 3:a=e[n+1];s=e[n+2];if((a&192)===128&&(s&192)===128){c=(i&15)<<12|(a&63)<<6|s&63;if(c>2047&&(c<55296||c>57343)){o=c}}break;case 4:a=e[n+1];s=e[n+2];h=e[n+3];if((a&192)===128&&(s&192)===128&&(h&192)===128){c=(i&15)<<18|(a&63)<<12|(s&63)<<6|h&63;if(c>65535&&c<1114112){o=c}}}}if(o===null){o=65533;u=1}else if(o>65535){o-=65536;f.push(o>>>10&1023|55296);o=56320|o&1023}f.push(o);n+=u}return decodeCodePointsArray(f)}var u=4096;function decodeCodePointsArray(e){var r=e.length;if(r<=u){return String.fromCharCode.apply(String,e)}var t="";var f=0;while(f<r){t+=String.fromCharCode.apply(String,e.slice(f,f+=u))}return t}function asciiSlice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n]&127)}return f}function latin1Slice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n])}return f}function hexSlice(e,r,t){var f=e.length;if(!r||r<0)r=0;if(!t||t<0||t>f)t=f;var n="";for(var i=r;i<t;++i){n+=s[e[i]]}return n}function utf16leSlice(e,r,t){var f=e.slice(r,t);var n="";for(var i=0;i<f.length;i+=2){n+=String.fromCharCode(f[i]+f[i+1]*256)}return n}Buffer.prototype.slice=function slice(e,r){var t=this.length;e=~~e;r=r===undefined?t:~~r;if(e<0){e+=t;if(e<0)e=0}else if(e>t){e=t}if(r<0){r+=t;if(r<0)r=0}else if(r>t){r=t}if(r<e)r=e;var f=this.subarray(e,r);Object.setPrototypeOf(f,Buffer.prototype);return f};function checkOffset(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}return f};Buffer.prototype.readUIntBE=function readUIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t){checkOffset(e,r,this.length)}var f=this[e+--r];var n=1;while(r>0&&(n*=256)){f+=this[e+--r]*n}return f};Buffer.prototype.readUInt8=function readUInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);return this[e]};Buffer.prototype.readUInt16LE=function readUInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]|this[e+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]<<8|this[e+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};Buffer.prototype.readIntLE=function readIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}n*=128;if(f>=n)f-=Math.pow(2,8*r);return f};Buffer.prototype.readIntBE=function readIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=r;var n=1;var i=this[e+--f];while(f>0&&(n*=256)){i+=this[e+--f]*n}n*=128;if(i>=n)i-=Math.pow(2,8*r);return i};Buffer.prototype.readInt8=function readInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);if(!(this[e]&128))return this[e];return(255-this[e]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt16BE=function readInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt32LE=function readInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};Buffer.prototype.readFloatLE=function readFloatLE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,false,52,8)};function checkInt(e,r,t,f,n,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>n||r<i)throw new RangeError('"value" argument is out of bounds');if(t+f>e.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=1;var o=0;this[r]=e&255;while(++o<t&&(i*=256)){this[r+o]=e/i&255}return r+t};Buffer.prototype.writeUIntBE=function writeUIntBE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=t-1;var o=1;this[r+i]=e&255;while(--i>=0&&(o*=256)){this[r+i]=e/o&255}return r+t};Buffer.prototype.writeUInt8=function writeUInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,255,0);this[r]=e&255;return r+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r+3]=e>>>24;this[r+2]=e>>>16;this[r+1]=e>>>8;this[r]=e&255;return r+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};Buffer.prototype.writeIntLE=function writeIntLE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=0;var o=1;var u=0;this[r]=e&255;while(++i<t&&(o*=256)){if(e<0&&u===0&&this[r+i-1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeIntBE=function writeIntBE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=t-1;var o=1;var u=0;this[r+i]=e&255;while(--i>=0&&(o*=256)){if(e<0&&u===0&&this[r+i+1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeInt8=function writeInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,127,-128);if(e<0)e=255+e+1;this[r]=e&255;return r+1};Buffer.prototype.writeInt16LE=function writeInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeInt16BE=function writeInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeInt32LE=function writeInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);this[r]=e&255;this[r+1]=e>>>8;this[r+2]=e>>>16;this[r+3]=e>>>24;return r+4};Buffer.prototype.writeInt32BE=function writeInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);if(e<0)e=4294967295+e+1;this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};function checkIEEE754(e,r,t,f,n,i){if(t+f>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function writeFloat(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,4,34028234663852886e22,-34028234663852886e22)}n.write(e,r,t,f,23,4);return t+4}Buffer.prototype.writeFloatLE=function writeFloatLE(e,r,t){return writeFloat(this,e,r,true,t)};Buffer.prototype.writeFloatBE=function writeFloatBE(e,r,t){return writeFloat(this,e,r,false,t)};function writeDouble(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,8,17976931348623157e292,-17976931348623157e292)}n.write(e,r,t,f,52,8);return t+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,r,t){return writeDouble(this,e,r,true,t)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,r,t){return writeDouble(this,e,r,false,t)};Buffer.prototype.copy=function copy(e,r,t,f){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(!t)t=0;if(!f&&f!==0)f=this.length;if(r>=e.length)r=e.length;if(!r)r=0;if(f>0&&f<t)f=t;if(f===t)return 0;if(e.length===0||this.length===0)return 0;if(r<0){throw new RangeError("targetStart out of bounds")}if(t<0||t>=this.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("sourceEnd out of bounds");if(f>this.length)f=this.length;if(e.length-r<f-t){f=e.length-r+t}var n=f-t;if(this===e&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(r,t,f)}else if(this===e&&t<r&&r<f){for(var i=n-1;i>=0;--i){e[i+r]=this[i+t]}}else{Uint8Array.prototype.set.call(e,this.subarray(t,f),r)}return n};Buffer.prototype.fill=function fill(e,r,t,f){if(typeof e==="string"){if(typeof r==="string"){f=r;r=0;t=this.length}else if(typeof t==="string"){f=t;t=this.length}if(f!==undefined&&typeof f!=="string"){throw new TypeError("encoding must be a string")}if(typeof f==="string"&&!Buffer.isEncoding(f)){throw new TypeError("Unknown encoding: "+f)}if(e.length===1){var n=e.charCodeAt(0);if(f==="utf8"&&n<128||f==="latin1"){e=n}}}else if(typeof e==="number"){e=e&255}else if(typeof e==="boolean"){e=Number(e)}if(r<0||this.length<r||this.length<t){throw new RangeError("Out of range index")}if(t<=r){return this}r=r>>>0;t=t===undefined?this.length:t>>>0;if(!e)e=0;var i;if(typeof e==="number"){for(i=r;i<t;++i){this[i]=e}}else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,f);var u=o.length;if(u===0){throw new TypeError('The value "'+e+'" is invalid for argument "value"')}for(i=0;i<t-r;++i){this[i+r]=o[i%u]}}return this};var a=/[^+/0-9A-Za-z-_]/g;function base64clean(e){e=e.split("=")[0];e=e.trim().replace(a,"");if(e.length<2)return"";while(e.length%4!==0){e=e+"="}return e}function utf8ToBytes(e,r){r=r||Infinity;var t;var f=e.length;var n=null;var i=[];for(var o=0;o<f;++o){t=e.charCodeAt(o);if(t>55295&&t<57344){if(!n){if(t>56319){if((r-=3)>-1)i.push(239,191,189);continue}else if(o+1===f){if((r-=3)>-1)i.push(239,191,189);continue}n=t;continue}if(t<56320){if((r-=3)>-1)i.push(239,191,189);n=t;continue}t=(n-55296<<10|t-56320)+65536}else if(n){if((r-=3)>-1)i.push(239,191,189)}n=null;if(t<128){if((r-=1)<0)break;i.push(t)}else if(t<2048){if((r-=2)<0)break;i.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;i.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;i.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else{throw new Error("Invalid code point")}}return i}function asciiToBytes(e){var r=[];for(var t=0;t<e.length;++t){r.push(e.charCodeAt(t)&255)}return r}function utf16leToBytes(e,r){var t,f,n;var i=[];for(var o=0;o<e.length;++o){if((r-=2)<0)break;t=e.charCodeAt(o);f=t>>8;n=t%256;i.push(n);i.push(f)}return i}function base64ToBytes(e){return f.toByteArray(base64clean(e))}function blitBuffer(e,r,t,f){for(var n=0;n<f;++n){if(n+t>=r.length||n>=e.length)break;r[n+t]=e[n]}return n}function isInstance(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function numberIsNaN(e){return e!==e}var s=function(){var e="0123456789abcdef";var r=new Array(256);for(var t=0;t<16;++t){var f=t*16;for(var n=0;n<16;++n){r[f+n]=e[t]+e[n]}}return r}()},759:function(e,r){r.read=function(e,r,t,f,n){var i,o;var u=n*8-f-1;var a=(1<<u)-1;var s=a>>1;var h=-7;var c=t?n-1:0;var l=t?-1:1;var p=e[r+c];c+=l;i=p&(1<<-h)-1;p>>=-h;h+=u;for(;h>0;i=i*256+e[r+c],c+=l,h-=8){}o=i&(1<<-h)-1;i>>=-h;h+=f;for(;h>0;o=o*256+e[r+c],c+=l,h-=8){}if(i===0){i=1-s}else if(i===a){return o?NaN:(p?-1:1)*Infinity}else{o=o+Math.pow(2,f);i=i-s}return(p?-1:1)*o*Math.pow(2,i-f)};r.write=function(e,r,t,f,n,i){var o,u,a;var s=i*8-n-1;var h=(1<<s)-1;var c=h>>1;var l=n===23?Math.pow(2,-24)-Math.pow(2,-77):0;var p=f?0:i-1;var y=f?1:-1;var g=r<0||r===0&&1/r<0?1:0;r=Math.abs(r);if(isNaN(r)||r===Infinity){u=isNaN(r)?1:0;o=h}else{o=Math.floor(Math.log(r)/Math.LN2);if(r*(a=Math.pow(2,-o))<1){o--;a*=2}if(o+c>=1){r+=l/a}else{r+=l*Math.pow(2,1-c)}if(r*a>=2){o++;a/=2}if(o+c>=h){u=0;o=h}else if(o+c>=1){u=(r*a-1)*Math.pow(2,n);o=o+c}else{u=r*Math.pow(2,c-1)*Math.pow(2,n);o=0}}for(;n>=8;e[t+p]=u&255,p+=y,u/=256,n-=8){}o=o<<n|u;s+=n;for(;s>0;e[t+p]=o&255,p+=y,o/=256,s-=8){}e[t+p-y]|=g*128}}};var r={};function __nccwpck_require__(t){var f=r[t];if(f!==undefined){return f.exports}var n=r[t]={exports:{}};var i=true;try{e[t](n,n.exports,__nccwpck_require__);i=false}finally{if(i)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(293);module.exports=t})();

/***/ }),

/***/ 3142:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={162:function(e){var t=e.exports={};var r;var n;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){r=setTimeout}else{r=defaultSetTimout}}catch(e){r=defaultSetTimout}try{if(typeof clearTimeout==="function"){n=clearTimeout}else{n=defaultClearTimeout}}catch(e){n=defaultClearTimeout}})();function runTimeout(e){if(r===setTimeout){return setTimeout(e,0)}if((r===defaultSetTimout||!r)&&setTimeout){r=setTimeout;return setTimeout(e,0)}try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}function runClearTimeout(e){if(n===clearTimeout){return clearTimeout(e)}if((n===defaultClearTimeout||!n)&&clearTimeout){n=clearTimeout;return clearTimeout(e)}try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}var i=[];var o=false;var u;var a=-1;function cleanUpNextTick(){if(!o||!u){return}o=false;if(u.length){i=u.concat(i)}else{a=-1}if(i.length){drainQueue()}}function drainQueue(){if(o){return}var e=runTimeout(cleanUpNextTick);o=true;var t=i.length;while(t){u=i;i=[];while(++a<t){if(u){u[a].run()}}a=-1;t=i.length}u=null;o=false;runClearTimeout(e)}t.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1){for(var r=1;r<arguments.length;r++){t[r-1]=arguments[r]}}i.push(new Item(e,t));if(i.length===1&&!o){runTimeout(drainQueue)}};function Item(e,t){this.fun=e;this.array=t}Item.prototype.run=function(){this.fun.apply(null,this.array)};t.title="browser";t.browser=true;t.env={};t.argv=[];t.version="";t.versions={};function noop(){}t.on=noop;t.addListener=noop;t.once=noop;t.off=noop;t.removeListener=noop;t.removeAllListeners=noop;t.emit=noop;t.prependListener=noop;t.prependOnceListener=noop;t.listeners=function(e){return[]};t.binding=function(e){throw new Error("process.binding is not supported")};t.cwd=function(){return"/"};t.chdir=function(e){throw new Error("process.chdir is not supported")};t.umask=function(){return 0}}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var i=t[r]={exports:{}};var o=true;try{e[r](i,i.exports,__nccwpck_require__);o=false}finally{if(o)delete t[r]}return i.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(162);module.exports=r})();

/***/ }),

/***/ 8624:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ZP": function() { return /* binding */ Z; }
});

// UNUSED EXPORTS: SWRConfig, mutate, unstable_serialize, useSWRConfig

// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
;// CONCATENATED MODULE: ./node_modules/.pnpm/dequal@2.0.2/node_modules/dequal/lite/index.mjs
var has = Object.prototype.hasOwnProperty;

function dequal(foo, bar) {
	var ctor, len;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/swr@1.0.1_react@17.0.2/node_modules/swr/dist/index.esm.js
function l(e,r,n,t){return new(n||(n=Promise))(function(i,u){function o(e){try{c(t.next(e))}catch(e){u(e)}}function a(e){try{c(t.throw(e))}catch(e){u(e)}}function c(e){var r;e.done?i(e.value):(r=e.value,r instanceof n?r:new n(function(e){e(r)})).then(o,a)}c((t=t.apply(e,r||[])).next())})}function s(e,r){var n,t,i,u,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return u={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function a(u){return function(a){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,t&&(i=2&u[0]?t.return:u[0]?t.throw||((i=t.return)&&i.call(t),0):t.next)&&!(i=i.call(t,u[1])).done)return i;switch(t=0,i&&(u=[2&u[0],i.value]),u[0]){case 0:case 1:i=u;break;case 4:return o.label++,{value:u[1],done:!1};case 5:o.label++,t=u[1],u=[0];continue;case 7:u=o.ops.pop(),o.trys.pop();continue;default:if(!(i=o.trys,(i=i.length>0&&i[i.length-1])||6!==u[0]&&2!==u[0])){o=0;continue}if(3===u[0]&&(!i||u[1]>i[0]&&u[1]<i[3])){o.label=u[1];break}if(6===u[0]&&o.label<i[1]){o.label=i[1],i=u;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(u);break}i[2]&&o.ops.pop(),o.trys.pop();continue}u=r.call(e,o)}catch(e){u=[6,e],t=0}finally{n=i=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,a])}}}var d={}[0],v=function(e){return e===d},h=function(e){return"function"==typeof e},g=function(){},p=function(e,r){return Object.assign({},e,r)},y=!0,b="undefined"!=typeof window,w="undefined"!=typeof document,m=b&&window.addEventListener||g,O=w&&document.addEventListener||g,V={isOnline:function(){return y},isVisible:function(){var e=w&&document.visibilityState;return!!v(e)||"hidden"!==e}},k={initFocus:function(e){O("visibilitychange",e),m("focus",e)},initReconnect:function(e){m("online",function(){y=!0,e()}),m("offline",function(){y=!1})}},T="undefined"==typeof window||"Deno"in window,R=T?null:window.requestAnimationFrame,S=R?function(e){return R(e)}:function(e){return setTimeout(e,1)},E=T?react.useEffect:react.useLayoutEffect,I="undefined"!=typeof navigator&&navigator.connection,x=!T&&I&&(["slow-2g","2g"].includes(I.effectiveType)||I.saveData),P=new WeakMap,F=0;function M(e){if(h(e))try{e=e()}catch(r){e=""}var r;return Array.isArray(e)?(r=e,e=function(e){if(!e.length)return"";for(var r="arg",n=0;n<e.length;++n){var t=e[n],i=d;null===t||"object"!=typeof t&&!h(t)?i=JSON.stringify(t):P.has(t)?i=P.get(t):(i=F,P.set(t,F++)),r+="$"+i}return r}(e)):r=[e=String(e||"")],[e,r,e?"$err$"+e:"",e?"$req$"+e:""]}var W=new WeakMap,$=function(e,r,n,t,i,u){void 0===u&&(u=!1);var o=W.get(e),a=o[0],c=o[1],f=a[r],l=c[r];if(l)for(var s=0;s<l.length;++s)l[s](n,t,i);return u&&f&&f[0]?f[0](2).then(function(){return e.get(r)}):e.get(r)},q=0,C=function(){return++q},D=function(e,r,n,t){return void 0===t&&(t=!0),l(void 0,void 0,void 0,function(){var i,u,o,a,c,f,l,g,p,y,b;return s(this,function(s){switch(s.label){case 0:if(i=M(r),u=i[0],o=i[2],!u)return[2];if(a=W.get(e),c=a[2],f=a[3],v(n))return[2,$(e,u,e.get(u),e.get(o),d,t)];if(p=c[u]=C(),f[u]=0,h(n))try{n=n(e.get(u))}catch(e){n=d,g=e}if(!n||!h(n.then))return[3,5];s.label=1;case 1:return s.trys.push([1,3,,4]),[4,n];case 2:return l=s.sent(),[3,4];case 3:return y=s.sent(),g=y,[3,4];case 4:if(p!==c[u]){if(g)throw g;return[2,l]}return[3,6];case 5:l=n,s.label=6;case 6:return v(l)||e.set(u,l),e.set(o,g),f[u]=C(),[4,$(e,u,l,g,d,t)];case 7:if(b=s.sent(),g)throw g;return[2,b]}})})};function L(e,r){for(var n in e)e[n][0]&&e[n][0](r)}function j(e,r){if(!W.has(e)){var n=p(k,r),t={},i=D.bind(d,e);return W.set(e,[t,{},{},{},{},{},i]),T||(n.initFocus(L.bind(d,t,0)),n.initReconnect(L.bind(d,t,1))),[e,i]}}var A=j(new Map),G=A[0],H=A[1],J=p({onLoadingSlow:g,onSuccess:g,onError:g,onErrorRetry:function(e,r,n,t,i){if(V.isVisible()){var u=n.errorRetryCount,o=i.retryCount,a=~~((Math.random()+.5)*(1<<(o<8?o:8)))*n.errorRetryInterval;!v(u)&&o>u||setTimeout(t,a,i)}},revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:x?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:x?5e3:3e3,compare:dequal,isPaused:function(){return!1},cache:G,mutate:H,fallback:{}},V);function N(e,r){var n=p(e,r);if(!r)return n;var t=e.use,i=e.fallback,u=r.use,o=r.fallback;return t&&u&&(n.use=t.concat(u)),i&&o&&(n.fallback=p(i,o)),n}var z=(0,react.createContext)({});function B(e){return h(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}]}var K,Q=function(e,r,n){var t=r[e]||(r[e]=[]);return t.push(n),function(){var e=t.indexOf(n);e>=0&&(t[e]=t[t.length-1],t.pop())}},U={dedupe:!0},X=Object.defineProperty(function(e){var r=e.children,n=e.value,o=N((0,react.useContext)(z),n),a=n&&n.provider,c=(0,react.useState)(function(){return a?j(a(o.cache||G),n):d})[0];return c&&(o.cache=c[0],o.mutate=c[1]),(0,react.createElement)(z.Provider,{value:o},r)},"default",{value:J}),Y=function(e){return M(e)[0]},Z=(K=function(e,r,n){var t=n.cache,u=n.compare,f=n.fallbackData,h=n.suspense,g=n.revalidateOnMount,y=n.refreshInterval,b=n.refreshWhenHidden,w=n.refreshWhenOffline,m=W.get(t),O=m[0],V=m[1],k=m[2],R=m[3],I=m[4],x=m[5],P=M(e),F=P[0],q=P[1],L=P[2],j=P[3],A=(0,react.useRef)(!1),G=(0,react.useRef)(!1),H=(0,react.useRef)(F),J=(0,react.useRef)(n),N=function(){return J.current},z=t.get(F),B=v(f)?n.fallback[F]:f,K=v(z)?B:z,X=t.get(L);if(h&&(!F||!r))throw new Error("useSWR requires either key or fetcher with suspense mode");var Y=function(){return v(g)?h?!A.current&&!v(K):v(K)||n.revalidateIfStale:g},Z=!(!F||!r)&&(!!t.get(j)||!A.current&&Y()),_=function(e,r){var n=(0,react.useState)({})[1],t=(0,react.useRef)(e),u=(0,react.useRef)({data:!1,error:!1,isValidating:!1}),c=(0,react.useCallback)(function(e){var i=!1,o=t.current;for(var a in e){var c=a;o[c]!==e[c]&&(o[c]=e[c],u.current[c]&&(i=!0))}i&&!r.current&&n({})},[]);return E(function(){t.current=e}),[t,u.current,c]}({data:K,error:X,isValidating:Z},G),ee=_[0],re=_[1],ne=_[2],te=(0,react.useCallback)(function(e){return l(void 0,void 0,void 0,function(){var i,o,a,c,f,l,h,g,p;return s(this,function(s){switch(s.label){case 0:if(!F||!r||G.current||N().isPaused())return[2,!1];a=!0,c=e||{},f=!v(I[F])&&c.dedupe,l=function(){return!G.current&&F===H.current&&A.current},h=function(){delete I[F],delete x[F]},s.label=1;case 1:return s.trys.push([1,6,,7]),t.set(j,!0),ne({isValidating:!0}),f||$(t,F,ee.current.data,ee.current.error,!0),f?(o=x[F],[4,I[F]]):[3,3];case 2:return i=s.sent(),[3,5];case 3:return n.loadingTimeout&&!t.get(F)&&setTimeout(function(){a&&l()&&N().onLoadingSlow(F,n)},n.loadingTimeout),x[F]=o=C(),[4,I[F]=r.apply(r,q)];case 4:i=s.sent(),setTimeout(function(){x[F]===o&&h()},n.dedupingInterval),l()&&N().onSuccess(i,F,n),s.label=5;case 5:return x[F]!==o?[2,!1]:(t.set(L,d),t.set(j,!1),g={isValidating:!1},!v(k[F])&&(o<=k[F]||o<=R[F]||0===R[F])?(ne(g),[2,!1]):(v(ee.current.error)||(g.error=d),u(ee.current.data,i)||(g.data=i),u(t.get(F),i)||t.set(F,i),ne(g),f||$(t,F,i,g.error,!1),[3,7]));case 6:return p=s.sent(),h(),t.set(j,!1),N().isPaused()?(ne({isValidating:!1}),[2,!1]):(t.set(L,p),ee.current.error!==p&&(ne({isValidating:!1,error:p}),f||$(t,F,d,p,!1)),l()&&(N().onError(p,F,n),n.shouldRetryOnError&&N().onErrorRetry(p,F,n,te,{retryCount:(c.retryCount||0)+1,dedupe:!0})),[3,7]);case 7:return a=!1,[2,!0]}})})},[F]),ie=(0,react.useCallback)(function(e,r){return D(t,H.current,e,r)},[]);if(E(function(){J.current=n}),E(function(){if(F){var e=A.current,r=te.bind(d,U),n=function(){return N().isVisible()&&N().isOnline()},t=0,i=Q(F,V,function(e,r,n){ne(p({error:r,isValidating:n},u(e,ee.current.data)?null:{data:e}))}),o=Q(F,O,function(e){if(0===e){var i=Date.now();N().revalidateOnFocus&&i>t&&n()&&(t=i+N().focusThrottleInterval,r())}else if(1===e)N().revalidateOnReconnect&&n()&&r();else if(2===e)return te()});return G.current=!1,H.current=F,e&&ne({data:K,error:X,isValidating:Z}),Y()&&(v(K)||T?r():S(r)),A.current=!0,function(){G.current=!0,i(),o()}}},[F,te]),E(function(){var e;function r(){y&&-1!==e&&(e=setTimeout(n,y))}function n(){ee.current.error||!b&&!N().isVisible()||!w&&!N().isOnline()?r():te(U).then(function(){return r()})}return r(),function(){e&&(clearTimeout(e),e=-1)}},[y,b,w,te]),(0,react.useDebugValue)(K),h&&v(K))throw v(X)?te(U):X;return{mutate:ie,get data(){return re.data=!0,K},get error(){return re.error=!0,X},get isValidating(){return re.isValidating=!0,Z}}},function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];var n=B(e),i=n[0],u=n[1],o=n[2],a=p(J,(0,react.useContext)(z)),c=N(a,o),f=K,l=c.use;if(l)for(var s=l.length;s-- >0;)f=l[s](f);return f(i,u||c.fetcher,c)}),_=function(){return p(J,t(z))};


/***/ }),

/***/ 993:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "UG": function() { return /* reexport */ Err; },
  "Ok": function() { return /* reexport */ Ok; }
});

// UNUSED EXPORTS: ErrImpl, None, OkImpl, Option, Result, Some

;// CONCATENATED MODULE: ./node_modules/.pnpm/ts-results@3.3.0/node_modules/ts-results/esm/utils.js
function utils_toString(val) {
    var value = String(val);
    if (value === '[object Object]') {
        try {
            value = JSON.stringify(val);
        }
        catch (_a) { }
    }
    return value;
}
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/ts-results@3.3.0/node_modules/ts-results/esm/option.js


/**
 * Contains the None value
 */
var NoneImpl = /** @class */ (function () {
    function NoneImpl() {
        this.some = false;
        this.none = true;
    }
    NoneImpl.prototype[Symbol.iterator] = function () {
        return {
            next: function () {
                return { done: true, value: undefined };
            },
        };
    };
    NoneImpl.prototype.unwrapOr = function (val) {
        return val;
    };
    NoneImpl.prototype.expect = function (msg) {
        throw new Error("" + msg);
    };
    NoneImpl.prototype.unwrap = function () {
        throw new Error("Tried to unwrap None");
    };
    NoneImpl.prototype.map = function (_mapper) {
        return this;
    };
    NoneImpl.prototype.andThen = function (op) {
        return this;
    };
    NoneImpl.prototype.toResult = function (error) {
        return Err(error);
    };
    NoneImpl.prototype.toString = function () {
        return 'None';
    };
    return NoneImpl;
}());
// Export None as a singleton, then freeze it so it can't be modified
var None = new NoneImpl();
Object.freeze(None);
/**
 * Contains the success value
 */
var SomeImpl = /** @class */ (function () {
    function SomeImpl(val) {
        if (!(this instanceof SomeImpl)) {
            return new SomeImpl(val);
        }
        this.some = true;
        this.none = false;
        this.val = val;
    }
    /**
     * Helper function if you know you have an Some<T> and T is iterable
     */
    SomeImpl.prototype[Symbol.iterator] = function () {
        var obj = Object(this.val);
        return Symbol.iterator in obj
            ? obj[Symbol.iterator]()
            : {
                next: function () {
                    return { done: true, value: undefined };
                },
            };
    };
    SomeImpl.prototype.unwrapOr = function (_val) {
        return this.val;
    };
    SomeImpl.prototype.expect = function (_msg) {
        return this.val;
    };
    SomeImpl.prototype.unwrap = function () {
        return this.val;
    };
    SomeImpl.prototype.map = function (mapper) {
        return Some(mapper(this.val));
    };
    SomeImpl.prototype.andThen = function (mapper) {
        return mapper(this.val);
    };
    SomeImpl.prototype.toResult = function (error) {
        return Ok(this.val);
    };
    /**
     * Returns the contained `Some` value, but never throws.
     * Unlike `unwrap()`, this method doesn't throw and is only callable on an Some<T>
     *
     * Therefore, it can be used instead of `unwrap()` as a maintainability safeguard
     * that will fail to compile if the type of the Option is later changed to a None that can actually occur.
     *
     * (this is the `into_Some()` in rust)
     */
    SomeImpl.prototype.safeUnwrap = function () {
        return this.val;
    };
    SomeImpl.prototype.toString = function () {
        return "Some(" + utils_toString(this.val) + ")";
    };
    SomeImpl.EMPTY = new SomeImpl(undefined);
    return SomeImpl;
}());
// This allows Some to be callable - possible because of the es5 compilation target
var Some = SomeImpl;
var Option;
(function (Option) {
    /**
     * Parse a set of `Option`s, returning an array of all `Some` values.
     * Short circuits with the first `None` found, if any
     */
    function all() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        var someOption = [];
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            if (option.some) {
                someOption.push(option.val);
            }
            else {
                return option;
            }
        }
        return Some(someOption);
    }
    Option.all = all;
    /**
     * Parse a set of `Option`s, short-circuits when an input value is `Some`.
     * If no `Some` is found, returns `None`.
     */
    function any() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        // short-circuits
        for (var _a = 0, options_2 = options; _a < options_2.length; _a++) {
            var option = options_2[_a];
            if (option.some) {
                return option;
            }
            else {
                return option;
            }
        }
        // it must be None
        return None;
    }
    Option.any = any;
    function isOption(value) {
        return value instanceof Some || value === None;
    }
    Option.isOption = isOption;
})(Option || (Option = {}));
//# sourceMappingURL=option.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/ts-results@3.3.0/node_modules/ts-results/esm/result.js


/**
 * Contains the error value
 */
var ErrImpl = /** @class */ (function () {
    function ErrImpl(val) {
        if (!(this instanceof ErrImpl)) {
            return new ErrImpl(val);
        }
        this.ok = false;
        this.err = true;
        this.val = val;
        var stackLines = new Error().stack.split('\n').slice(2);
        if (stackLines && stackLines.length > 0 && stackLines[0].includes('ErrImpl')) {
            stackLines.shift();
        }
        this._stack = stackLines.join('\n');
    }
    ErrImpl.prototype[Symbol.iterator] = function () {
        return {
            next: function () {
                return { done: true, value: undefined };
            },
        };
    };
    /**
     * @deprecated in favor of unwrapOr
     * @see unwrapOr
     */
    ErrImpl.prototype.else = function (val) {
        return val;
    };
    ErrImpl.prototype.unwrapOr = function (val) {
        return val;
    };
    ErrImpl.prototype.expect = function (msg) {
        throw new Error(msg + " - Error: " + utils_toString(this.val) + "\n" + this._stack);
    };
    ErrImpl.prototype.unwrap = function () {
        throw new Error("Tried to unwrap Error: " + utils_toString(this.val) + "\n" + this._stack);
    };
    ErrImpl.prototype.map = function (_mapper) {
        return this;
    };
    ErrImpl.prototype.andThen = function (op) {
        return this;
    };
    ErrImpl.prototype.mapErr = function (mapper) {
        return new Err(mapper(this.val));
    };
    ErrImpl.prototype.toOption = function () {
        return None;
    };
    ErrImpl.prototype.toString = function () {
        return "Err(" + utils_toString(this.val) + ")";
    };
    Object.defineProperty(ErrImpl.prototype, "stack", {
        get: function () {
            return this + "\n" + this._stack;
        },
        enumerable: false,
        configurable: true
    });
    /** An empty Err */
    ErrImpl.EMPTY = new ErrImpl(undefined);
    return ErrImpl;
}());

// This allows Err to be callable - possible because of the es5 compilation target
var Err = ErrImpl;
/**
 * Contains the success value
 */
var OkImpl = /** @class */ (function () {
    function OkImpl(val) {
        if (!(this instanceof OkImpl)) {
            return new OkImpl(val);
        }
        this.ok = true;
        this.err = false;
        this.val = val;
    }
    /**
     * Helper function if you know you have an Ok<T> and T is iterable
     */
    OkImpl.prototype[Symbol.iterator] = function () {
        var obj = Object(this.val);
        return Symbol.iterator in obj
            ? obj[Symbol.iterator]()
            : {
                next: function () {
                    return { done: true, value: undefined };
                },
            };
    };
    /**
     * @see unwrapOr
     * @deprecated in favor of unwrapOr
     */
    OkImpl.prototype.else = function (_val) {
        return this.val;
    };
    OkImpl.prototype.unwrapOr = function (_val) {
        return this.val;
    };
    OkImpl.prototype.expect = function (_msg) {
        return this.val;
    };
    OkImpl.prototype.unwrap = function () {
        return this.val;
    };
    OkImpl.prototype.map = function (mapper) {
        return new Ok(mapper(this.val));
    };
    OkImpl.prototype.andThen = function (mapper) {
        return mapper(this.val);
    };
    OkImpl.prototype.mapErr = function (_mapper) {
        return this;
    };
    OkImpl.prototype.toOption = function () {
        return Some(this.val);
    };
    /**
     * Returns the contained `Ok` value, but never throws.
     * Unlike `unwrap()`, this method doesn't throw and is only callable on an Ok<T>
     *
     * Therefore, it can be used instead of `unwrap()` as a maintainability safeguard
     * that will fail to compile if the error type of the Result is later changed to an error that can actually occur.
     *
     * (this is the `into_ok()` in rust)
     */
    OkImpl.prototype.safeUnwrap = function () {
        return this.val;
    };
    OkImpl.prototype.toString = function () {
        return "Ok(" + utils_toString(this.val) + ")";
    };
    OkImpl.EMPTY = new OkImpl(undefined);
    return OkImpl;
}());

// This allows Ok to be callable - possible because of the es5 compilation target
var Ok = OkImpl;
var Result;
(function (Result) {
    /**
     * Parse a set of `Result`s, returning an array of all `Ok` values.
     * Short circuits with the first `Err` found, if any
     */
    function all() {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        var okResult = [];
        for (var _a = 0, results_1 = results; _a < results_1.length; _a++) {
            var result = results_1[_a];
            if (result.ok) {
                okResult.push(result.val);
            }
            else {
                return result;
            }
        }
        return new Ok(okResult);
    }
    Result.all = all;
    /**
     * Parse a set of `Result`s, short-circuits when an input value is `Ok`.
     * If no `Ok` is found, returns an `Err` containing the collected error values
     */
    function any() {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        var errResult = [];
        // short-circuits
        for (var _a = 0, results_2 = results; _a < results_2.length; _a++) {
            var result = results_2[_a];
            if (result.ok) {
                return result;
            }
            else {
                errResult.push(result.val);
            }
        }
        // it must be a Err
        return new Err(errResult);
    }
    Result.any = any;
    /**
     * Wrap an operation that may throw an Error (`try-catch` style) into checked exception style
     * @param op The operation function
     */
    function wrap(op) {
        try {
            return new Ok(op());
        }
        catch (e) {
            return new Err(e);
        }
    }
    Result.wrap = wrap;
    /**
     * Wrap an async operation that may throw an Error (`try-catch` style) into checked exception style
     * @param op The operation function
     */
    function wrapAsync(op) {
        try {
            return op()
                .then(function (val) { return new Ok(val); })
                .catch(function (e) { return new Err(e); });
        }
        catch (e) {
            return Promise.resolve(new Err(e));
        }
    }
    Result.wrapAsync = wrapAsync;
    function isResult(val) {
        return val instanceof Err || val instanceof Ok;
    }
    Result.isResult = isResult;
})(Result || (Result = {}));
//# sourceMappingURL=result.js.map
;// CONCATENATED MODULE: ./node_modules/.pnpm/ts-results@3.3.0/node_modules/ts-results/esm/index.js


//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1377:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DS": function() { return /* binding */ gBase64; }
/* harmony export */ });
/* unused harmony exports version, VERSION, atob, atobPolyfill, btoa, btoaPolyfill, fromBase64, toBase64, utob, encode, encodeURI, encodeURL, btou, decode, isValid, fromUint8Array, toUint8Array, extendString, extendUint8Array, extendBuiltins */
/* provided dependency */ var Buffer = __webpack_require__(4676)["Buffer"];
/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.2';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a), c => c.charCodeAt(0));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};
// makecjs:CUT //




















// and finally,



/***/ })

}]);