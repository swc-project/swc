"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[905],{

/***/ 9485:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ Tab_Tab; }
});

// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(808);
// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(5773);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/prop-types/index.js
var prop_types = __webpack_require__(3615);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.m.js
var clsx_m = __webpack_require__(8944);
// EXTERNAL MODULE: ../node_modules/@mui/base/composeClasses/composeClasses.js
var composeClasses = __webpack_require__(3892);
// EXTERNAL MODULE: ../node_modules/@mui/material/ButtonBase/ButtonBase.js + 7 modules
var ButtonBase = __webpack_require__(2858);
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/capitalize.js
var capitalize = __webpack_require__(1640);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useThemeProps.js + 1 modules
var useThemeProps = __webpack_require__(2399);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/styled.js + 2 modules
var styled = __webpack_require__(5608);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClass/generateUtilityClass.js
var generateUtilityClass = __webpack_require__(765);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClasses/generateUtilityClasses.js
var generateUtilityClasses = __webpack_require__(2897);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Tab/tabClasses.js

function getTabUtilityClass(slot) {
  return (0,generateUtilityClass/* default */.Z)('MuiTab', slot);
}
const tabClasses = (0,generateUtilityClasses/* default */.Z)('MuiTab', ['root', 'labelIcon', 'textColorInherit', 'textColorPrimary', 'textColorSecondary', 'selected', 'disabled', 'fullWidth', 'wrapped', 'iconWrapper']);
/* harmony default export */ var Tab_tabClasses = (tabClasses);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Tab/Tab.js


const _excluded = ["className", "disabled", "disableFocusRipple", "fullWidth", "icon", "iconPosition", "indicator", "label", "onChange", "onClick", "onFocus", "selected", "selectionFollowsFocus", "textColor", "value", "wrapped"];












const useUtilityClasses = ownerState => {
  const {
    classes,
    textColor,
    fullWidth,
    wrapped,
    icon,
    label,
    selected,
    disabled
  } = ownerState;
  const slots = {
    root: ['root', icon && label && 'labelIcon', `textColor${(0,capitalize/* default */.Z)(textColor)}`, fullWidth && 'fullWidth', wrapped && 'wrapped', selected && 'selected', disabled && 'disabled'],
    iconWrapper: ['iconWrapper']
  };
  return (0,composeClasses/* default */.Z)(slots, getTabUtilityClass, classes);
};

