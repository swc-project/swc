(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[828],{

/***/ 3527:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/hub",
      function () {
        return __webpack_require__(619);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 619:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSG": function() { return /* binding */ __N_SSG; },
  "default": function() { return /* binding */ hub_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/@mui/material/Grid/Grid.js + 2 modules
var Grid = __webpack_require__(4384);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(808);
// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(5773);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.m.js
var clsx_m = __webpack_require__(8944);
// EXTERNAL MODULE: ../node_modules/prop-types/index.js
var prop_types = __webpack_require__(3615);
// EXTERNAL MODULE: ../node_modules/@emotion/react/dist/emotion-react.browser.esm.js
var emotion_react_browser_esm = __webpack_require__(43);
// EXTERNAL MODULE: ../node_modules/@mui/base/composeClasses/composeClasses.js
var composeClasses = __webpack_require__(3892);
;// CONCATENATED MODULE: ../node_modules/@mui/material/styles/cssUtils.js
function isUnitless(value) {
  return String(parseFloat(value)).length === String(value).length;
} // Ported from Compass
// https://github.com/Compass/compass/blob/master/core/stylesheets/compass/typography/_units.scss
// Emulate the sass function "unit"

function getUnit(input) {
  return String(input).match(/[\d.\-+]*\s*(.*)/)[1] || '';
} // Emulate the sass function "unitless"

function toUnitless(length) {
  return parseFloat(length);
} // Convert any CSS <length> or <percentage> value to any another.
// From https://github.com/KyleAMathews/convert-css-length

function convertLength(baseFontSize) {
  return (length, toUnit) => {
    const fromUnit = getUnit(length); // Optimize for cases where `from` and `to` units are accidentally the same.

    if (fromUnit === toUnit) {
      return length;
    } // Convert input length to pixels.


    let pxLength = toUnitless(length);

    if (fromUnit !== 'px') {
      if (fromUnit === 'em') {
        pxLength = toUnitless(length) * toUnitless(baseFontSize);
      } else if (fromUnit === 'rem') {
        pxLength = toUnitless(length) * toUnitless(baseFontSize);
      }
    } // Convert length in pixels to the output unit


    let outputLength = pxLength;

    if (toUnit !== 'px') {
      if (toUnit === 'em') {
        outputLength = pxLength / toUnitless(baseFontSize);
      } else if (toUnit === 'rem') {
        outputLength = pxLength / toUnitless(baseFontSize);
      } else {
        return length;
      }
    }

    return parseFloat(outputLength.toFixed(5)) + toUnit;
  };
}
function alignProperty({
  size,
  grid
}) {
  const sizeBelow = size - size % grid;
  const sizeAbove = sizeBelow + grid;
  return size - sizeBelow < sizeAbove - size ? sizeBelow : sizeAbove;
} // fontGrid finds a minimal grid (in rem) for the fontSize values so that the
// lineHeight falls under a x pixels grid, 4px in the case of Material Design,
// without changing the relative line height

function fontGrid({
  lineHeight,
  pixels,
  htmlFontSize
}) {
  return pixels / (lineHeight * htmlFontSize);
}
/**
 * generate a responsive version of a given CSS property
 * @example
 * responsiveProperty({
 *   cssProperty: 'fontSize',
 *   min: 15,
 *   max: 20,
 *   unit: 'px',
 *   breakpoints: [300, 600],
 * })
 *
 * // this returns
 *
 * {
 *   fontSize: '15px',
 *   '@media (min-width:300px)': {
 *     fontSize: '17.5px',
 *   },
 *   '@media (min-width:600px)': {
 *     fontSize: '20px',
 *   },
 * }
 * @param {Object} params
 * @param {string} params.cssProperty - The CSS property to be made responsive
 * @param {number} params.min - The smallest value of the CSS property
 * @param {number} params.max - The largest value of the CSS property
 * @param {string} [params.unit] - The unit to be used for the CSS property
 * @param {Array.number} [params.breakpoints]  - An array of breakpoints
 * @param {number} [params.alignStep] - Round scaled value to fall under this grid
 * @returns {Object} responsive styles for {params.cssProperty}
 */

function responsiveProperty({
  cssProperty,
  min,
  max,
  unit = 'rem',
  breakpoints = [600, 900, 1200],
  transform = null
}) {
  const output = {
    [cssProperty]: `${min}${unit}`
  };
  const factor = (max - min) / breakpoints[breakpoints.length - 1];
  breakpoints.forEach(breakpoint => {
    let value = min + factor * breakpoint;

    if (transform !== null) {
      value = transform(value);
    }

    output[`@media (min-width:${breakpoint}px)`] = {
      [cssProperty]: `${Math.round(value * 10000) / 10000}${unit}`
    };
  });
  return output;
}
// EXTERNAL MODULE: ../node_modules/@mui/system/esm/colorManipulator.js
var colorManipulator = __webpack_require__(7818);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/styled.js + 2 modules
var styled = __webpack_require__(5608);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useThemeProps.js + 1 modules
var useThemeProps = __webpack_require__(2399);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClass/generateUtilityClass.js
var generateUtilityClass = __webpack_require__(765);
// EXTERNAL MODULE: ../node_modules/@mui/base/generateUtilityClasses/generateUtilityClasses.js
var generateUtilityClasses = __webpack_require__(2897);
;// CONCATENATED MODULE: ../node_modules/@mui/material/Skeleton/skeletonClasses.js

function getSkeletonUtilityClass(slot) {
  return (0,generateUtilityClass/* default */.Z)('MuiSkeleton', slot);
}
const skeletonClasses = (0,generateUtilityClasses/* default */.Z)('MuiSkeleton', ['root', 'text', 'rectangular', 'circular', 'pulse', 'wave', 'withChildren', 'fitContent', 'heightAuto']);
/* harmony default export */ var Skeleton_skeletonClasses = ((/* unused pure expression or super */ null && (skeletonClasses)));
;// CONCATENATED MODULE: ../node_modules/@mui/material/Skeleton/Skeleton.js


const _excluded = ["animation", "className", "component", "height", "style", "variant", "width"];

let _ = t => t,
    _t,
    _t2,
    _t3,
    _t4;












const useUtilityClasses = ownerState => {
  const {
    classes,
    variant,
    animation,
    hasChildren,
    width,
    height
  } = ownerState;
  const slots = {
    root: ['root', variant, animation, hasChildren && 'withChildren', hasChildren && !width && 'fitContent', hasChildren && !height && 'heightAuto']
  };
  return (0,composeClasses/* default */.Z)(slots, getSkeletonUtilityClass, classes);
};

const pulseKeyframe = (0,emotion_react_browser_esm/* keyframes */.F4)(_t || (_t = _`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`));
const waveKeyframe = (0,emotion_react_browser_esm/* keyframes */.F4)(_t2 || (_t2 = _`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`));
const SkeletonRoot = (0,styled/* default */.ZP)('span', {
  name: 'MuiSkeleton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], ownerState.animation !== false && styles[ownerState.animation], ownerState.hasChildren && styles.withChildren, ownerState.hasChildren && !ownerState.width && styles.fitContent, ownerState.hasChildren && !ownerState.height && styles.heightAuto];
  }
})(({
  theme,
  ownerState
}) => {
  const radiusUnit = getUnit(theme.shape.borderRadius) || 'px';
  const radiusValue = toUnitless(theme.shape.borderRadius);
  return (0,esm_extends/* default */.Z)({
    display: 'block',
    // Create a "on paper" color with sufficient contrast retaining the color
    backgroundColor: (0,colorManipulator/* alpha */.Fq)(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.11 : 0.13),
    height: '1.2em'
  }, ownerState.variant === 'text' && {
    marginTop: 0,
    marginBottom: 0,
    height: 'auto',
    transformOrigin: '0 55%',
    transform: 'scale(1, 0.60)',
    borderRadius: `${radiusValue}${radiusUnit}/${Math.round(radiusValue / 0.6 * 10) / 10}${radiusUnit}`,
    '&:empty:before': {
      content: '"\\00a0"'
    }
  }, ownerState.variant === 'circular' && {
    borderRadius: '50%'
  }, ownerState.hasChildren && {
    '& > *': {
      visibility: 'hidden'
    }
  }, ownerState.hasChildren && !ownerState.width && {
    maxWidth: 'fit-content'
  }, ownerState.hasChildren && !ownerState.height && {
    height: 'auto'
  });
}, ({
  ownerState
}) => ownerState.animation === 'pulse' && (0,emotion_react_browser_esm/* css */.iv)(_t3 || (_t3 = _`
      animation: ${0} 1.5s ease-in-out 0.5s infinite;
    `), pulseKeyframe), ({
  ownerState,
  theme
}) => ownerState.animation === 'wave' && (0,emotion_react_browser_esm/* css */.iv)(_t4 || (_t4 = _`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 1.6s linear 0.5s infinite;
        background: linear-gradient(90deg, transparent, ${0}, transparent);
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `), waveKeyframe, theme.palette.action.hover));
const Skeleton = /*#__PURE__*/react.forwardRef(function Skeleton(inProps, ref) {
  const props = (0,useThemeProps/* default */.Z)({
    props: inProps,
    name: 'MuiSkeleton'
  });

  const {
    animation = 'pulse',
    className,
    component = 'span',
    height,
    style,
    variant = 'text',
    width
  } = props,
        other = (0,objectWithoutPropertiesLoose/* default */.Z)(props, _excluded);

  const ownerState = (0,esm_extends/* default */.Z)({}, props, {
    animation,
    component,
    variant,
    hasChildren: Boolean(other.children)
  });

  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(SkeletonRoot, (0,esm_extends/* default */.Z)({
    as: component,
    ref: ref,
    className: (0,clsx_m/* default */.Z)(classes.root, className),
    ownerState: ownerState
  }, other, {
    style: (0,esm_extends/* default */.Z)({
      width,
      height
    }, style)
  }));
});
 false ? 0 : void 0;
/* harmony default export */ var Skeleton_Skeleton = (Skeleton);
// EXTERNAL MODULE: ../node_modules/date-fns/esm/formatDistance/index.js + 11 modules
var formatDistance = __webpack_require__(8615);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
// EXTERNAL MODULE: ./src/components/Spacer.tsx
var Spacer = __webpack_require__(7747);
// EXTERNAL MODULE: ./src/components/icons/index.ts + 14 modules
var icons = __webpack_require__(9829);
;// CONCATENATED MODULE: ./src/components/BlockCard.tsx
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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}






var blockWidthStyles = {
    mx: "auto",
    maxWidth: 450,
    /** @todo: set min-width when parent grid has been refactored to use custom breakpoints */ // minWidth: 288,
    width: "100%"
};
var cardHoverTransition = {
    duration: 300,
    easing: "ease"
};
var BlockCardLoading = function() {
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        sx: {
            maxWidth: 450,
            minWidth: 288,
            width: "100%",
            borderRadius: "8px",
            boxShadow: 1,
            overflow: "hidden"
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    backgroundColor: "gray.20",
                    py: 3,
                    px: 2.75
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Skeleton_Skeleton, {
                    variant: "rectangular",
                    height: 186
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                sx: {
                    p: 3,
                    backgroundColor: function(param) {
                        var palette = param.palette;
                        return palette.common.white;
                    }
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Skeleton_Skeleton, {
                        variant: "rectangular",
                        width: "100%",
                        height: 32
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                        height: 1
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Skeleton_Skeleton, {
                        variant: "rectangular",
                        width: "72%",
                        height: 32
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                        height: 3
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Skeleton_Skeleton, {
                        variant: "rectangular",
                        width: "72%",
                        height: 16
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                        height: 1
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Skeleton_Skeleton, {
                        variant: "rectangular",
                        width: "52%",
                        height: 16
                    })
                ]
            })
        ]
    }));
};
var BlockCard = function(param1) {
    var loading = param1.loading, data = param1.data;
    if (loading) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(BlockCardLoading, {}));
    }
    if (!data) {
        return null;
    }
    var displayName = data.displayName, description = data.description, image = data.image, author = data.author, version = data.version, lastUpdated = data.lastUpdated, packagePath = data.packagePath, icon = data.icon;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
        href: "/".concat(packagePath),
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            sx: _objectSpread({}, blockWidthStyles, {
                position: "relative",
                borderRadius: "8px",
                transition: function(param) {
                    var transitions = param.transitions;
                    return transitions.create([
                        "transform"
                    ], cardHoverTransition);
                },
                backgroundColor: function(param) {
                    var palette = param.palette;
                    return palette.common.white;
                },
                cursor: "pointer",
                "&::before, &::after": {
                    content: "\"\"",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    borderRadius: "8px",
                    transition: function(param) {
                        var transitions = param.transitions;
                        return transitions.create([
                            "opacity"
                        ], cardHoverTransition);
                    }
                },
                "&::before": {
                    boxShadow: 1,
                    opacity: 1
                },
                "&::after": {
                    boxShadow: 4,
                    opacity: 0
                },
                "&:hover": {
                    "& .block-card__name": {
                        color: function(param) {
                            var palette = param.palette;
                            return palette.purple[600];
                        }
                    },
                    transform: "scale(1.03)",
                    "&::before": {
                        opacity: 0
                    },
                    "&::after": {
                        opacity: 1
                    }
                }
            }),
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        backgroundColor: function(param) {
                            var palette = param.palette;
                            return palette.gray[20];
                        },
                        py: 3,
                        px: 2.75,
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px"
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            paddingTop: "66.67%",
                            backgroundColor: function(param) {
                                var palette = param.palette;
                                return image ? "transparent" : palette.gray[70];
                            },
                            borderRadius: "4px",
                            position: "relative"
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            sx: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            },
                            children: image ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                component: "img",
                                sx: {
                                    display: "block",
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "contain",
                                    borderRadius: "4px",
                                    filter: "\n                        drop-shadow(0px 2px 8px rgba(39, 50, 86, 0.04))\n                        drop-shadow(0px 2.59259px 6.44213px rgba(39, 50, 86, 0.06))\n                        drop-shadow(0px 0.5px 1px rgba(39, 50, 86, 0.10))\n                      "
                                },
                                src: image
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                display: "flex",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* BlockProtocolLogoIcon */.Et, {
                                    sx: {
                                        color: function(param) {
                                            var palette = param.palette;
                                            return palette.gray[50];
                                        }
                                    }
                                })
                            })
                        })
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    sx: {
                        p: 3
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                mb: 2,
                                display: "flex",
                                alignItems: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    sx: {
                                        mr: 1.5,
                                        width: 24,
                                        height: 24
                                    },
                                    component: "img",
                                    src: icon !== null && icon !== void 0 ? icon : undefined
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    className: "block-card__name",
                                    fontWeight: "600",
                                    variant: "bpLargeText",
                                    children: displayName !== null && displayName !== void 0 ? displayName : undefined
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            sx: {
                                display: "block",
                                color: "gray.70"
                            },
                            children: description && (description === null || description === void 0 ? void 0 : description.length) <= 100 ? description : "".concat(description === null || description === void 0 ? void 0 : description.slice(0, 100), "...")
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                            height: 3
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                typography: "bpMicroCopy",
                                display: "flex",
                                flexWrap: "wrap"
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                                    variant: "bpMicroCopy",
                                    sx: {
                                        color: function(param) {
                                            var palette = param.palette;
                                            return palette.purple[600];
                                        },
                                        mr: 1.5,
                                        mb: 1.5
                                    },
                                    children: [
                                        "@",
                                        author
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    sx: {
                                        mr: 1.5,
                                        mb: 1.5
                                    },
                                    color: "gray.60",
                                    variant: "bpMicroCopy",
                                    children: version
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    color: "gray.60",
                                    variant: "bpMicroCopy",
                                    children: lastUpdated ? "Updated \n              ".concat((0,formatDistance/* default */.Z)(new Date(lastUpdated), new Date(), {
                                        addSuffix: true
                                    })) : ""
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    }));
};
var BlockCardComingSoon = function() {
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        sx: _objectSpread({
            py: 6,
            px: 4.25,
            minHeight: 400
        }, blockWidthStyles, {
            backgroundColor: "white",
            border: function(param) {
                var palette = param.palette;
                return "2px dashed ".concat(palette.gray["30"]);
            },
            borderRadius: "8px"
        }),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                variant: "bpHeading2",
                sx: {
                    lineHeight: 1
                },
                children: "More blocks coming soon"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                height: 3
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    typography: "bpSmallCopy",
                    color: "gray.60"
                },
                children: "We’re working on checklists, kanban boards, blockquotes, and many more..."
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                height: 3
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                sx: {
                    typography: "bpSmallCopy",
                    color: "gray.60"
                },
                children: [
                    "You can also",
                    " ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                        href: "/docs/developing-blocks",
                        sx: {
                            color: function(param) {
                                var palette = param.palette;
                                return palette.purple[600];
                            },
                            fontWeight: 700,
                            textDecoration: "underline"
                        },
                        children: "build your own blocks."
                    })
                ]
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/pages/hub.page.tsx




