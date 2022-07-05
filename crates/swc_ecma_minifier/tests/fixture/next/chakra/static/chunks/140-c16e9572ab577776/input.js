"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[140],{

/***/ 5933:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "XZ": function() { return /* binding */ Checkbox; }
});

// UNUSED EXPORTS: CheckboxGroup, useCheckbox, useCheckboxGroup, useCheckboxGroupContext

// EXTERNAL MODULE: ./node_modules/@chakra-ui/utils/dist/chakra-ui-utils.esm.js + 3 modules
var chakra_ui_utils_esm = __webpack_require__(5031);
// EXTERNAL MODULE: ./node_modules/@chakra-ui/react-utils/dist/chakra-ui-react-utils.esm.js
var chakra_ui_react_utils_esm = __webpack_require__(6450);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@chakra-ui/hooks/dist/chakra-ui-hooks.esm.js
var chakra_ui_hooks_esm = __webpack_require__(7375);
// EXTERNAL MODULE: ./node_modules/@chakra-ui/hooks/dist/use-animation-state-5054a9f7.esm.js
var use_animation_state_5054a9f7_esm = __webpack_require__(4697);
// EXTERNAL MODULE: ./node_modules/@chakra-ui/system/dist/chakra-ui-system.esm.js + 3 modules
var chakra_ui_system_esm = __webpack_require__(2846);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/motion.mjs + 169 modules
var motion = __webpack_require__(8970);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs + 3 modules
var AnimatePresence = __webpack_require__(1190);
// EXTERNAL MODULE: ./node_modules/@chakra-ui/icon/dist/chakra-ui-icon.esm.js
var chakra_ui_icon_esm = __webpack_require__(894);
;// CONCATENATED MODULE: ./node_modules/@chakra-ui/form-control/dist/chakra-ui-form-control.esm.js







function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
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

var _excluded$2 = ["id", "isRequired", "isInvalid", "isDisabled", "isReadOnly"],
    _excluded2$1 = ["getRootProps", "htmlProps"];

var _createStylesContext$1 = (0,chakra_ui_system_esm/* createStylesContext */.eC)("FormControl"),
    StylesProvider$1 = _createStylesContext$1[0],
    useStyles$1 = _createStylesContext$1[1];

var useFormControlStyles = useStyles$1;

var _createContext = (0,chakra_ui_react_utils_esm/* createContext */.kr)({
  strict: false,
  name: "FormControlContext"
}),
    FormControlProvider = _createContext[0],
    useFormControlContext = _createContext[1];

function useFormControlProvider(props) {
  var idProp = props.id,
      isRequired = props.isRequired,
      isInvalid = props.isInvalid,
      isDisabled = props.isDisabled,
      isReadOnly = props.isReadOnly,
      htmlProps = _objectWithoutPropertiesLoose(props, _excluded$2); // Generate all the required ids


  var uuid = (0,chakra_ui_hooks_esm/* useId */.Me)();
  var id = idProp || "field-" + uuid;
  var labelId = id + "-label";
  var feedbackId = id + "-feedback";
  var helpTextId = id + "-helptext";
  /**
   * Track whether the `FormErrorMessage` has been rendered.
   * We use this to append its id the `aria-describedby` of the `input`.
   */

  var _React$useState = react.useState(false),
      hasFeedbackText = _React$useState[0],
      setHasFeedbackText = _React$useState[1];
  /**
   * Track whether the `FormHelperText` has been rendered.
   * We use this to append its id the `aria-describedby` of the `input`.
   */


  var _React$useState2 = react.useState(false),
      hasHelpText = _React$useState2[0],
      setHasHelpText = _React$useState2[1]; // Track whether the form element (e.g, `input`) has focus.


  var _useBoolean = (0,chakra_ui_hooks_esm/* useBoolean */.kt)(),
      isFocused = _useBoolean[0],
      setFocus = _useBoolean[1];

  var getHelpTextProps = react.useCallback(function (props, forwardedRef) {
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
      ref: (0,chakra_ui_react_utils_esm/* mergeRefs */.lq)(forwardedRef, function (node) {
        if (!node) return;
        setHasHelpText(true);
      })
    });
  }, [helpTextId]);
  var getLabelProps = react.useCallback(function (props, forwardedRef) {
    var _props$id, _props$htmlFor;

    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return _extends({}, props, {
      ref: forwardedRef,
      "data-focus": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isFocused),
      "data-disabled": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isDisabled),
      "data-invalid": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isInvalid),
      "data-readonly": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isReadOnly),
      id: (_props$id = props.id) != null ? _props$id : labelId,
      htmlFor: (_props$htmlFor = props.htmlFor) != null ? _props$htmlFor : id
    });
  }, [id, isDisabled, isFocused, isInvalid, isReadOnly, labelId]);
  var getErrorMessageProps = react.useCallback(function (props, forwardedRef) {
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
      ref: (0,chakra_ui_react_utils_esm/* mergeRefs */.lq)(forwardedRef, function (node) {
        if (!node) return;
        setHasFeedbackText(true);
      }),
      "aria-live": "polite"
    });
  }, [feedbackId]);
  var getRootProps = react.useCallback(function (props, forwardedRef) {
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
  var getRequiredIndicatorProps = react.useCallback(function (props, forwardedRef) {
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
    hasFeedbackText: hasFeedbackText,
    setHasFeedbackText: setHasFeedbackText,
    hasHelpText: hasHelpText,
    setHasHelpText: setHasHelpText,
    id: id,
    labelId: labelId,
    feedbackId: feedbackId,
    helpTextId: helpTextId,
    htmlProps: htmlProps,
    getHelpTextProps: getHelpTextProps,
    getErrorMessageProps: getErrorMessageProps,
    getRootProps: getRootProps,
    getLabelProps: getLabelProps,
    getRequiredIndicatorProps: getRequiredIndicatorProps
  };
}

/**
 * FormControl provides context such as
 * `isInvalid`, `isDisabled`, and `isRequired` to form elements.
 *
 * This is commonly used in form elements such as `input`,
 * `select`, `textarea`, etc.
 */
var FormControl = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var styles = (0,chakra_ui_system_esm/* useMultiStyleConfig */.jC)("Form", props);
  var ownProps = (0,chakra_ui_system_esm/* omitThemingProps */.Lr)(props);

  var _useFormControlProvid = useFormControlProvider(ownProps),
      getRootProps = _useFormControlProvid.getRootProps;
      _useFormControlProvid.htmlProps;
      var context = _objectWithoutPropertiesLoose(_useFormControlProvid, _excluded2$1);

  var className = (0,chakra_ui_utils_esm.cx)("chakra-form-control", props.className);
  return /*#__PURE__*/react.createElement(FormControlProvider, {
    value: context
  }, /*#__PURE__*/react.createElement(StylesProvider$1, {
    value: styles
  }, /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.div */.m$.div, _extends({}, getRootProps({}, ref), {
    className: className,
    __css: styles["container"]
  }))));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  FormControl.displayName = "FormControl";
}

/**
 * FormHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 */
var FormHelperText = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var field = useFormControlContext();
  var styles = useStyles$1();
  var className = (0,chakra_ui_utils_esm.cx)("chakra-form__helper-text", props.className);
  return /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.div */.m$.div, _extends({}, field == null ? void 0 : field.getHelpTextProps(props, ref), {
    __css: styles.helperText,
    className: className
  }));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  FormHelperText.displayName = "FormHelperText";
}