const TabRoot = (0,styled/* default */.ZP)(ButtonBase/* default */.Z, {
  name: 'MuiTab',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.label && ownerState.icon && styles.labelIcon, styles[`textColor${(0,capitalize/* default */.Z)(ownerState.textColor)}`], ownerState.fullWidth && styles.fullWidth, ownerState.wrapped && styles.wrapped];
  }
})(({
  theme,
  ownerState
}) => (0,esm_extends/* default */.Z)({}, theme.typography.button, {
  maxWidth: 360,
  minWidth: 90,
  position: 'relative',
  minHeight: 48,
  flexShrink: 0,
  padding: '12px 16px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  textAlign: 'center'
}, ownerState.label && {
  flexDirection: ownerState.iconPosition === 'top' || ownerState.iconPosition === 'bottom' ? 'column' : 'row'
}, {
  lineHeight: 1.25
}, ownerState.icon && ownerState.label && {
  minHeight: 72,
  paddingTop: 9,
  paddingBottom: 9,
  [`& > .${Tab_tabClasses.iconWrapper}`]: (0,esm_extends/* default */.Z)({}, ownerState.iconPosition === 'top' && {
    marginBottom: 6
  }, ownerState.iconPosition === 'bottom' && {
    marginTop: 6
  }, ownerState.iconPosition === 'start' && {
    marginRight: theme.spacing(1)
  }, ownerState.iconPosition === 'end' && {
    marginLeft: theme.spacing(1)
  })
}, ownerState.textColor === 'inherit' && {
  color: 'inherit',
  opacity: 0.6,
  // same opacity as theme.palette.text.secondary
  [`&.${Tab_tabClasses.selected}`]: {
    opacity: 1
  },
  [`&.${Tab_tabClasses.disabled}`]: {
    opacity: theme.palette.action.disabledOpacity
  }
}, ownerState.textColor === 'primary' && {
  color: theme.palette.text.secondary,
  [`&.${Tab_tabClasses.selected}`]: {
    color: theme.palette.primary.main
  },
  [`&.${Tab_tabClasses.disabled}`]: {
    color: theme.palette.text.disabled
  }
}, ownerState.textColor === 'secondary' && {
  color: theme.palette.text.secondary,
  [`&.${Tab_tabClasses.selected}`]: {
    color: theme.palette.secondary.main
  },
  [`&.${Tab_tabClasses.disabled}`]: {
    color: theme.palette.text.disabled
  }
}, ownerState.fullWidth && {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: 'none'
}, ownerState.wrapped && {
  fontSize: theme.typography.pxToRem(12)
}));
const Tab = /*#__PURE__*/react.forwardRef(function Tab(inProps, ref) {
  const props = (0,useThemeProps/* default */.Z)({
    props: inProps,
    name: 'MuiTab'
  });

  const {
    className,
    disabled = false,
    disableFocusRipple = false,
    // eslint-disable-next-line react/prop-types
    fullWidth,
    icon: iconProp,
    iconPosition = 'top',
    // eslint-disable-next-line react/prop-types
    indicator,
    label,
    onChange,
    onClick,
    onFocus,
    // eslint-disable-next-line react/prop-types
    selected,
    // eslint-disable-next-line react/prop-types
    selectionFollowsFocus,
    // eslint-disable-next-line react/prop-types
    textColor = 'inherit',
    value,
    wrapped = false
  } = props,
        other = (0,objectWithoutPropertiesLoose/* default */.Z)(props, _excluded);

  const ownerState = (0,esm_extends/* default */.Z)({}, props, {
    disabled,
    disableFocusRipple,
    selected,
    icon: !!iconProp,
    iconPosition,
    label: !!label,
    fullWidth,
    textColor,
    wrapped
  });

  const classes = useUtilityClasses(ownerState);
  const icon = iconProp && label && /*#__PURE__*/react.isValidElement(iconProp) ? /*#__PURE__*/react.cloneElement(iconProp, {
    className: (0,clsx_m/* default */.Z)(classes.iconWrapper, iconProp.props.className)
  }) : iconProp;

  const handleClick = event => {
    if (!selected && onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };

  const handleFocus = event => {
    if (selectionFollowsFocus && !selected && onChange) {
      onChange(event, value);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  return /*#__PURE__*/(0,jsx_runtime.jsxs)(TabRoot, (0,esm_extends/* default */.Z)({
    focusRipple: !disableFocusRipple,
    className: (0,clsx_m/* default */.Z)(classes.root, className),
    ref: ref,
    role: "tab",
    "aria-selected": selected,
    disabled: disabled,
    onClick: handleClick,
    onFocus: handleFocus,
    ownerState: ownerState,
    tabIndex: selected ? 0 : -1
  }, other, {
    children: [iconPosition === 'top' || iconPosition === 'start' ? /*#__PURE__*/(0,jsx_runtime.jsxs)(react.Fragment, {
      children: [icon, label]
    }) : /*#__PURE__*/(0,jsx_runtime.jsxs)(react.Fragment, {
      children: [label, icon]
    }), indicator]
  }));
});
 false ? 0 : void 0;
/* harmony default export */ var Tab_Tab = (Tab);

/***/ }),

/***/ 2588:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ Tabs_Tabs; }
});

// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(808);
// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(5773);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/react-is/index.js
var react_is = __webpack_require__(9185);
// EXTERNAL MODULE: ../node_modules/prop-types/index.js
var prop_types = __webpack_require__(3615);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.m.js
var clsx_m = __webpack_require__(8944);
// EXTERNAL MODULE: ../node_modules/@mui/base/composeClasses/composeClasses.js
var composeClasses = __webpack_require__(3892);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/styled.js + 2 modules
var styled = __webpack_require__(5608);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useThemeProps.js + 1 modules
var useThemeProps = __webpack_require__(2399);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useTheme.js
var useTheme = __webpack_require__(4776);
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/debounce.js
var debounce = __webpack_require__(7999);
;// CONCATENATED MODULE: ../node_modules/@mui/utils/esm/scrollLeft.js
// Source from https://github.com/alitaheri/normalize-scroll-left
let cachedType;
/**
 * Based on the jquery plugin https://github.com/othree/jquery.rtl-scroll-type
 *
 * Types of scrollLeft, assuming scrollWidth=100 and direction is rtl.
 *
 * Type             | <- Most Left | Most Right -> | Initial
 * ---------------- | ------------ | ------------- | -------
 * default          | 0            | 100           | 100
 * negative (spec*) | -100         | 0             | 0
 * reverse          | 100          | 0             | 0
 *
 * Edge 85: default
 * Safari 14: negative
 * Chrome 85: negative
 * Firefox 81: negative
 * IE11: reverse
 *
 * spec* https://drafts.csswg.org/cssom-view/#dom-window-scroll
 */