var HubPage = function(param1) {
    var catalog = param1.catalog;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(head["default"], {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                        children: "Block Protocol - Block Hub"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("meta", {
                        itemProp: "name",
                        content: "Block Hub"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("meta", {
                        itemProp: "description",
                        content: "The Block Protocol's registry of open-source blocks"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                sx: {
                    mb: 20,
                    position: "relative",
                    backgroundImage: "url(/assets/blockhub-gradient.svg)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "30% 50%",
                    backgroundSize: "100% 100%"
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Container/* default */.Z, {
                        sx: {
                            px: {
                                xs: 1,
                                sm: 4
                            }
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                mb: 10,
                                pt: 8,
                                width: {
                                    xs: "100%",
                                    sm: "80%",
                                    md: "65%"
                                },
                                mx: "auto",
                                textAlign: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    mb: {
                                        xs: 2,
                                        md: 3
                                    },
                                    sx: {
                                        color: function(param) {
                                            var palette = param.palette;
                                            return palette.purple[700];
                                        },
                                        fontWeight: 700
                                    },
                                    variant: "bpSmallCaps",
                                    children: "Block Hub"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    mb: 3,
                                    variant: "bpHeading1",
                                    children: "Interactive, data-driven blocks to use in your projects"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    sx: {
                                        color: function(param) {
                                            var palette = param.palette;
                                            return palette.gray[60];
                                        }
                                    },
                                    children: "All open-source and free to use"
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Container/* default */.Z, {
                        sx: {
                            px: "6.5%",
                            maxWidth: {
                                md: 720,
                                lg: 1200
                            }
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Grid/* default */.ZP, {
                            columnSpacing: {
                                xs: 0,
                                sm: 4
                            },
                            rowSpacing: 4,
                            sx: {
                                position: "relative",
                                zIndex: 2
                            },
                            container: true,
                            children: [
                                catalog ? catalog.map(function(block) {
                                    /*#__PURE__*/ return (0,jsx_runtime.jsx)(Grid/* default */.ZP, {
                                        item: true,
                                        xs: 12,
                                        sm: 6,
                                        lg: 4,
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockCard, {
                                            data: block
                                        })
                                    }, block.packagePath);
                                }) : Array.from(Array(6), function(_, index) {
                                    return index + 1;
                                }).map(function(key) {
                                    /*#__PURE__*/ return (0,jsx_runtime.jsx)(Grid/* default */.ZP, {
                                        item: true,
                                        xs: 12,
                                        sm: 6,
                                        lg: 4,
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockCard, {
                                            loading: true
                                        })
                                    }, key);
                                }),
                                catalog && /*#__PURE__*/ (0,jsx_runtime.jsx)(Grid/* default */.ZP, {
                                    item: true,
                                    xs: 12,
                                    sm: 6,
                                    lg: 4,
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockCardComingSoon, {})
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    }));
};
var __N_SSG = true;
/* harmony default export */ var hub_page = (HubPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [615,774,888,179], function() { return __webpack_exec__(3527); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);