var _excluded$1 = (/* unused pure expression or super */ null && (["isDisabled", "isInvalid", "isReadOnly", "isRequired"])),
    _excluded2 = ["id", "disabled", "readOnly", "required", "isRequired", "isInvalid", "isReadOnly", "isDisabled", "onFocus", "onBlur"];

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
      isDisabled = _useFormControlProps.isDisabled,
      isInvalid = _useFormControlProps.isInvalid,
      isReadOnly = _useFormControlProps.isReadOnly,
      isRequired = _useFormControlProps.isRequired,
      rest = _objectWithoutPropertiesLoose(_useFormControlProps, _excluded$1);

  return _extends({}, rest, {
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    "aria-invalid": ariaAttr(isInvalid),
    "aria-required": ariaAttr(isRequired),
    "aria-readonly": ariaAttr(isReadOnly)
  });
}
/**
 * @internal
 */

function useFormControlProps(props) {
  var _ref, _ref2, _ref3;

  var field = useFormControlContext();

  var id = props.id,
      disabled = props.disabled,
      readOnly = props.readOnly,
      required = props.required,
      isRequired = props.isRequired,
      isInvalid = props.isInvalid,
      isReadOnly = props.isReadOnly,
      isDisabled = props.isDisabled,
      onFocus = props.onFocus,
      onBlur = props.onBlur,
      rest = _objectWithoutPropertiesLoose(props, _excluded2);

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
    onFocus: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(field == null ? void 0 : field.onFocus, onFocus),
    onBlur: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(field == null ? void 0 : field.onBlur, onBlur)
  });
}

var _createStylesContext = (0,chakra_ui_system_esm/* createStylesContext */.eC)("FormError"),
    StylesProvider = _createStylesContext[0],
    useStyles = _createStylesContext[1];

/**
 * Used to provide feedback about an invalid input,
 * and suggest clear instructions on how to fix it.
 */
var FormErrorMessage = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var styles = (0,chakra_ui_system_esm/* useMultiStyleConfig */.jC)("FormError", props);
  var ownProps = (0,chakra_ui_system_esm/* omitThemingProps */.Lr)(props);
  var field = useFormControlContext();
  if (!(field != null && field.isInvalid)) return null;
  return /*#__PURE__*/react.createElement(StylesProvider, {
    value: styles
  }, /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.div */.m$.div, _extends({}, field == null ? void 0 : field.getErrorMessageProps(ownProps, ref), {
    className: (0,chakra_ui_utils_esm.cx)("chakra-form__error-message", props.className),
    __css: _extends({
      display: "flex",
      alignItems: "center"
    }, styles.text)
  })));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  FormErrorMessage.displayName = "FormErrorMessage";
}
/**
 * Used as the visual indicator that a field is invalid or
 * a field has incorrect values.
 */


var FormErrorIcon = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var styles = useStyles();
  var field = useFormControlContext();
  if (!(field != null && field.isInvalid)) return null;

  var _className = (0,chakra_ui_utils_esm.cx)("chakra-form__error-icon", props.className);

  return /*#__PURE__*/react.createElement(chakra_ui_icon_esm/* default */.ZP, _extends({
    ref: ref,
    "aria-hidden": true
  }, props, {
    __css: styles.icon,
    className: _className
  }), /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
  }));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  FormErrorIcon.displayName = "FormErrorIcon";
}

var _excluded = ["className", "children", "requiredIndicator", "optionalIndicator"];

/**
 * Used to enhance the usability of form controls.
 *
 * It is used to inform users as to what information
 * is requested for a form field.
 *
 * ♿️ Accessibility: Every form field should have a form label.
 */
var FormLabel = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (passedProps, ref) {
  var _field$getLabelProps;

  var styles = (0,chakra_ui_system_esm/* useStyleConfig */.mq)("FormLabel", passedProps);
  var props = (0,chakra_ui_system_esm/* omitThemingProps */.Lr)(passedProps);

  props.className;
      var children = props.children,
      _props$requiredIndica = props.requiredIndicator,
      requiredIndicator = _props$requiredIndica === void 0 ? /*#__PURE__*/react.createElement(RequiredIndicator, null) : _props$requiredIndica,
      _props$optionalIndica = props.optionalIndicator,
      optionalIndicator = _props$optionalIndica === void 0 ? null : _props$optionalIndica,
      rest = _objectWithoutPropertiesLoose(props, _excluded);

  var field = useFormControlContext();
  var ownProps = (_field$getLabelProps = field == null ? void 0 : field.getLabelProps(rest, ref)) != null ? _field$getLabelProps : _extends({
    ref: ref
  }, rest);
  return /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.label */.m$.label, _extends({}, ownProps, {
    className: (0,chakra_ui_utils_esm.cx)("chakra-form__label", props.className),
    __css: _extends({
      display: "block",
      textAlign: "start"
    }, styles)
  }), children, field != null && field.isRequired ? requiredIndicator : optionalIndicator);
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  FormLabel.displayName = "FormLabel";
}

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
var RequiredIndicator = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var field = useFormControlContext();
  var styles = useFormControlStyles();
  if (!(field != null && field.isRequired)) return null;
  var className = (0,chakra_ui_utils_esm.cx)("chakra-form__required-indicator", props.className);
  return /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.span */.m$.span, _extends({}, field == null ? void 0 : field.getRequiredIndicatorProps(props, ref), {
    __css: styles.requiredIndicator,
    className: className
  }));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  RequiredIndicator.displayName = "RequiredIndicator";
}