function detectScrollType() {
  if (cachedType) {
    return cachedType;
  }

  const dummy = document.createElement('div');
  const container = document.createElement('div');
  container.style.width = '10px';
  container.style.height = '1px';
  dummy.appendChild(container);
  dummy.dir = 'rtl';
  dummy.style.fontSize = '14px';
  dummy.style.width = '4px';
  dummy.style.height = '1px';
  dummy.style.position = 'absolute';
  dummy.style.top = '-1000px';
  dummy.style.overflow = 'scroll';
  document.body.appendChild(dummy);
  cachedType = 'reverse';

  if (dummy.scrollLeft > 0) {
    cachedType = 'default';
  } else {
    dummy.scrollLeft = 1;

    if (dummy.scrollLeft === 0) {
      cachedType = 'negative';
    }
  }

  document.body.removeChild(dummy);
  return cachedType;
} // Based on https://stackoverflow.com/a/24394376

function getNormalizedScrollLeft(element, direction) {
  const scrollLeft = element.scrollLeft; // Perform the calculations only when direction is rtl to avoid messing up the ltr behavior

  if (direction !== 'rtl') {
    return scrollLeft;
  }

  const type = detectScrollType();

  switch (type) {
    case 'negative':
      return element.scrollWidth - element.clientWidth + scrollLeft;

    case 'reverse':
      return element.scrollWidth - element.clientWidth - scrollLeft;

    default:
      return scrollLeft;
  }
}
;// CONCATENATED MODULE: ../node_modules/@mui/material/internal/animate.js
function easeInOutSin(time) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

function animate(property, element, to, options = {}, cb = () => {}) {
  const {
    ease = easeInOutSin,
    duration = 300 // standard

  } = options;
  let start = null;
  const from = element[property];
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
  };

  const step = timestamp => {
    if (cancelled) {
      cb(new Error('Animation cancelled'));
      return;
    }

    if (start === null) {
      start = timestamp;
    }

    const time = Math.min(1, (timestamp - start) / duration);
    element[property] = ease(time) * (to - from) + from;

    if (time >= 1) {
      requestAnimationFrame(() => {
        cb(null);
      });
      return;
    }

    requestAnimationFrame(step);
  };

  if (from === to) {
    cb(new Error('Element already at target position'));
    return cancel;
  }

  requestAnimationFrame(step);
  return cancel;
}
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/ownerWindow.js
var ownerWindow = __webpack_require__(4255);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Tabs/ScrollbarSize.js


const _excluded = ["onChange"];





const styles = {
  width: 99,
  height: 99,
  position: 'absolute',
  top: -9999,
  overflow: 'scroll'
};
/**
 * @ignore - internal component.
 * The component originates from https://github.com/STORIS/react-scrollbar-size.
 * It has been moved into the core in order to minimize the bundle size.
 */