// EXTERNAL MODULE: ./node_modules/@chakra-ui/visually-hidden/dist/chakra-ui-visually-hidden.esm.js
var chakra_ui_visually_hidden_esm = __webpack_require__(1358);
;// CONCATENATED MODULE: ./node_modules/@zag-js/focus-visible/dist/index.mjs
// src/index.ts
var hasSetup = false;
var modality = null;
var hasEventBeforeFocus = false;
var handlers = /* @__PURE__ */ new Set();
var isMac = typeof window !== "undefined" && window.navigator != null ? /^Mac/.test(window.navigator.platform) : false;
function isValidKey(event) {
  return !(event.metaKey || !isMac && event.altKey || event.ctrlKey);
}
function trigger(modality2, event) {
  handlers.forEach((handler) => handler(modality2, event));
}
function onKeyboardEvent(event) {
  hasEventBeforeFocus = true;
  if (isValidKey(event)) {
    modality = "keyboard";
    trigger("keyboard", event);
  }
}
function onPointerEvent(event) {
  modality = "pointer";
  if (event.type === "mousedown" || event.type === "pointerdown") {
    hasEventBeforeFocus = true;
    trigger("pointer", event);
  }
}
function onWindowFocus(event) {
  if (event.target === window || event.target === document) {
    return;
  }
  if (!hasEventBeforeFocus) {
    modality = "keyboard";
    trigger("keyboard", event);
  }
  hasEventBeforeFocus = false;
}
function onWindowBlur() {
  hasEventBeforeFocus = false;
}
function isFocusVisible() {
  return modality !== "pointer";
}
function setupGlobalFocusEvents() {
  if (typeof window === "undefined" || hasSetup) {
    return;
  }
  const { focus } = HTMLElement.prototype;
  HTMLElement.prototype.focus = function focusElement(...args) {
    hasEventBeforeFocus = true;
    focus.apply(this, args);
  };
  document.addEventListener("keydown", onKeyboardEvent, true);
  document.addEventListener("keyup", onKeyboardEvent, true);
  window.addEventListener("focus", onWindowFocus, true);
  window.addEventListener("blur", onWindowBlur, false);
  if (typeof PointerEvent !== "undefined") {
    document.addEventListener("pointerdown", onPointerEvent, true);
    document.addEventListener("pointermove", onPointerEvent, true);
    document.addEventListener("pointerup", onPointerEvent, true);
  } else {
    document.addEventListener("mousedown", onPointerEvent, true);
    document.addEventListener("mousemove", onPointerEvent, true);
    document.addEventListener("mouseup", onPointerEvent, true);
  }
  hasSetup = true;
}
function trackFocusVisible(fn) {
  setupGlobalFocusEvents();
  fn(isFocusVisible());
  const handler = () => fn(isFocusVisible());
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

//# sourceMappingURL=index.mjs.map

;// CONCATENATED MODULE: ./node_modules/@chakra-ui/checkbox/dist/chakra-ui-checkbox.esm.js











function chakra_ui_checkbox_esm_extends() {
  chakra_ui_checkbox_esm_extends = Object.assign ? Object.assign.bind() : function (target) {
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
  return chakra_ui_checkbox_esm_extends.apply(this, arguments);
}

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

  var _props = props,
      defaultValue = _props.defaultValue,
      valueProp = _props.value,
      onChange = _props.onChange,
      isDisabled = _props.isDisabled,
      isNative = _props.isNative;
  var onChangeProp = (0,use_animation_state_5054a9f7_esm.u)(onChange);

  var _useControllableState = (0,chakra_ui_hooks_esm/* useControllableState */.Tx)({
    value: valueProp,
    defaultValue: defaultValue || [],
    onChange: onChangeProp
  }),
      value = _useControllableState[0],
      setValue = _useControllableState[1];

  var handleChange = (0,react.useCallback)(function (eventOrValue) {
    if (!value) return;
    var isChecked = (0,chakra_ui_utils_esm/* isInputEvent */.kA)(eventOrValue) ? eventOrValue.target.checked : !value.includes(eventOrValue);
    var selectedValue = (0,chakra_ui_utils_esm/* isInputEvent */.kA)(eventOrValue) ? eventOrValue.target.value : eventOrValue;
    var nextValue = isChecked ? (0,chakra_ui_utils_esm/* addItem */.jX)(value, selectedValue) : value.filter(function (v) {
      return String(v) !== String(selectedValue);
    });
    setValue(nextValue);
  }, [setValue, value]);
  var getCheckboxProps = (0,react.useCallback)(function (props) {
    var _extends2;

    if (props === void 0) {
      props = {};
    }

    var checkedKey = isNative ? "checked" : "isChecked";
    return chakra_ui_checkbox_esm_extends({}, props, (_extends2 = {}, _extends2[checkedKey] = value.some(function (val) {
      return String(props.value) === String(val);
    }), _extends2.onChange = handleChange, _extends2));
  }, [handleChange, isNative, value]);
  return {
    value: value,
    isDisabled: isDisabled,
    onChange: handleChange,
    setValue: setValue,
    getCheckboxProps: getCheckboxProps
  };
}

var chakra_ui_checkbox_esm_createContext = (0,chakra_ui_react_utils_esm/* createContext */.kr)({
  name: "CheckboxGroupContext",
  strict: false
}),
    CheckboxGroupProvider = chakra_ui_checkbox_esm_createContext[0],
    useCheckboxGroupContext = chakra_ui_checkbox_esm_createContext[1];
/**
 * Used for multiple checkboxes which are bound in one group,
 * and it indicates whether one or more options are selected.
 *
 * @see Docs https://chakra-ui.com/checkbox
 */

var CheckboxGroup = function CheckboxGroup(props) {
  var colorScheme = props.colorScheme,
      size = props.size,
      variant = props.variant,
      children = props.children,
      isDisabled = props.isDisabled;

  var _useCheckboxGroup = useCheckboxGroup(props),
      value = _useCheckboxGroup.value,
      onChange = _useCheckboxGroup.onChange;

  var group = react.useMemo(function () {
    return {
      size: size,
      onChange: onChange,
      colorScheme: colorScheme,
      value: value,
      variant: variant,
      isDisabled: isDisabled
    };
  }, [size, onChange, colorScheme, value, variant, isDisabled]);
  return /*#__PURE__*/react.createElement(CheckboxGroupProvider, {
    value: group
  }, children);
};

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  CheckboxGroup.displayName = "CheckboxGroup";
}