function ScrollbarSize(props) {
  const {
    onChange
  } = props,
        other = (0,objectWithoutPropertiesLoose/* default */.Z)(props, _excluded);

  const scrollbarHeight = react.useRef();
  const nodeRef = react.useRef(null);

  const setMeasurements = () => {
    scrollbarHeight.current = nodeRef.current.offsetHeight - nodeRef.current.clientHeight;
  };

  react.useEffect(() => {
    const handleResize = (0,debounce/* default */.Z)(() => {
      const prevHeight = scrollbarHeight.current;
      setMeasurements();

      if (prevHeight !== scrollbarHeight.current) {
        onChange(scrollbarHeight.current);
      }
    });
    const containerWindow = (0,ownerWindow/* default */.Z)(nodeRef.current);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [onChange]);
  react.useEffect(() => {
    setMeasurements();
    onChange(scrollbarHeight.current);
  }, [onChange]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)("div", (0,esm_extends/* default */.Z)({
    style: styles,
    ref: nodeRef
  }, other));
}
 false ? 0 : void 0;
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/createSvgIcon.js
var createSvgIcon = __webpack_require__(1934);
;// CONCATENATED MODULE: ../node_modules/@mui/material/internal/svg-icons/KeyboardArrowLeft.js


/**
 * @ignore - internal component.
 */


/* harmony default export */ var KeyboardArrowLeft = ((0,createSvgIcon/* default */.Z)( /*#__PURE__*/(0,jsx_runtime.jsx)("path", {
  d: "M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"
}), 'KeyboardArrowLeft'));
;// CONCATENATED MODULE: ../node_modules/@mui/material/internal/svg-icons/KeyboardArrowRight.js


/**
 * @ignore - internal component.
 */


/* harmony default export */ var KeyboardArrowRight = ((0,createSvgIcon/* default */.Z)( /*#__PURE__*/(0,jsx_runtime.jsx)("path", {
  d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"
}), 'KeyboardArrowRight'));
// EXTERNAL MODULE: ../node_modules/@mui/material/ButtonBase/ButtonBase.js + 7 modules
var ButtonBase = __webpack_require__(2858);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClass/generateUtilityClass.js
var generateUtilityClass = __webpack_require__(765);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClasses/generateUtilityClasses.js
var generateUtilityClasses = __webpack_require__(2897);
;// CONCATENATED MODULE: ../node_modules/@mui/material/TabScrollButton/tabScrollButtonClasses.js

function getTabScrollButtonUtilityClass(slot) {
  return (0,generateUtilityClass/* default */.Z)('MuiTabScrollButton', slot);
}
const tabScrollButtonClasses = (0,generateUtilityClasses/* default */.Z)('MuiTabScrollButton', ['root', 'vertical', 'horizontal', 'disabled']);
/* harmony default export */ var TabScrollButton_tabScrollButtonClasses = (tabScrollButtonClasses);
;// CONCATENATED MODULE: ../node_modules/@mui/material/TabScrollButton/TabScrollButton.js



var _KeyboardArrowLeft, _KeyboardArrowRight;

const TabScrollButton_excluded = ["className", "direction", "orientation", "disabled"];

/* eslint-disable jsx-a11y/aria-role */













const useUtilityClasses = ownerState => {
  const {
    classes,
    orientation,
    disabled
  } = ownerState;
  const slots = {
    root: ['root', orientation, disabled && 'disabled']
  };
  return (0,composeClasses/* default */.Z)(slots, getTabScrollButtonUtilityClass, classes);
};

const TabScrollButtonRoot = (0,styled/* default */.ZP)(ButtonBase/* default */.Z, {
  name: 'MuiTabScrollButton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.orientation && styles[ownerState.orientation]];
  }
})(({
  ownerState
}) => (0,esm_extends/* default */.Z)({
  width: 40,
  flexShrink: 0,
  opacity: 0.8,
  [`&.${TabScrollButton_tabScrollButtonClasses.disabled}`]: {
    opacity: 0
  }
}, ownerState.orientation === 'vertical' && {
  width: '100%',
  height: 40,
  '& svg': {
    transform: `rotate(${ownerState.isRtl ? -90 : 90}deg)`
  }
}));
const TabScrollButton = /*#__PURE__*/react.forwardRef(function TabScrollButton(inProps, ref) {
  const props = (0,useThemeProps/* default */.Z)({
    props: inProps,
    name: 'MuiTabScrollButton'
  });

  const {
    className,
    direction
  } = props,
        other = (0,objectWithoutPropertiesLoose/* default */.Z)(props, TabScrollButton_excluded);

  const theme = (0,useTheme/* default */.Z)();
  const isRtl = theme.direction === 'rtl';

  const ownerState = (0,esm_extends/* default */.Z)({
    isRtl
  }, props);

  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(TabScrollButtonRoot, (0,esm_extends/* default */.Z)({
    component: "div",
    className: (0,clsx_m/* default */.Z)(classes.root, className),
    ref: ref,
    role: null,
    ownerState: ownerState,
    tabIndex: null
  }, other, {
    children: direction === 'left' ? _KeyboardArrowLeft || (_KeyboardArrowLeft = /*#__PURE__*/(0,jsx_runtime.jsx)(KeyboardArrowLeft, {
      fontSize: "small"
    })) : _KeyboardArrowRight || (_KeyboardArrowRight = /*#__PURE__*/(0,jsx_runtime.jsx)(KeyboardArrowRight, {
      fontSize: "small"
    }))
  }));
});
 false ? 0 : void 0;
/* harmony default export */ var TabScrollButton_TabScrollButton = (TabScrollButton);
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/useEventCallback.js
var useEventCallback = __webpack_require__(7151);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Tabs/tabsClasses.js