function chakra_ui_checkbox_esm_objectWithoutPropertiesLoose(source, excluded) {
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

var chakra_ui_checkbox_esm_excluded$2 = ["isIndeterminate", "isChecked"];

function __motion(el) {
  var m = motion/* motion */.E;

  if ("custom" in m && typeof m.custom === "function") {
    return m.custom(el);
  }

  return m(el);
} // @future: only call `motion(chakra.svg)` when we drop framer-motion v3 support


var MotionSvg = __motion(chakra_ui_system_esm/* chakra.svg */.m$.svg);

var CheckIcon = function CheckIcon(props) {
  return /*#__PURE__*/react.createElement(MotionSvg, chakra_ui_checkbox_esm_extends({
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
};

var IndeterminateIcon = function IndeterminateIcon(props) {
  return /*#__PURE__*/react.createElement(MotionSvg, chakra_ui_checkbox_esm_extends({
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
};

var CheckboxTransition = function CheckboxTransition(_ref) {
  var open = _ref.open,
      children = _ref.children;
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
var CheckboxIcon = function CheckboxIcon(props) {
  var isIndeterminate = props.isIndeterminate,
      isChecked = props.isChecked,
      rest = chakra_ui_checkbox_esm_objectWithoutPropertiesLoose(props, chakra_ui_checkbox_esm_excluded$2);

  var IconEl = isIndeterminate ? IndeterminateIcon : CheckIcon;
  return /*#__PURE__*/react.createElement(CheckboxTransition, {
    open: isChecked || isIndeterminate
  }, /*#__PURE__*/react.createElement(IconEl, rest));
};

var chakra_ui_checkbox_esm_excluded$1 = ["defaultChecked", "isChecked", "isFocusable", "onChange", "isIndeterminate", "name", "value", "tabIndex", "aria-label", "aria-labelledby", "aria-invalid"];

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

  var formControlProps = useFormControlProps(props);
  var isDisabled = formControlProps.isDisabled,
      isReadOnly = formControlProps.isReadOnly,
      isRequired = formControlProps.isRequired,
      isInvalid = formControlProps.isInvalid,
      id = formControlProps.id,
      onBlur = formControlProps.onBlur,
      onFocus = formControlProps.onFocus,
      ariaDescribedBy = formControlProps["aria-describedby"];

  var _props = props,
      defaultChecked = _props.defaultChecked,
      checkedProp = _props.isChecked,
      isFocusable = _props.isFocusable,
      onChange = _props.onChange,
      isIndeterminate = _props.isIndeterminate,
      name = _props.name,
      value = _props.value,
      _props$tabIndex = _props.tabIndex,
      tabIndex = _props$tabIndex === void 0 ? undefined : _props$tabIndex,
      ariaLabel = _props["aria-label"],
      ariaLabelledBy = _props["aria-labelledby"],
      ariaInvalid = _props["aria-invalid"],
      rest = chakra_ui_checkbox_esm_objectWithoutPropertiesLoose(_props, chakra_ui_checkbox_esm_excluded$1);

  var htmlProps = (0,chakra_ui_utils_esm/* omit */.CE)(rest, ["isDisabled", "isReadOnly", "isRequired", "isInvalid", "id", "onBlur", "onFocus", "aria-describedby"]);
  var onChangeProp = (0,use_animation_state_5054a9f7_esm.u)(onChange);
  var onBlurProp = (0,use_animation_state_5054a9f7_esm.u)(onBlur);
  var onFocusProp = (0,use_animation_state_5054a9f7_esm.u)(onFocus);

  var _useState = (0,react.useState)(false),
      isFocusVisible = _useState[0],
      setIsFocusVisible = _useState[1];

  var _useBoolean = (0,chakra_ui_hooks_esm/* useBoolean */.kt)(),
      isFocused = _useBoolean[0],
      setFocused = _useBoolean[1];

  var _useBoolean2 = (0,chakra_ui_hooks_esm/* useBoolean */.kt)(),
      isHovered = _useBoolean2[0],
      setHovered = _useBoolean2[1];

  var _useBoolean3 = (0,chakra_ui_hooks_esm/* useBoolean */.kt)(),
      isActive = _useBoolean3[0],
      setActive = _useBoolean3[1];

  (0,react.useEffect)(function () {
    return trackFocusVisible(setIsFocusVisible);
  }, []);
  var inputRef = (0,react.useRef)(null);

  var _useState2 = (0,react.useState)(true),
      rootIsLabelElement = _useState2[0],
      setRootIsLabelElement = _useState2[1];

  var _useState3 = (0,react.useState)(!!defaultChecked),
      checkedState = _useState3[0],
      setCheckedState = _useState3[1];

  var _useControllableProp = (0,chakra_ui_hooks_esm/* useControllableProp */.pY)(checkedProp, checkedState),
      isControlled = _useControllableProp[0],
      isChecked = _useControllableProp[1];

  var handleChange = (0,react.useCallback)(function (event) {
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
  (0,use_animation_state_5054a9f7_esm.a)(function () {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate]);
  (0,chakra_ui_hooks_esm/* useUpdateEffect */.rf)(function () {
    if (isDisabled) {
      setFocused.off();
    }
  }, [isDisabled, setFocused]);
  /**
   * HTMLFormElement.reset() should reset the checkbox state
   */

  (0,use_animation_state_5054a9f7_esm.a)(function () {
    var el = inputRef.current;
    if (!(el != null && el.form)) return;

    el.form.onreset = function () {
      setCheckedState(!!defaultChecked);
    };
  }, []);
  var trulyDisabled = isDisabled && !isFocusable;
  var onKeyDown = (0,react.useCallback)(function (event) {
    if (event.key === " ") {
      setActive.on();
    }
  }, [setActive]);
  var onKeyUp = (0,react.useCallback)(function (event) {
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

  (0,use_animation_state_5054a9f7_esm.a)(function () {
    if (!inputRef.current) return;
    var notInSync = inputRef.current.checked !== isChecked;

    if (notInSync) {
      setCheckedState(inputRef.current.checked);
    }
  }, [inputRef.current]);
  var getCheckboxProps = (0,react.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    var onPressDown = function onPressDown(event) {
      // On mousedown, the input blurs and returns focus to the `body`,
      // we need to prevent this. Native checkboxes keeps focus on `input`
      event.preventDefault();
      setActive.on();
    };

    return chakra_ui_checkbox_esm_extends({}, props, {
      ref: forwardedRef,
      "data-active": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isActive),
      "data-hover": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isHovered),
      "data-checked": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isChecked),
      "data-focus": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isFocused),
      "data-focus-visible": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isFocused && isFocusVisible),
      "data-indeterminate": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isIndeterminate),
      "data-disabled": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isDisabled),
      "data-invalid": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isInvalid),
      "data-readonly": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isReadOnly),
      "aria-hidden": true,
      onMouseDown: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onMouseDown, onPressDown),
      onMouseUp: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onMouseUp, setActive.off),
      onMouseEnter: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onMouseEnter, setHovered.on),
      onMouseLeave: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onMouseLeave, setHovered.off)
    });
  }, [isActive, isChecked, isDisabled, isFocused, isFocusVisible, isHovered, isIndeterminate, isInvalid, isReadOnly, setActive, setHovered.off, setHovered.on]);
  var getRootProps = (0,react.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return chakra_ui_checkbox_esm_extends({}, htmlProps, props, {
      ref: (0,chakra_ui_react_utils_esm/* mergeRefs */.lq)(forwardedRef, function (node) {
        if (!node) return;
        setRootIsLabelElement(node.tagName === "LABEL");
      }),
      onClick: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onClick, function () {
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
          (0,chakra_ui_utils_esm/* focus */.T_)(inputRef.current, {
            nextTick: true
          });
        }
      }),
      "data-disabled": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isDisabled),
      "data-checked": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isChecked),
      "data-invalid": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isInvalid)
    });
  }, [htmlProps, isDisabled, isChecked, isInvalid, rootIsLabelElement]);
  var getInputProps = (0,react.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return chakra_ui_checkbox_esm_extends({}, props, {
      ref: (0,chakra_ui_react_utils_esm/* mergeRefs */.lq)(inputRef, forwardedRef),
      type: "checkbox",
      name: name,
      value: value,
      id: id,
      tabIndex: tabIndex,
      onChange: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onChange, handleChange),
      onBlur: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onBlur, onBlurProp, setFocused.off),
      onFocus: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onFocus, onFocusProp, setFocused.on),
      onKeyDown: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onKeyDown, onKeyDown),
      onKeyUp: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onKeyUp, onKeyUp),
      required: isRequired,
      checked: isChecked,
      disabled: trulyDisabled,
      readOnly: isReadOnly,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": isDisabled,
      style: chakra_ui_visually_hidden_esm/* visuallyHiddenStyle */.NL
    });
  }, [name, value, id, handleChange, setFocused.off, setFocused.on, onBlurProp, onFocusProp, onKeyDown, onKeyUp, isRequired, isChecked, trulyDisabled, isReadOnly, ariaLabel, ariaLabelledBy, ariaInvalid, isInvalid, ariaDescribedBy, isDisabled, tabIndex]);
  var getLabelProps = (0,react.useCallback)(function (props, forwardedRef) {
    if (props === void 0) {
      props = {};
    }

    if (forwardedRef === void 0) {
      forwardedRef = null;
    }

    return chakra_ui_checkbox_esm_extends({}, props, {
      ref: forwardedRef,
      onMouseDown: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onMouseDown, stopEvent),
      onTouchStart: (0,chakra_ui_utils_esm/* callAllHandlers */.v0)(props.onTouchStart, stopEvent),
      "data-disabled": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isDisabled),
      "data-checked": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isChecked),
      "data-invalid": (0,chakra_ui_utils_esm/* dataAttr */.PB)(isInvalid)
    });
  }, [isChecked, isDisabled, isInvalid]);
  var state = {
    isInvalid: isInvalid,
    isFocused: isFocused,
    isChecked: isChecked,
    isActive: isActive,
    isHovered: isHovered,
    isIndeterminate: isIndeterminate,
    isDisabled: isDisabled,
    isReadOnly: isReadOnly,
    isRequired: isRequired
  };
  return {
    state: state,
    getRootProps: getRootProps,
    getCheckboxProps: getCheckboxProps,
    getInputProps: getInputProps,
    getLabelProps: getLabelProps,
    htmlProps: htmlProps
  };
}
/**
 * Prevent `onBlur` being fired when the checkbox label is touched
 */

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

var chakra_ui_checkbox_esm_excluded = ["spacing", "className", "children", "iconColor", "iconSize", "icon", "isChecked", "isDisabled", "onChange", "inputProps"];
var CheckboxControl = (0,chakra_ui_system_esm/* chakra */.m$)("span", {
  baseStyle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "top",
    userSelect: "none",
    flexShrink: 0
  }
});
var Label = (0,chakra_ui_system_esm/* chakra */.m$)("label", {
  baseStyle: {
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "top",
    position: "relative"
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
var Checkbox = /*#__PURE__*/(0,chakra_ui_system_esm/* forwardRef */.Gp)(function (props, ref) {
  var group = useCheckboxGroupContext();

  var mergedProps = chakra_ui_checkbox_esm_extends({}, group, props);

  var styles = (0,chakra_ui_system_esm/* useMultiStyleConfig */.jC)("Checkbox", mergedProps);
  var ownProps = (0,chakra_ui_system_esm/* omitThemingProps */.Lr)(props);

  var _ownProps$spacing = ownProps.spacing,
      spacing = _ownProps$spacing === void 0 ? "0.5rem" : _ownProps$spacing,
      className = ownProps.className,
      children = ownProps.children,
      iconColor = ownProps.iconColor,
      iconSize = ownProps.iconSize,
      _ownProps$icon = ownProps.icon,
      icon = _ownProps$icon === void 0 ? /*#__PURE__*/react.createElement(CheckboxIcon, null) : _ownProps$icon,
      isCheckedProp = ownProps.isChecked,
      _ownProps$isDisabled = ownProps.isDisabled,
      isDisabled = _ownProps$isDisabled === void 0 ? group == null ? void 0 : group.isDisabled : _ownProps$isDisabled,
      onChangeProp = ownProps.onChange,
      inputProps = ownProps.inputProps,
      rest = chakra_ui_checkbox_esm_objectWithoutPropertiesLoose(ownProps, chakra_ui_checkbox_esm_excluded);

  var isChecked = isCheckedProp;

  if (group != null && group.value && ownProps.value) {
    isChecked = group.value.includes(ownProps.value);
  }

  var onChange = onChangeProp;

  if (group != null && group.onChange && ownProps.value) {
    onChange = (0,chakra_ui_utils_esm/* callAll */.PP)(group.onChange, onChangeProp);
  }

  var _useCheckbox = useCheckbox(chakra_ui_checkbox_esm_extends({}, rest, {
    isDisabled: isDisabled,
    isChecked: isChecked,
    onChange: onChange
  })),
      state = _useCheckbox.state,
      getInputProps = _useCheckbox.getInputProps,
      getCheckboxProps = _useCheckbox.getCheckboxProps,
      getLabelProps = _useCheckbox.getLabelProps,
      getRootProps = _useCheckbox.getRootProps;

  var iconStyles = react.useMemo(function () {
    return chakra_ui_checkbox_esm_extends({
      opacity: state.isChecked || state.isIndeterminate ? 1 : 0,
      transform: state.isChecked || state.isIndeterminate ? "scale(1)" : "scale(0.95)",
      fontSize: iconSize,
      color: iconColor
    }, styles.icon);
  }, [iconColor, iconSize, state.isChecked, state.isIndeterminate, styles.icon]);
  var clonedIcon = /*#__PURE__*/react.cloneElement(icon, {
    __css: iconStyles,
    isIndeterminate: state.isIndeterminate,
    isChecked: state.isChecked
  });
  return /*#__PURE__*/react.createElement(Label, chakra_ui_checkbox_esm_extends({
    __css: styles.container,
    className: (0,chakra_ui_utils_esm.cx)("chakra-checkbox", className)
  }, getRootProps()), /*#__PURE__*/react.createElement("input", chakra_ui_checkbox_esm_extends({
    className: "chakra-checkbox__input"
  }, getInputProps(inputProps, ref))), /*#__PURE__*/react.createElement(CheckboxControl, chakra_ui_checkbox_esm_extends({
    __css: styles.control,
    className: "chakra-checkbox__control"
  }, getCheckboxProps()), clonedIcon), children && /*#__PURE__*/react.createElement(chakra_ui_system_esm/* chakra.span */.m$.span, chakra_ui_checkbox_esm_extends({
    className: "chakra-checkbox__label"
  }, getLabelProps(), {
    __css: chakra_ui_checkbox_esm_extends({
      marginStart: spacing
    }, styles.label)
  }), children));
});

if (chakra_ui_utils_esm/* __DEV__ */.Ts) {
  Checkbox.displayName = "Checkbox";
}




/***/ }),

/***/ 8527:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "M5": function() { return /* binding */ Center; },
/* harmony export */   "X6": function() { return /* binding */ Heading; },
/* harmony export */   "gC": function() { return /* binding */ VStack; },
/* harmony export */   "iz": function() { return /* binding */ Divider; }
/* harmony export */ });
/* unused harmony exports AbsoluteCenter, AspectRatio, Badge, Box, Circle, Code, Container, Flex, Grid, GridItem, HStack, Kbd, Link, LinkBox, LinkOverlay, List, ListIcon, ListItem, OrderedList, SimpleGrid, Spacer, Square, Stack, StackDivider, StackItem, Text, UnorderedList, Wrap, WrapItem */
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2846);
/* harmony import */ var _chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4244);
/* harmony import */ var _chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5031);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294);
/* harmony import */ var _chakra_ui_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(894);
/* harmony import */ var _chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6450);






function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
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

var _excluded$h = ["ratio", "children", "className"];

/**
 * React component used to cropping media (videos, images and maps)
 * to a desired aspect ratio.
 *
 * @see Docs https://chakra-ui.com/aspectratiobox
 */
var AspectRatio = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _props$ratio = props.ratio,
      ratio = _props$ratio === void 0 ? 4 / 3 : _props$ratio,
      children = props.children,
      className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded$h); // enforce single child


  var child = react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children);

  var _className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-aspect-ratio", className);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    position: "relative",
    className: _className,
    _before: {
      height: 0,
      content: "\"\"",
      display: "block",
      paddingBottom: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(ratio, function (r) {
        return 1 / r * 100 + "%";
      })
    },
    __css: {
      "& > *:not(style)": {
        overflow: "hidden",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
      },
      "& > img, & > video": {
        objectFit: "cover"
      }
    }
  }, rest), child);
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  AspectRatio.displayName = "AspectRatio";
}

var _excluded$g = ["className"];

/**
 * React component used to display notifications, messages, or
 * statuses in different shapes and sizes.
 *
 * @see Docs https://chakra-ui.com/badge
 */
var Badge = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Badge", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props);
      _omitThemingProps.className;
      var rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$g);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.span */ .m$.span, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-badge", props.className)
  }, rest, {
    __css: _extends({
      display: "inline-block",
      whiteSpace: "nowrap",
      verticalAlign: "middle"
    }, styles)
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Badge.displayName = "Badge";
}

var _excluded$f = ["size", "centerContent"],
    _excluded2$5 = ["size"];

/**
 * Box is the most abstract component on top of which other chakra
 * components are built. It renders a `div` element by default.
 *
 * @see Docs https://chakra-ui.com/box
 */
var Box = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra */ .m$)("div");

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Box.displayName = "Box";
}
/**
 * As a constraint, you can't pass size related props
 * Only `size` would be allowed
 */


var Square = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var size = props.size,
      _props$centerContent = props.centerContent,
      centerContent = _props$centerContent === void 0 ? true : _props$centerContent,
      rest = _objectWithoutPropertiesLoose(props, _excluded$f);

  var styles = centerContent ? {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } : {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Box, _extends({
    ref: ref,
    boxSize: size,
    __css: _extends({}, styles, {
      flexShrink: 0,
      flexGrow: 0
    })
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Square.displayName = "Square";
}

var Circle = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var size = props.size,
      rest = _objectWithoutPropertiesLoose(props, _excluded2$5);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Square, _extends({
    size: size,
    ref: ref,
    borderRadius: "9999px"
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Circle.displayName = "Circle";
}

var _excluded$e = (/* unused pure expression or super */ null && (["axis"]));

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

var AbsoluteCenter = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef(function (props, ref) {
  var _props$axis = props.axis,
      axis = _props$axis === void 0 ? "both" : _props$axis,
      rest = _objectWithoutPropertiesLoose(props, _excluded$e);

  return /*#__PURE__*/React.createElement(chakra.div, _extends({
    ref: ref,
    __css: centerStyles[axis]
  }, rest, {
    position: "absolute"
  }));
})));

var _excluded$d = ["className"];

/**
 * React component to render inline code snippets.
 *
 * @see Docs https://chakra-ui.com/code
 */
var Code = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Code", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props);
      _omitThemingProps.className;
      var rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$d);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.code */ .m$.code, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-code", props.className)
  }, rest, {
    __css: _extends({
      display: "inline-block"
    }, styles)
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Code.displayName = "Code";
}