function getTabsUtilityClass(slot) {
  return (0,generateUtilityClass/* default */.Z)('MuiTabs', slot);
}
const tabsClasses = (0,generateUtilityClasses/* default */.Z)('MuiTabs', ['root', 'vertical', 'flexContainer', 'flexContainerVertical', 'centered', 'scroller', 'fixed', 'scrollableX', 'scrollableY', 'hideScrollbar', 'scrollButtons', 'scrollButtonsHideMobile', 'indicator']);
/* harmony default export */ var Tabs_tabsClasses = (tabsClasses);
// EXTERNAL MODULE: ../node_modules/@mui/material/utils/ownerDocument.js
var ownerDocument = __webpack_require__(2444);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Tabs/Tabs.js


const Tabs_excluded = ["aria-label", "aria-labelledby", "action", "centered", "children", "className", "component", "allowScrollButtonsMobile", "indicatorColor", "onChange", "orientation", "ScrollButtonComponent", "scrollButtons", "selectionFollowsFocus", "TabIndicatorProps", "TabScrollButtonProps", "textColor", "value", "variant", "visibleScrollbar"];





















const nextItem = (list, item) => {
  if (list === item) {
    return list.firstChild;
  }

  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }

  return list.firstChild;
};

const previousItem = (list, item) => {
  if (list === item) {
    return list.lastChild;
  }

  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }

  return list.lastChild;
};

const moveFocus = (list, currentFocus, traversalFunction) => {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus);

  while (nextFocus) {
    // Prevent infinite loop.
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }

      wrappedOnce = true;
    } // Same logic as useAutocomplete.js


    const nextFocusDisabled = nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';

    if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
      // Move to the next element.
      nextFocus = traversalFunction(list, nextFocus);
    } else {
      nextFocus.focus();
      return;
    }
  }
};

const Tabs_useUtilityClasses = ownerState => {
  const {
    vertical,
    fixed,
    hideScrollbar,
    scrollableX,
    scrollableY,
    centered,
    scrollButtonsHideMobile,
    classes
  } = ownerState;
  const slots = {
    root: ['root', vertical && 'vertical'],
    scroller: ['scroller', fixed && 'fixed', hideScrollbar && 'hideScrollbar', scrollableX && 'scrollableX', scrollableY && 'scrollableY'],
    flexContainer: ['flexContainer', vertical && 'flexContainerVertical', centered && 'centered'],
    indicator: ['indicator'],
    scrollButtons: ['scrollButtons', scrollButtonsHideMobile && 'scrollButtonsHideMobile'],
    scrollableX: [scrollableX && 'scrollableX'],
    hideScrollbar: [hideScrollbar && 'hideScrollbar']
  };
  return (0,composeClasses/* default */.Z)(slots, getTabsUtilityClass, classes);
};

const TabsRoot = (0,styled/* default */.ZP)('div', {
  name: 'MuiTabs',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [{
      [`& .${Tabs_tabsClasses.scrollButtons}`]: styles.scrollButtons
    }, {
      [`& .${Tabs_tabsClasses.scrollButtons}`]: ownerState.scrollButtonsHideMobile && styles.scrollButtonsHideMobile
    }, styles.root, ownerState.vertical && styles.vertical];
  }
})(({
  ownerState,
  theme
}) => (0,esm_extends/* default */.Z)({
  overflow: 'hidden',
  minHeight: 48,
  // Add iOS momentum scrolling for iOS < 13.0
  WebkitOverflowScrolling: 'touch',
  display: 'flex'
}, ownerState.vertical && {
  flexDirection: 'column'
}, ownerState.scrollButtonsHideMobile && {
  [`& .${Tabs_tabsClasses.scrollButtons}`]: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}));