var _excluded$c = ["className", "centerContent"];

/**
 * Layout component used to wrap app or website content
 *
 * It sets `margin-left` and `margin-right` to `auto`,
 * to keep its content centered.
 *
 * It also sets a default max-width of `60ch` (60 characters).
 */
var Container = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props),
      className = _omitThemingProps.className,
      centerContent = _omitThemingProps.centerContent,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$c);

  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Container", props);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-container", className)
  }, rest, {
    __css: _extends({}, styles, centerContent && {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    })
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Container.displayName = "Container";
}

var _excluded$b = ["borderLeftWidth", "borderBottomWidth", "borderTopWidth", "borderRightWidth", "borderWidth", "borderStyle", "borderColor"],
    _excluded2$4 = ["className", "orientation", "__css"];
/**
 * Layout component used to visually separate content in a list or group.
 * It displays a thin horizontal or vertical line, and renders a `hr` tag.
 *
 * @see Docs https://chakra-ui.com/divider
 */

var Divider = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _useStyleConfig = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Divider", props),
      borderLeftWidth = _useStyleConfig.borderLeftWidth,
      borderBottomWidth = _useStyleConfig.borderBottomWidth,
      borderTopWidth = _useStyleConfig.borderTopWidth,
      borderRightWidth = _useStyleConfig.borderRightWidth,
      borderWidth = _useStyleConfig.borderWidth,
      borderStyle = _useStyleConfig.borderStyle,
      borderColor = _useStyleConfig.borderColor,
      styles = _objectWithoutPropertiesLoose(_useStyleConfig, _excluded$b);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props),
      className = _omitThemingProps.className,
      _omitThemingProps$ori = _omitThemingProps.orientation,
      orientation = _omitThemingProps$ori === void 0 ? "horizontal" : _omitThemingProps$ori,
      __css = _omitThemingProps.__css,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded2$4);

  var dividerStyles = {
    vertical: {
      borderLeftWidth: borderLeftWidth || borderRightWidth || borderWidth || "1px",
      height: "100%"
    },
    horizontal: {
      borderBottomWidth: borderBottomWidth || borderTopWidth || borderWidth || "1px",
      width: "100%"
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.hr */ .m$.hr, _extends({
    ref: ref,
    "aria-orientation": orientation
  }, rest, {
    __css: _extends({}, styles, {
      border: "0",
      borderColor: borderColor,
      borderStyle: borderStyle
    }, dividerStyles[orientation], __css),
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-divider", className)
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Divider.displayName = "Divider";
}

var _excluded$a = ["direction", "align", "justify", "wrap", "basis", "grow", "shrink"];

/**
 * React component used to create flexbox layouts.
 *
 * It renders a `div` with `display: flex` and
 * comes with helpful style shorthand.
 *
 * @see Docs https://chakra-ui.com/flex
 */
var Flex = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var direction = props.direction,
      align = props.align,
      justify = props.justify,
      wrap = props.wrap,
      basis = props.basis,
      grow = props.grow,
      shrink = props.shrink,
      rest = _objectWithoutPropertiesLoose(props, _excluded$a);

  var styles = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    __css: styles
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Flex.displayName = "Flex";
}

var _excluded$9 = ["templateAreas", "gap", "rowGap", "columnGap", "column", "row", "autoFlow", "autoRows", "templateRows", "autoColumns", "templateColumns"],
    _excluded2$3 = (/* unused pure expression or super */ null && (["area", "colSpan", "colStart", "colEnd", "rowEnd", "rowSpan", "rowStart"]));

/**
 * React component used to create grid layouts.
 *
 * It renders a `div` with `display: grid` and
 * comes with helpful style shorthand.
 *
 * @see Docs https://chakra-ui.com/grid
 */
var Grid = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var templateAreas = props.templateAreas,
      gap = props.gap,
      rowGap = props.rowGap,
      columnGap = props.columnGap,
      column = props.column,
      row = props.row,
      autoFlow = props.autoFlow,
      autoRows = props.autoRows,
      templateRows = props.templateRows,
      autoColumns = props.autoColumns,
      templateColumns = props.templateColumns,
      rest = _objectWithoutPropertiesLoose(props, _excluded$9);

  var styles = {
    display: "grid",
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    __css: styles
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Grid.displayName = "Grid";
}

function spanFn(span) {
  return mapResponsive(span, function (value) {
    return value === "auto" ? "auto" : "span " + value + "/span " + value;
  });
}

var GridItem = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef(function (props, ref) {
  var area = props.area,
      colSpan = props.colSpan,
      colStart = props.colStart,
      colEnd = props.colEnd,
      rowEnd = props.rowEnd,
      rowSpan = props.rowSpan,
      rowStart = props.rowStart,
      rest = _objectWithoutPropertiesLoose(props, _excluded2$3);

  var styles = filterUndefined({
    gridArea: area,
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

var _excluded$8 = ["className"];
var Heading = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Heading", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props);
      _omitThemingProps.className;
      var rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$8);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.h2 */ .m$.h2, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-heading", props.className)
  }, rest, {
    __css: styles
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Heading.displayName = "Heading";
}

var _excluded$7 = ["className"];

/**
 * Semantic component to render a keyboard shortcut
 * within an application.
 *
 * @example
 *
 * ```jsx
 * <Kbd>⌘ + T</Kbd>
 * ```
 *
 * @see Docs https://chakra-ui.com/kbd
 */
var Kbd = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Kbd", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props),
      className = _omitThemingProps.className,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$7);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.kbd */ .m$.kbd, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-kbd", className)
  }, rest, {
    __css: _extends({
      fontFamily: "mono"
    }, styles)
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Kbd.displayName = "Kbd";
}

var _excluded$6 = ["className", "isExternal"];

/**
 * Links are accessible elements used primarily for navigation.
 *
 * It integrates well with other routing libraries like
 * React Router, Reach Router and Next.js Link.
 *
 * @example
 *
 * ```jsx
 * <Link as={ReactRouterLink} to="/home">Home</Link>
 * ```
 *
 * @see Docs https://chakra-ui.com/link
 */
var Link = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Link", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props),
      className = _omitThemingProps.className,
      isExternal = _omitThemingProps.isExternal,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$6);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.a */ .m$.a, _extends({
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener" : undefined,
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-link", className)
  }, rest, {
    __css: styles
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Link.displayName = "Link";
}

var _excluded$5 = ["children", "styleType", "stylePosition", "spacing"],
    _excluded2$2 = ["as"],
    _excluded3 = ["as"];

var _createStylesContext = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .createStylesContext */ .eC)("List"),
    StylesProvider = _createStylesContext[0],
    useStyles = _createStylesContext[1];

/**
 * List is used to display list items, it renders a `<ul>` by default.
 *
 * @see Docs https://chakra-ui.com/list
 */
var List = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _ref;

  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useMultiStyleConfig */ .jC)("List", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props),
      children = _omitThemingProps.children,
      _omitThemingProps$sty = _omitThemingProps.styleType,
      styleType = _omitThemingProps$sty === void 0 ? "none" : _omitThemingProps$sty,
      stylePosition = _omitThemingProps.stylePosition,
      spacing = _omitThemingProps.spacing,
      rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$5);

  var validChildren = (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_3__/* .getValidChildren */ .WR)(children);
  var selector = "& > *:not(style) ~ *:not(style)";
  var spacingStyle = spacing ? (_ref = {}, _ref[selector] = {
    mt: spacing
  }, _ref) : {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(StylesProvider, {
    value: styles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.ul */ .m$.ul, _extends({
    ref: ref,
    listStyleType: styleType,
    listStylePosition: stylePosition
    /**
     * We added this role to fix the Safari accessibility issue with list-style-type: none
     * @see https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
     */
    ,
    role: "list",
    __css: _extends({}, styles.container, spacingStyle)
  }, rest), validChildren));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  List.displayName = "List";
}

var OrderedList = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  props.as;
      var rest = _objectWithoutPropertiesLoose(props, _excluded2$2);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(List, _extends({
    ref: ref,
    as: "ol",
    styleType: "decimal",
    marginStart: "1em"
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  OrderedList.displayName = "OrderedList";
}

var UnorderedList = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  props.as;
      var rest = _objectWithoutPropertiesLoose(props, _excluded3);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(List, _extends({
    ref: ref,
    as: "ul",
    styleType: "initial",
    marginStart: "1em"
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  UnorderedList.displayName = "UnorderedList";
}

/**
 * ListItem
 *
 * Used to render a list item
 */
var ListItem = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.li */ .m$.li, _extends({
    ref: ref
  }, props, {
    __css: styles.item
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  ListItem.displayName = "ListItem";
}
/**
 * ListIcon
 *
 * Used to render an icon beside the list item text
 */


var ListIcon = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_icon__WEBPACK_IMPORTED_MODULE_4__/* .Icon */ .JO, _extends({
    ref: ref,
    role: "presentation"
  }, props, {
    __css: styles.icon
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  ListIcon.displayName = "ListIcon";
}

var _excluded$4 = ["columns", "spacingX", "spacingY", "spacing", "minChildWidth"];

/**
 * SimpleGrid
 *
 * React component that uses the `Grid` component and provides
 * a simpler interface to create responsive grid layouts.
 * 
 * Provides props that easily define columns and spacing.
 *
 * @see Docs https://chakra-ui.com/simplegrid
 */
var SimpleGrid = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var columns = props.columns,
      spacingX = props.spacingX,
      spacingY = props.spacingY,
      spacing = props.spacing,
      minChildWidth = props.minChildWidth,
      rest = _objectWithoutPropertiesLoose(props, _excluded$4);

  var templateColumns = minChildWidth ? widthToColumns(minChildWidth) : countToColumns(columns);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Grid, _extends({
    ref: ref,
    gap: spacing,
    columnGap: spacingX,
    rowGap: spacingY,
    templateColumns: templateColumns
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  SimpleGrid.displayName = "SimpleGrid";
}

function toPx(n) {
  return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .isNumber */ .hj)(n) ? n + "px" : n;
}

function widthToColumns(width) {
  return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(width, function (value) {
    return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .isNull */ .Ft)(value) ? null : "repeat(auto-fit, minmax(" + toPx(value) + ", 1fr))";
  });
}

function countToColumns(count) {
  return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(count, function (value) {
    return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .isNull */ .Ft)(value) ? null : "repeat(" + value + ", minmax(0, 1fr))";
  });
}

/**
 * A flexible flex spacer that expands along the major axis of its containing flex layout.
 * It renders a `div` by default, and takes up any available space.
 *
 * @see Docs https://chakra-ui.com/flex#using-the-spacer
 */
var Spacer = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra */ .m$)("div", {
  baseStyle: {
    flex: 1,
    justifySelf: "stretch",
    alignSelf: "stretch"
  }
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Spacer.displayName = "Spacer";
}

/**
 * If we ever run into SSR issues with this, check this post to find a fix for it:
 * @see https://medium.com/@emmenko/patching-lobotomized-owl-selector-for-emotion-ssr-5a582a3c424c
 */
var selector = "& > *:not(style) ~ *:not(style)";
function getStackStyles(options) {
  var _ref;

  var spacing = options.spacing,
      direction = options.direction;
  var directionStyles = {
    column: {
      marginTop: spacing,
      marginEnd: 0,
      marginBottom: 0,
      marginStart: 0
    },
    row: {
      marginTop: 0,
      marginEnd: 0,
      marginBottom: 0,
      marginStart: spacing
    },
    "column-reverse": {
      marginTop: 0,
      marginEnd: 0,
      marginBottom: spacing,
      marginStart: 0
    },
    "row-reverse": {
      marginTop: 0,
      marginEnd: spacing,
      marginBottom: 0,
      marginStart: 0
    }
  };
  return _ref = {
    flexDirection: direction
  }, _ref[selector] = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(direction, function (value) {
    return directionStyles[value];
  }), _ref;
}
function getDividerStyles(options) {
  var spacing = options.spacing,
      direction = options.direction;
  var dividerStyles = {
    column: {
      my: spacing,
      mx: 0,
      borderLeftWidth: 0,
      borderBottomWidth: "1px"
    },
    "column-reverse": {
      my: spacing,
      mx: 0,
      borderLeftWidth: 0,
      borderBottomWidth: "1px"
    },
    row: {
      mx: spacing,
      my: 0,
      borderLeftWidth: "1px",
      borderBottomWidth: 0
    },
    "row-reverse": {
      mx: spacing,
      my: 0,
      borderLeftWidth: "1px",
      borderBottomWidth: 0
    }
  };
  return {
    "&": (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(direction, function (value) {
      return dividerStyles[value];
    })
  };
}

var _excluded$3 = ["isInline", "direction", "align", "justify", "spacing", "wrap", "children", "divider", "className", "shouldWrapChildren"];
var StackDivider = function StackDivider(props) {
  return /*#__PURE__*/React.createElement(chakra.div, _extends({
    className: "chakra-stack__divider"
  }, props, {
    __css: _extends({}, props["__css"], {
      borderWidth: 0,
      alignSelf: "stretch",
      borderColor: "inherit",
      width: "auto",
      height: "auto"
    })
  }));
};
var StackItem = function StackItem(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    className: "chakra-stack__item"
  }, props, {
    __css: _extends({
      display: "inline-block",
      flex: "0 0 auto",
      minWidth: 0
    }, props["__css"])
  }));
};

/**
 * Stacks help you easily create flexible and automatically distributed layouts
 *
 * You can stack elements in the horizontal or vertical direction,
 * and apply a space or/and divider between each element.
 *
 * It uses `display: flex` internally and renders a `div`.
 *
 * @see Docs https://chakra-ui.com/stack
 *
 */
var Stack = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _ref;

  var isInline = props.isInline,
      directionProp = props.direction,
      align = props.align,
      justify = props.justify,
      _props$spacing = props.spacing,
      spacing = _props$spacing === void 0 ? "0.5rem" : _props$spacing,
      wrap = props.wrap,
      children = props.children,
      divider = props.divider,
      className = props.className,
      shouldWrapChildren = props.shouldWrapChildren,
      rest = _objectWithoutPropertiesLoose(props, _excluded$3);

  var direction = isInline ? "row" : directionProp != null ? directionProp : "column";
  var styles = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    return getStackStyles({
      direction: direction,
      spacing: spacing
    });
  }, [direction, spacing]);
  var dividerStyle = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    return getDividerStyles({
      spacing: spacing,
      direction: direction
    });
  }, [spacing, direction]);
  var hasDivider = !!divider;
  var shouldUseChildren = !shouldWrapChildren && !hasDivider;
  var validChildren = (0,_chakra_ui_react_utils__WEBPACK_IMPORTED_MODULE_3__/* .getValidChildren */ .WR)(children);
  var clones = shouldUseChildren ? validChildren : validChildren.map(function (child, index) {
    // Prefer provided child key, fallback to index
    var key = typeof child.key !== "undefined" ? child.key : index;
    var isLast = index + 1 === validChildren.length;
    var wrappedChild = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(StackItem, {
      key: key
    }, child);

    var _child = shouldWrapChildren ? wrappedChild : child;

    if (!hasDivider) return _child;
    var clonedDivider = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(divider, {
      __css: dividerStyle
    });

    var _divider = isLast ? null : clonedDivider;

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      key: key
    }, _child, _divider);
  });

  var _className = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-stack", className);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    display: "flex",
    alignItems: align,
    justifyContent: justify,
    flexDirection: styles.flexDirection,
    flexWrap: wrap,
    className: _className,
    __css: hasDivider ? {} : (_ref = {}, _ref[selector] = styles[selector], _ref)
  }, rest), clones);
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Stack.displayName = "Stack";
}
/**
 * A view that arranges its children in a horizontal line.
 */