const TabsScroller = (0,styled/* default */.ZP)('div', {
  name: 'MuiTabs',
  slot: 'Scroller',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.scroller, ownerState.fixed && styles.fixed, ownerState.hideScrollbar && styles.hideScrollbar, ownerState.scrollableX && styles.scrollableX, ownerState.scrollableY && styles.scrollableY];
  }
})(({
  ownerState
}) => (0,esm_extends/* default */.Z)({
  position: 'relative',
  display: 'inline-block',
  flex: '1 1 auto',
  whiteSpace: 'nowrap'
}, ownerState.fixed && {
  overflowX: 'hidden',
  width: '100%'
}, ownerState.hideScrollbar && {
  // Hide dimensionless scrollbar on MacOS
  scrollbarWidth: 'none',
  // Firefox
  '&::-webkit-scrollbar': {
    display: 'none' // Safari + Chrome

  }
}, ownerState.scrollableX && {
  overflowX: 'auto',
  overflowY: 'hidden'
}, ownerState.scrollableY && {
  overflowY: 'auto',
  overflowX: 'hidden'
}));
const FlexContainer = (0,styled/* default */.ZP)('div', {
  name: 'MuiTabs',
  slot: 'FlexContainer',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.flexContainer, ownerState.vertical && styles.flexContainerVertical, ownerState.centered && styles.centered];
  }
})(({
  ownerState
}) => (0,esm_extends/* default */.Z)({
  display: 'flex'
}, ownerState.vertical && {
  flexDirection: 'column'
}, ownerState.centered && {
  justifyContent: 'center'
}));
const TabsIndicator = (0,styled/* default */.ZP)('span', {
  name: 'MuiTabs',
  slot: 'Indicator',
  overridesResolver: (props, styles) => styles.indicator
})(({
  ownerState,
  theme
}) => (0,esm_extends/* default */.Z)({
  position: 'absolute',
  height: 2,
  bottom: 0,
  width: '100%',
  transition: theme.transitions.create()
}, ownerState.indicatorColor === 'primary' && {
  backgroundColor: theme.palette.primary.main
}, ownerState.indicatorColor === 'secondary' && {
  backgroundColor: theme.palette.secondary.main
}, ownerState.vertical && {
  height: '100%',
  width: 2,
  right: 0
}));
const TabsScrollbarSize = (0,styled/* default */.ZP)(ScrollbarSize, {
  name: 'MuiTabs',
  slot: 'ScrollbarSize'
})({
  overflowX: 'auto',
  overflowY: 'hidden',
  // Hide dimensionless scrollbar on MacOS
  scrollbarWidth: 'none',
  // Firefox
  '&::-webkit-scrollbar': {
    display: 'none' // Safari + Chrome

  }
});
const defaultIndicatorStyle = {};
let warnedOnceTabPresent = false;
const Tabs = /*#__PURE__*/react.forwardRef(function Tabs(inProps, ref) {
  const props = (0,useThemeProps/* default */.Z)({
    props: inProps,
    name: 'MuiTabs'
  });
  const theme = (0,useTheme/* default */.Z)();
  const isRtl = theme.direction === 'rtl';

  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    action,
    centered = false,
    children: childrenProp,
    className,
    component = 'div',
    allowScrollButtonsMobile = false,
    indicatorColor = 'primary',
    onChange,
    orientation = 'horizontal',
    ScrollButtonComponent = TabScrollButton_TabScrollButton,
    scrollButtons = 'auto',
    selectionFollowsFocus,
    TabIndicatorProps = {},
    TabScrollButtonProps = {},
    textColor = 'primary',
    value,
    variant = 'standard',
    visibleScrollbar = false
  } = props,
        other = (0,objectWithoutPropertiesLoose/* default */.Z)(props, Tabs_excluded);

  const scrollable = variant === 'scrollable';
  const vertical = orientation === 'vertical';
  const scrollStart = vertical ? 'scrollTop' : 'scrollLeft';
  const start = vertical ? 'top' : 'left';
  const end = vertical ? 'bottom' : 'right';
  const clientSize = vertical ? 'clientHeight' : 'clientWidth';
  const size = vertical ? 'height' : 'width';

  const ownerState = (0,esm_extends/* default */.Z)({}, props, {
    component,
    allowScrollButtonsMobile,
    indicatorColor,
    orientation,
    vertical,
    scrollButtons,
    textColor,
    variant,
    visibleScrollbar,
    fixed: !scrollable,
    hideScrollbar: scrollable && !visibleScrollbar,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
    centered: centered && !scrollable,
    scrollButtonsHideMobile: !allowScrollButtonsMobile
  });

  const classes = Tabs_useUtilityClasses(ownerState);

  if (false) {}

  const [mounted, setMounted] = react.useState(false);
  const [indicatorStyle, setIndicatorStyle] = react.useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = react.useState({
    start: false,
    end: false
  });
  const [scrollerStyle, setScrollerStyle] = react.useState({
    overflow: 'hidden',
    scrollbarWidth: 0
  });
  const valueToIndex = new Map();
  const tabsRef = react.useRef(null);
  const tabListRef = react.useRef(null);

  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;

    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect(); // create a new object with ClientRect class props + scrollLeft

      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, theme.direction),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      };
    }

    let tabMeta;

    if (tabsNode && value !== false) {
      const children = tabListRef.current.children;

      if (children.length > 0) {
        const tab = children[valueToIndex.get(value)];

        if (false) {}

        tabMeta = tab ? tab.getBoundingClientRect() : null;

        if (false) {}
      }
    }

    return {
      tabsMeta,
      tabMeta
    };
  };

  const updateIndicatorState = (0,useEventCallback/* default */.Z)(() => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();
    let startValue = 0;
    let startIndicator;

    if (vertical) {
      startIndicator = 'top';

      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
      }
    } else {
      startIndicator = isRtl ? 'right' : 'left';

      if (tabMeta && tabsMeta) {
        const correction = isRtl ? tabsMeta.scrollLeftNormalized + tabsMeta.clientWidth - tabsMeta.scrollWidth : tabsMeta.scrollLeft;
        startValue = (isRtl ? -1 : 1) * (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction);
      }
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      // May be wrong until the font is loaded.
      [size]: tabMeta ? tabMeta[size] : 0
    }; // IE11 support, replace with Number.isNaN
    // eslint-disable-next-line no-restricted-globals

    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });

  const scroll = (scrollValue, {
    animation = true
  } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transitions.duration.standard
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };

  const moveTabsScroll = delta => {
    let scrollValue = tabsRef.current[scrollStart];

    if (vertical) {
      scrollValue += delta;
    } else {
      scrollValue += delta * (isRtl ? -1 : 1); // Fix for Edge

      scrollValue *= isRtl && detectScrollType() === 'reverse' ? -1 : 1;
    }

    scroll(scrollValue);
  };

  const getScrollSize = () => {
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children = Array.from(tabListRef.current.children);

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];

      if (totalSize + tab[clientSize] > containerSize) {
        break;
      }

      totalSize += tab[clientSize];
    }

    return totalSize;
  };

  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize());
  };

  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize());
  }; // TODO Remove <ScrollbarSize /> as browser support for hidding the scrollbar
  // with CSS improves.


  const handleScrollbarSizeChange = react.useCallback(scrollbarWidth => {
    setScrollerStyle({
      overflow: null,
      scrollbarWidth
    });
  }, []);

  const getConditionalElements = () => {
    const conditionalElements = {};
    conditionalElements.scrollbarSizeListener = scrollable ? /*#__PURE__*/(0,jsx_runtime.jsx)(TabsScrollbarSize, {
      onChange: handleScrollbarSizeChange,
      className: (0,clsx_m/* default */.Z)(classes.scrollableX, classes.hideScrollbar)
    }) : null;
    const scrollButtonsActive = displayScroll.start || displayScroll.end;
    const showScrollButtons = scrollable && (scrollButtons === 'auto' && scrollButtonsActive || scrollButtons === true);
    conditionalElements.scrollButtonStart = showScrollButtons ? /*#__PURE__*/(0,jsx_runtime.jsx)(ScrollButtonComponent, (0,esm_extends/* default */.Z)({
      orientation: orientation,
      direction: isRtl ? 'right' : 'left',
      onClick: handleStartScrollClick,
      disabled: !displayScroll.start
    }, TabScrollButtonProps, {
      className: (0,clsx_m/* default */.Z)(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    conditionalElements.scrollButtonEnd = showScrollButtons ? /*#__PURE__*/(0,jsx_runtime.jsx)(ScrollButtonComponent, (0,esm_extends/* default */.Z)({
      orientation: orientation,
      direction: isRtl ? 'left' : 'right',
      onClick: handleEndScrollClick,
      disabled: !displayScroll.end
    }, TabScrollButtonProps, {
      className: (0,clsx_m/* default */.Z)(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    return conditionalElements;
  };

  const scrollSelectedIntoView = (0,useEventCallback/* default */.Z)(animation => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();

    if (!tabMeta || !tabsMeta) {
      return;
    }

    if (tabMeta[start] < tabsMeta[start]) {
      // left side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);
      scroll(nextScrollStart, {
        animation
      });
    } else if (tabMeta[end] > tabsMeta[end]) {
      // right side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);
      scroll(nextScrollStart, {
        animation
      });
    }
  });
  const updateScrollButtonState = (0,useEventCallback/* default */.Z)(() => {
    if (scrollable && scrollButtons !== false) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollWidth,
        clientWidth
      } = tabsRef.current;
      let showStartScroll;
      let showEndScroll;

      if (vertical) {
        showStartScroll = scrollTop > 1;
        showEndScroll = scrollTop < scrollHeight - clientHeight - 1;
      } else {
        const scrollLeft = getNormalizedScrollLeft(tabsRef.current, theme.direction); // use 1 for the potential rounding error with browser zooms.

        showStartScroll = isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
        showEndScroll = !isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
      }

      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        setDisplayScroll({
          start: showStartScroll,
          end: showEndScroll
        });
      }
    }
  });
  react.useEffect(() => {
    const handleResize = (0,debounce/* default */.Z)(() => {
      updateIndicatorState();
      updateScrollButtonState();
    });
    const win = (0,ownerWindow/* default */.Z)(tabsRef.current);
    win.addEventListener('resize', handleResize);
    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      Array.from(tabListRef.current.children).forEach(child => {
        resizeObserver.observe(child);
      });
    }

    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateIndicatorState, updateScrollButtonState]);
  const handleTabsScroll = react.useMemo(() => (0,debounce/* default */.Z)(() => {
    updateScrollButtonState();
  }), [updateScrollButtonState]);
  react.useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);
  react.useEffect(() => {
    setMounted(true);
  }, []);
  react.useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
  });
  react.useEffect(() => {
    // Don't animate on the first render.
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);
  react.useImperativeHandle(action, () => ({
    updateIndicator: updateIndicatorState,
    updateScrollButtons: updateScrollButtonState
  }), [updateIndicatorState, updateScrollButtonState]);

  const indicator = /*#__PURE__*/(0,jsx_runtime.jsx)(TabsIndicator, (0,esm_extends/* default */.Z)({}, TabIndicatorProps, {
    className: (0,clsx_m/* default */.Z)(classes.indicator, TabIndicatorProps.className),
    ownerState: ownerState,
    style: (0,esm_extends/* default */.Z)({}, indicatorStyle, TabIndicatorProps.style)
  }));

  let childIndex = 0;
  const children = react.Children.map(childrenProp, child => {
    if (! /*#__PURE__*/react.isValidElement(child)) {
      return null;
    }

    if (false) {}

    const childValue = child.props.value === undefined ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const selected = childValue === value;
    childIndex += 1;
    return /*#__PURE__*/react.cloneElement(child, (0,esm_extends/* default */.Z)({
      fullWidth: variant === 'fullWidth',
      indicator: selected && !mounted && indicator,
      selected,
      selectionFollowsFocus,
      onChange,
      textColor,
      value: childValue
    }, childIndex === 1 && value === false && !child.props.tabIndex ? {
      tabIndex: 0
    } : {}));
  });

  const handleKeyDown = event => {
    const list = tabListRef.current;
    const currentFocus = (0,ownerDocument/* default */.Z)(list).activeElement; // Keyboard navigation assumes that [role="tab"] are siblings
    // though we might warn in the future about nested, interactive elements
    // as a a11y violation

    const role = currentFocus.getAttribute('role');

    if (role !== 'tab') {
      return;
    }

    let previousItemKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    let nextItemKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    if (orientation === 'horizontal' && isRtl) {
      // swap previousItemKey with nextItemKey
      previousItemKey = 'ArrowRight';
      nextItemKey = 'ArrowLeft';
    }

    switch (event.key) {
      case previousItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, previousItem);
        break;

      case nextItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, nextItem);
        break;

      case 'Home':
        event.preventDefault();
        moveFocus(list, null, nextItem);
        break;

      case 'End':
        event.preventDefault();
        moveFocus(list, null, previousItem);
        break;

      default:
        break;
    }
  };

  const conditionalElements = getConditionalElements();
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(TabsRoot, (0,esm_extends/* default */.Z)({
    className: (0,clsx_m/* default */.Z)(classes.root, className),
    ownerState: ownerState,
    ref: ref,
    as: component
  }, other, {
    children: [conditionalElements.scrollButtonStart, conditionalElements.scrollbarSizeListener, /*#__PURE__*/(0,jsx_runtime.jsxs)(TabsScroller, {
      className: classes.scroller,
      ownerState: ownerState,
      style: {
        overflow: scrollerStyle.overflow,
        [vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom']: visibleScrollbar ? undefined : -scrollerStyle.scrollbarWidth
      },
      ref: tabsRef,
      onScroll: handleTabsScroll,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(FlexContainer, {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": orientation === 'vertical' ? 'vertical' : null,
        className: classes.flexContainer,
        ownerState: ownerState,
        onKeyDown: handleKeyDown,
        ref: tabListRef,
        role: "tablist",
        children: children
      }), mounted && indicator]
    }), conditionalElements.scrollButtonEnd]
  }));
});
 false ? 0 : void 0;
/* harmony default export */ var Tabs_Tabs = (Tabs);

/***/ })

}]);