var HStack = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Stack, _extends({
    align: "center"
  }, props, {
    direction: "row",
    ref: ref
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  HStack.displayName = "HStack";
}
/**
 * A view that arranges its children in a vertical line.
 */


var VStack = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Stack, _extends({
    align: "center"
  }, props, {
    direction: "column",
    ref: ref
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  VStack.displayName = "VStack";
}

var _excluded$2 = ["className", "align", "decoration", "casing"];

/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://chakra-ui.com/text
 */
var Text = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var styles = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .useStyleConfig */ .mq)("Text", props);

  var _omitThemingProps = (0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .omitThemingProps */ .Lr)(props);
      _omitThemingProps.className;
      _omitThemingProps.align;
      _omitThemingProps.decoration;
      _omitThemingProps.casing;
      var rest = _objectWithoutPropertiesLoose(_omitThemingProps, _excluded$2);

  var aliasedProps = (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .filterUndefined */ .YU)({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.p */ .m$.p, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-text", props.className)
  }, aliasedProps, rest, {
    __css: styles
  }));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Text.displayName = "Text";
}

var _excluded$1 = ["spacing", "spacingX", "spacingY", "children", "justify", "direction", "align", "className", "shouldWrapChildren"],
    _excluded2$1 = ["className"];

function px(value) {
  return typeof value === "number" ? value + "px" : value;
}
/**
 * Layout component used to stack elements that differ in length
 * and are liable to wrap.
 *
 * Common use cases:
 * - Buttons that appear together at the end of forms
 * - Lists of tags and chips
 *
 * @see Docs https://chakra-ui.com/wrap
 */


var Wrap = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var _props$spacing = props.spacing,
      spacing = _props$spacing === void 0 ? "0.5rem" : _props$spacing,
      spacingX = props.spacingX,
      spacingY = props.spacingY,
      children = props.children,
      justify = props.justify,
      direction = props.direction,
      align = props.align,
      className = props.className,
      shouldWrapChildren = props.shouldWrapChildren,
      rest = _objectWithoutPropertiesLoose(props, _excluded$1);

  var styles = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    var _spacingX$spacingY = {
      spacingX: spacingX,
      spacingY: spacingY
    },
        _spacingX$spacingY$sp = _spacingX$spacingY.spacingX,
        x = _spacingX$spacingY$sp === void 0 ? spacing : _spacingX$spacingY$sp,
        _spacingX$spacingY$sp2 = _spacingX$spacingY.spacingY,
        y = _spacingX$spacingY$sp2 === void 0 ? spacing : _spacingX$spacingY$sp2;
    return {
      "--chakra-wrap-x-spacing": function chakraWrapXSpacing(theme) {
        return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(x, function (value) {
          return px((0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .tokenToCSSVar */ .fr)("space", value)(theme));
        });
      },
      "--chakra-wrap-y-spacing": function chakraWrapYSpacing(theme) {
        return (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .mapResponsive */ .XQ)(y, function (value) {
          return px((0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_5__/* .tokenToCSSVar */ .fr)("space", value)(theme));
        });
      },
      "--wrap-x-spacing": "calc(var(--chakra-wrap-x-spacing) / 2)",
      "--wrap-y-spacing": "calc(var(--chakra-wrap-y-spacing) / 2)",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: justify,
      alignItems: align,
      flexDirection: direction,
      listStyleType: "none",
      padding: "0",
      margin: "calc(var(--wrap-y-spacing) * -1) calc(var(--wrap-x-spacing) * -1)",
      "& > *:not(style)": {
        margin: "var(--wrap-y-spacing) var(--wrap-x-spacing)"
      }
    };
  }, [spacing, spacingX, spacingY, justify, align, direction]);
  var childrenToRender = shouldWrapChildren ? react__WEBPACK_IMPORTED_MODULE_0__.Children.map(children, function (child, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrapItem, {
      key: index
    }, child);
  }) : children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.div */ .m$.div, _extends({
    ref: ref,
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-wrap", className),
    overflow: "hidden"
  }, rest), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.ul */ .m$.ul, {
    className: "chakra-wrap__list",
    __css: styles
  }, childrenToRender));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  Wrap.displayName = "Wrap";
}

var WrapItem = /*#__PURE__*/(0,_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .forwardRef */ .Gp)(function (props, ref) {
  var className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded2$1);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chakra_ui_system__WEBPACK_IMPORTED_MODULE_1__/* .chakra.li */ .m$.li, _extends({
    ref: ref,
    __css: {
      display: "flex",
      alignItems: "flex-start"
    },
    className: (0,_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__.cx)("chakra-wrap__listitem", className)
  }, rest));
});

if (_chakra_ui_utils__WEBPACK_IMPORTED_MODULE_2__/* .__DEV__ */ .Ts) {
  WrapItem.displayName = "WrapItem";
}

var _excluded = (/* unused pure expression or super */ null && (["isExternal", "target", "rel", "className"])),
    _excluded2 = (/* unused pure expression or super */ null && (["className"]));
var LinkOverlay = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef(function (props, ref) {
  var isExternal = props.isExternal,
      target = props.target,
      rel = props.rel,
      className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded);

  return /*#__PURE__*/React.createElement(chakra.a, _extends({}, rest, {
    ref: ref,
    className: cx("chakra-linkbox__overlay", className),
    rel: isExternal ? "noopener noreferrer" : rel,
    target: isExternal ? "_blank" : target,
    __css: {
      position: "static",
      "&::before": {
        content: "''",
        cursor: "inherit",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%"
      }
    }
  }));
})));

/**
 * `LinkBox` is used to wrap content areas within a link while ensuring semantic html
 *
 * @see Docs https://chakra-ui.com/docs/navigation/link-overlay
 * @see Resources https://www.sarasoueidan.com/blog/nested-links
 */
var LinkBox = /*#__PURE__*/(/* unused pure expression or super */ null && (forwardRef(function (props, ref) {
  var className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded2);

  return /*#__PURE__*/React.createElement(chakra.div, _extends({
    ref: ref,
    position: "relative"
  }, rest, {
    className: cx("chakra-linkbox", className),
    __css: {
      /* Elevate the links and abbreviations up */
      "a[href]:not(.chakra-linkbox__overlay), abbr[title]": {
        position: "relative",
        zIndex: 1
      }
    }
  }));
})));




/***/ })

}]);