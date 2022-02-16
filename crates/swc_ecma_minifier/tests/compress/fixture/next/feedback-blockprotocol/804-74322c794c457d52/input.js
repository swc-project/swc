(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[804],{

/***/ 5318:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MDXContext": function() { return /* binding */ MDXContext; },
/* harmony export */   "MDXProvider": function() { return /* binding */ MDXProvider; },
/* harmony export */   "mdx": function() { return /* binding */ createElement; },
/* harmony export */   "useMDXComponents": function() { return /* binding */ useMDXComponents; },
/* harmony export */   "withMDXComponents": function() { return /* binding */ withMDXComponents; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7378);


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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};

var MDXContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({});
var withMDXComponents = function withMDXComponents(Component) {
  return function (props) {
    var allComponents = useMDXComponents(props.components);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({}, props, {
      components: allComponents
    }));
  };
};
var useMDXComponents = function useMDXComponents(components) {
  var contextComponents = react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);
  var allComponents = contextComponents;

  if (components) {
    allComponents = isFunction(components) ? components(contextComponents) : _objectSpread2(_objectSpread2({}, contextComponents), components);
  }

  return allComponents;
};
var MDXProvider = function MDXProvider(props) {
  var allComponents = useMDXComponents(props.components);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider, {
    value: allComponents
  }, props.children);
};

var TYPE_PROP_NAME = 'mdxType';
var DEFAULTS = {
  inlineCode: 'code',
  wrapper: function wrapper(_ref) {
    var children = _ref.children;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {}, children);
  }
};
var MDXCreateElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function (props, ref) {
  var propComponents = props.components,
      mdxType = props.mdxType,
      originalType = props.originalType,
      parentName = props.parentName,
      etc = _objectWithoutProperties(props, ["components", "mdxType", "originalType", "parentName"]);

  var components = useMDXComponents(propComponents);
  var type = mdxType;
  var Component = components["".concat(parentName, ".").concat(type)] || components[type] || DEFAULTS[type] || originalType;

  if (propComponents) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _objectSpread2(_objectSpread2({
      ref: ref
    }, etc), {}, {
      components: propComponents
    }));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _objectSpread2({
    ref: ref
  }, etc));
});
MDXCreateElement.displayName = 'MDXCreateElement';
function createElement (type, props) {
  var args = arguments;
  var mdxType = props && props.mdxType;

  if (typeof type === 'string' || mdxType) {
    var argsLength = args.length;
    var createElementArgArray = new Array(argsLength);
    createElementArgArray[0] = MDXCreateElement;
    var newProps = {};

    for (var key in props) {
      if (hasOwnProperty.call(props, key)) {
        newProps[key] = props[key];
      }
    }

    newProps.originalType = type;
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType;
    createElementArgArray[1] = newProps;

    for (var i = 2; i < argsLength; i++) {
      createElementArgArray[i] = args[i];
    }

    return react__WEBPACK_IMPORTED_MODULE_0__.createElement.apply(null, createElementArgArray);
  }

  return react__WEBPACK_IMPORTED_MODULE_0__.createElement.apply(null, args);
}




/***/ }),

/***/ 7532:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({ value: true });

var React = __webpack_require__(7378);
var MDX = __webpack_require__(5318);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var MDX__namespace = /*#__PURE__*/_interopNamespace(MDX);

if (typeof window !== 'undefined') {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      var start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start))
          },
        });
      }, 1)
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };
}

/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
function MDXRemote({ compiledSource, scope, components = {}, lazy, }) {
    const [isReadyToRender, setIsReadyToRender] = React.useState(!lazy || typeof window === 'undefined');
    // if we're on the client side and `lazy` is set to true, we hydrate the
    // mdx content inside requestIdleCallback, allowing the page to get to
    // interactive quicker, but the mdx content to hydrate slower.
    React.useEffect(() => {
        if (lazy) {
            const handle = window.requestIdleCallback(() => {
                setIsReadyToRender(true);
            });
            return () => window.cancelIdleCallback(handle);
        }
    }, []);
    const Content = React.useMemo(() => {
        // if we're ready to render, we can assemble the component tree and let React do its thing
        // first we set up the scope which has to include the mdx custom
        // create element function as well as any components we're using
        const fullScope = Object.assign({ mdx: MDX__namespace.mdx, React: React__default['default'] }, scope);
        const keys = Object.keys(fullScope);
        const values = Object.values(fullScope);
        // now we eval the source code using a function constructor
        // in order for this to work we need to have React, the mdx createElement,
        // and all our components in scope for the function, which is the case here
        // we pass the names (via keys) in as the function's args, and execute the
        // function with the actual values.
        const hydrateFn = Reflect.construct(Function, keys.concat(`${compiledSource}; return MDXContent;`));
        return hydrateFn.apply(hydrateFn, values);
    }, [scope, compiledSource]);
    if (!isReadyToRender) {
        // If we're not ready to render, return an empty div to preserve SSR'd markup
        return (React__default['default'].createElement("div", { dangerouslySetInnerHTML: { __html: '' }, suppressHydrationWarning: true }));
    }
    // wrapping the content with MDXProvider will allow us to customize the standard
    // markdown components (such as "h1" or "a") with the "components" object
    const content = (React__default['default'].createElement(MDX__namespace.MDXProvider, { components: components },
        React__default['default'].createElement(Content, null)));
    // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
    return lazy ? React__default['default'].createElement("div", null, content) : content;
}

exports.R = MDXRemote;


/***/ }),

/***/ 6023:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "$": function() { return /* binding */ MDX_TEXT_CONTENT_MAX_WIDTH; },
  "v": function() { return /* binding */ MdxPageContent; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/next/router.js
var next_router = __webpack_require__(6677);
// EXTERNAL MODULE: ../node_modules/next-mdx-remote/dist/index.js
var dist = __webpack_require__(7532);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/slugify/slugify.js
var slugify = __webpack_require__(1485);
var slugify_default = /*#__PURE__*/__webpack_require__.n(slugify);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/styled.js + 2 modules
var styled = __webpack_require__(5608);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/@mui/material/Icon/Icon.js + 1 modules
var Icon = __webpack_require__(9762);
// EXTERNAL MODULE: ../node_modules/@mui/material/Paper/Paper.js + 1 modules
var Paper = __webpack_require__(4919);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
;// CONCATENATED MODULE: ./src/components/InfoCard/InfoCardWrapper.tsx



var INFO_CARD_WIDTH = 275;
var InfoCardWrapper = function(param) {
    var children = param.children;
    var childrenAsArray = react.Children.toArray(children);
    var infoCardElements = childrenAsArray.filter(function(child) {
        /*#__PURE__*/ return (0,react.isValidElement)(child) && child.props.mdxType === "InfoCard";
    });
    if (infoCardElements.length !== 1) {
        throw new Error("Expected InfoCardWrapper to contain exactly one InfoCard, got ".concat(infoCardElements.length));
    }
    var infoCardElement = infoCardElements[0];
    var childrenWithoutInfoCard = childrenAsArray.filter(function(child) {
        return child !== infoCardElement;
    });
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        display: "flex",
        className: "info-card-wrapper",
        sx: {
            flexDirection: {
                xs: "column",
                sm: "row"
            }
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                children: childrenWithoutInfoCard
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    marginLeft: {
                        xs: 0,
                        sm: 4
                    },
                    marginBottom: {
                        xs: 2,
                        sm: 0
                    }
                },
                children: /*#__PURE__*/ (0,react.cloneElement)(infoCardElement, {
                    sx: {
                        width: {
                            xs: "unset",
                            sm: INFO_CARD_WIDTH
                        }
                    }
                })
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/InfoCard/InfoCard.tsx
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



var mapInfoCardVariantToPaperVariant = function(infoCardVariant) {
    if (infoCardVariant === "warning") {
        return "purple";
    }
    return "teal";
};
var InfoCard = function(param1) {
    var _variant = param1.variant, variant = _variant === void 0 ? "info" : _variant, title = param1.title, children = param1.children, sx = param1.sx;
    var paperVariant = mapInfoCardVariantToPaperVariant(variant);
    var ensureChildIsWrappedInTypography = function(child, index) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
            sx: {
                marginTop: 1,
                color: function(param) {
                    var palette = param.palette;
                    return palette[paperVariant][600];
                },
                fontSize: 15,
                lineHeight: 1.5
            },
            children: /*#__PURE__*/ (0,react.isValidElement)(child) ? child.props.children : child
        }, index));
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Paper/* default */.Z, {
        variant: paperVariant,
        sx: _objectSpread({
            marginBottom: 3,
            padding: {
                xs: 2,
                sm: 3
            }
        }, sx, {
            "& a": function(param) {
                var palette = param.palette;
                return {
                    color: palette[paperVariant][600],
                    borderColor: palette[paperVariant][600],
                    ":hover": {
                        color: palette[paperVariant][700],
                        borderColor: palette[paperVariant][700]
                    },
                    ":focus-visible": {
                        outlineColor: palette[paperVariant][600]
                    }
                };
            }
        }),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                variant: "bpLargeText",
                sx: {
                    fontWeight: 600,
                    color: function(param) {
                        var palette = param.palette;
                        return palette[paperVariant][600];
                    },
                    fontSize: 15
                },
                children: title
            }),
            react.Children.toArray(children).map(ensureChildIsWrappedInTypography)
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/Snippet.tsx
var Snippet = __webpack_require__(5397);
;// CONCATENATED MODULE: ./src/components/context/PageHeadingsContext.ts

var PageHeadingsContext = (0,react.createContext)({
    headings: [],
    setHeadings: function() {
        return undefined;
    }
});
/* harmony default export */ var context_PageHeadingsContext = (PageHeadingsContext);

;// CONCATENATED MODULE: ./src/util/mdxComponents.tsx
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function mdxComponents_defineProperty(obj, key, value) {
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
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function mdxComponents_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            mdxComponents_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}









var Heading = (0,styled/* default */.ZP)(Typography/* default */.Z)(function(param) {
    var theme = param.theme;
    return {
        "svg.fa-link": {
            transition: theme.transitions.create("opacity"),
            opacity: 0
        },
        ":hover, a:focus-visible": {
            "svg.fa-link": {
                opacity: 1
            }
        },
        "@media (hover: none)": {
            "svg.fa-link": {
                opacity: 1
            }
        }
    };
});
var usePageHeading = function(props) {
    var headingRef = (0,react.useRef)(null);
    var ref = (0,react.useContext)(context_PageHeadingsContext), headings = ref.headings, setHeadings = ref.setHeadings;
    var anchor = props.anchor;
    (0,react.useEffect)(function() {
        if (headingRef.current && headings.find(function(heading) {
            return heading.anchor === anchor;
        }) === undefined) {
            var element = headingRef.current;
            setHeadings(function(prev) {
                return _toConsumableArray(prev).concat([
                    {
                        anchor: anchor,
                        element: element
                    }
                ]);
            });
        }
    }, [
        anchor,
        headingRef,
        headings,
        setHeadings
    ]);
    return {
        headingRef: headingRef
    };
};
var HeadingAnchor = function(param) {
    var depth = param.depth, anchor = param.anchor;
    var size = depth === 1 ? 28 : depth === 2 ? 24 : 20;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
        href: "#".concat(anchor),
        sx: {
            display: "inline-block",
            verticalAlign: "middle",
            position: "relative",
            marginLeft: 2,
            height: size,
            width: size
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
            sx: {
                fontSize: size,
                position: "absolute",
                lineHeight: size
            },
            className: "fas fa-link"
        })
    }));
};
var stringifyChildren = function(node) {
    if (typeof node === "string") {
        return node;
    } else if (Array.isArray(node)) {
        return node.map(stringifyChildren).join("");
    } else if (!!node && typeof node === "object" && "props" in node) {
        return stringifyChildren(node.props.children);
    }
    return "";
};
var HEADING_MARGIN_TOP = 6;
var HEADING_MARGIN_BOTTOM = 2;
var mdxComponents = {
    Box: Box/* default */.Z,
    Paper: Paper/* default */.Z,
    Typography: Typography/* default */.Z,
    InfoCardWrapper: InfoCardWrapper,
    InfoCard: InfoCard,
    h1: function(props) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var headingRef = usePageHeading({
            anchor: ""
        }).headingRef;
        return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Heading, mdxComponents_objectSpread({
            ref: headingRef,
            mt: HEADING_MARGIN_TOP,
            mb: HEADING_MARGIN_BOTTOM,
            variant: "bpHeading1",
            sx: {
                "&:first-of-type": {
                    marginTop: 0
                }
            }
        }, props, {
            children: [
                props.children,
                /*#__PURE__*/ (0,jsx_runtime.jsx)(HeadingAnchor, {
                    anchor: "",
                    depth: 1
                })
            ]
        })));
    },
    h2: function(props) {
        var anchor = slugify_default()(stringifyChildren(props.children), {
            lower: true
        });
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var headingRef = usePageHeading({
            anchor: anchor
        }).headingRef;
        return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Heading, mdxComponents_objectSpread({
            ref: headingRef,
            mt: HEADING_MARGIN_TOP,
            mb: HEADING_MARGIN_BOTTOM,
            variant: "bpHeading2",
            sx: {
                "&:first-of-type": {
                    marginTop: 0
                }
            }
        }, props, {
            children: [
                props.children,
                /*#__PURE__*/ (0,jsx_runtime.jsx)(HeadingAnchor, {
                    anchor: anchor,
                    depth: 2
                })
            ]
        })));
    },
    h3: function(props) {
        var anchor = slugify_default()(stringifyChildren(props.children), {
            lower: true
        });
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var headingRef = usePageHeading({
            anchor: anchor
        }).headingRef;
        return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Heading, mdxComponents_objectSpread({
            ref: headingRef,
            mt: HEADING_MARGIN_TOP,
            mb: HEADING_MARGIN_BOTTOM,
            variant: "bpHeading3"
        }, props, {
            children: [
                props.children,
                /*#__PURE__*/ (0,jsx_runtime.jsx)(HeadingAnchor, {
                    anchor: anchor,
                    depth: 3
                })
            ]
        })));
    },
    h4: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Heading, mdxComponents_objectSpread({
            mt: HEADING_MARGIN_TOP,
            mb: HEADING_MARGIN_BOTTOM,
            variant: "bpHeading4"
        }, props));
    },
    p: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Typography/* default */.Z, mdxComponents_objectSpread({
            mb: 2,
            variant: "bpBodyCopy"
        }, props));
    },
    a: function(props) {
        var href = props.href, _ref = props.ref, rest = _objectWithoutProperties(props, [
            "href",
            "ref"
        ]);
        return href ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, mdxComponents_objectSpread({}, rest, {
            href: href.replace("https://blockprotocol.org", "")
        })) : // eslint-disable-next-line jsx-a11y/anchor-has-content -- special case for creating bookmarks (for cross-linking)
        /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
            id: props.id
        });
    },
    table: function(_param) /*#__PURE__*/ {
        var children = _param.children, _ref = _param.ref, props = _objectWithoutProperties(_param, [
            "children",
            "ref"
        ]);
        return (0,jsx_runtime.jsx)(Box/* default */.Z, mdxComponents_objectSpread({
            component: "table",
            sx: {
                "td, th": {
                    border: function(param) {
                        var palette = param.palette;
                        return "1px solid ".concat(palette.gray[30]);
                    },
                    paddingY: 1,
                    paddingX: 3,
                    typography: "bpSmallCopy"
                },
                marginBottom: 2
            }
        }, props, {
            children: children
        }));
    },
    // TODO: Improve style & implementation of below components
    Frame: function(param1) {
        var children = param1.children, emoji = param1.emoji;
        return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Paper/* default */.Z, {
            variant: "teal",
            sx: function(param) {
                var palette = param.palette;
                return {
                    marginBottom: 3,
                    padding: {
                        xs: 2,
                        sm: 3
                    },
                    a: {
                        color: palette.teal[600],
                        borderColor: palette.teal[600],
                        ":hover": {
                            color: palette.teal[700],
                            borderColor: palette.teal[700]
                        },
                        ":focus-visible": {
                            outlineColor: palette.teal[600]
                        }
                    },
                    code: {
                        color: palette.teal[700],
                        background: palette.teal[200],
                        borderColor: palette.teal[300]
                    }
                };
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        fontSize: "3em",
                        textAlign: "center"
                    },
                    children: emoji
                }),
                children
            ]
        }));
    },
    ol: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Box/* default */.Z, mdxComponents_objectSpread({
            component: "ol",
            sx: function(theme) {
                return {
                    marginBottom: theme.spacing(2),
                    paddingLeft: theme.spacing(4),
                    listStyle: "auto"
                };
            }
        }, props));
    },
    ul: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Box/* default */.Z, mdxComponents_objectSpread({
            component: "ul",
            sx: function(theme) {
                return {
                    marginBottom: theme.spacing(2),
                    paddingLeft: theme.spacing(4),
                    listStyle: "unset"
                };
            }
        }, props));
    },
    li: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Box/* default */.Z, mdxComponents_objectSpread({}, props, {
            component: "li",
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                variant: "bpBodyCopy",
                component: "div",
                children: props.children
            })
        }));
    },
    inlineCode: function(props) {
        /*#__PURE__*/ return (0,jsx_runtime.jsx)(Box/* default */.Z, mdxComponents_objectSpread({
            component: "code",
            sx: function(theme) {
                return {
                    fontSize: "80%",
                    color: theme.palette.purple[700],
                    background: theme.palette.purple[100],
                    padding: theme.spacing(0.25, 0.5),
                    borderColor: theme.palette.purple[200],
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: "4px"
                };
            }
        }, props));
    },
    pre: function(props) {
        // Delegate full control to code for more styling options
        return props.children;
    },
    code: function(props) {
        var ref;
        var isLanguageBlockFunction = props.className === "language-block-function";
        if (isLanguageBlockFunction) {
            var ref1;
            var ref2;
            var anchor = (ref2 = (ref1 = "".concat(props.children).match(/^[\w]+/)) === null || ref1 === void 0 ? void 0 : ref1[0]) !== null && ref2 !== void 0 ? ref2 : "";
            return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                id: anchor,
                component: "code",
                sx: {
                    fontWeight: "bold",
                    color: "#d18d5b",
                    display: "block",
                    marginTop: 4
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                    href: "#".concat(anchor),
                    children: props.children
                })
            }));
        }
        var ref3;
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
            component: "pre",
            sx: function(theme) {
                return {
                    overflow: "auto",
                    display: "block",
                    fontSize: "90%",
                    color: theme.palette.purple[400],
                    background: "#161a1f",
                    padding: theme.spacing(3),
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: "8px",
                    textShadow: "none",
                    marginBottom: 2,
                    maxWidth: "72ch"
                };
            },
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Snippet/* Snippet */.p, {
                source: "".concat(props.children),
                language: (ref3 = (ref = props.className) === null || ref === void 0 ? void 0 : ref.replace("language-", "")) !== null && ref3 !== void 0 ? ref3 : ""
            })
        }));
    }
};


;// CONCATENATED MODULE: ./src/components/MdxPageContent.tsx
function MdxPageContent_defineProperty(obj, key, value) {
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
function MdxPageContent_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            MdxPageContent_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function MdxPageContent_objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = MdxPageContent_objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function MdxPageContent_objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}







var MDX_TEXT_CONTENT_MAX_WIDTH = 680;
var detectHeadingFromScrollTimer = undefined;
var MdxPageContent = function(_param) {
    var serializedPage = _param.serializedPage, boxProps = MdxPageContent_objectWithoutProperties(_param, [
        "serializedPage"
    ]);
    var router = (0,next_router.useRouter)();
    var ref4 = (0,react.useState)([]), headings = ref4[0], setHeadings = ref4[1];
    var ref1 = (0,react.useState)(true), detectHeadingFromScroll = ref1[0], setDetectHeadingFromScroll = ref1[1];
    var currentHeading = (0,react.useRef)(undefined);
    (0,react.useEffect)(function() {
        setHeadings([]);
        return function() {
            currentHeading.current = undefined;
            setHeadings([]);
        };
    }, [
        serializedPage
    ]);
    var scrolledOnce = (0,react.useRef)(false);
    (0,react.useEffect)(function() {
        if (headings.length) {
            var ref, ref2;
            var ref3;
            var anchor = (ref3 = router.asPath.split("#")[1]) !== null && ref3 !== void 0 ? ref3 : "";
            var headingWithCurrentAnchor = headings.find(function(heading) {
                return heading.anchor === anchor;
            });
            var previousRoute = sessionStorage.getItem("previousRoute");
            var shouldScrollToAnchor = // if anchor is empty and we haven't scrolled, prevent it
            (anchor === "" && scrolledOnce.current) || // if anchor is not empty, always allow scroll
            anchor !== "" || // OR if previous path is either a docs or spec page
            ((previousRoute === null || previousRoute === void 0 ? void 0 : previousRoute.includes("/docs")) && ((ref = router.asPath) === null || ref === void 0 ? void 0 : ref.includes("/docs"))) || (previousRoute === null || previousRoute === void 0 ? void 0 : previousRoute.includes("/spec")) && ((ref2 = router.asPath) === null || ref2 === void 0 ? void 0 : ref2.includes("/spec"));
            if (!scrolledOnce.current) {
                scrolledOnce.current = true;
            }
            if (headingWithCurrentAnchor && shouldScrollToAnchor && (!currentHeading.current || headingWithCurrentAnchor.element !== currentHeading.current.element) && document.body.contains(headingWithCurrentAnchor.element)) {
                currentHeading.current = headingWithCurrentAnchor;
                setDetectHeadingFromScroll(false);
                window.scrollTo({
                    top: headingWithCurrentAnchor.element.offsetTop - 100
                });
                if (detectHeadingFromScrollTimer) {
                    clearTimeout(detectHeadingFromScrollTimer);
                }
                detectHeadingFromScrollTimer = setTimeout(function() {
                    return setDetectHeadingFromScroll(true);
                }, 1500);
            }
        }
    }, [
        headings,
        router.asPath
    ]);
    (0,react.useEffect)(function() {
        var onScroll = function() {
            if (!detectHeadingFromScroll) return;
            var headingAtScrollPosition = headings[0];
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = headings.slice(1)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var heading = _step.value;
                    var element = heading.element;
                    var top = element.getBoundingClientRect().top;
                    if (top < 150 && headingAtScrollPosition.element.getBoundingClientRect().top < top) {
                        headingAtScrollPosition = heading;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            var asPath = router.asPath;
            if (headingAtScrollPosition.anchor ? !asPath.endsWith("#".concat(headingAtScrollPosition.anchor)) : asPath !== asPath.split("#")[0]) {
                currentHeading.current = headingAtScrollPosition;
                void router.replace("".concat(asPath.split("#")[0]).concat(headingAtScrollPosition.anchor ? "#".concat(headingAtScrollPosition.anchor) : ""));
            }
        };
        window.addEventListener("scroll", onScroll);
        return function() {
            window.removeEventListener("scroll", onScroll);
        };
    }, [
        router,
        headings,
        detectHeadingFromScroll
    ]);
    var contextValue = (0,react.useMemo)(function() {
        return {
            headings: headings,
            setHeadings: setHeadings
        };
    }, [
        headings
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(context_PageHeadingsContext.Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, MdxPageContent_objectSpread({}, boxProps, {
            sx: {
                width: "100%",
                overflow: "auto",
                "& > :not(.info-card-wrapper), > a:not(.info-card-wrapper) > *": {
                    maxWidth: {
                        xs: "100%",
                        sm: MDX_TEXT_CONTENT_MAX_WIDTH
                    }
                }
            },
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* MDXRemote */.R, MdxPageContent_objectSpread({}, serializedPage, {
                components: mdxComponents
            }))
        }))
    }));
};



/***/ }),

/***/ 550:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ SIDEBAR_WIDTH; },
/* harmony export */   "Y": function() { return /* binding */ Sidebar; }
/* harmony export */ });
/* harmony import */ var _Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5230);
/* harmony import */ var _Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4246);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7378);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6677);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5608);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5310);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2133);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9762);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1449);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(4776);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(9119);
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1131);
/* harmony import */ var _Navbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8197);
/* harmony import */ var _util_muiUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7723);
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}








var SIDEBAR_WIDTH = 220;
var SidebarLink = (0,_mui_material__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .ZP)(_Link__WEBPACK_IMPORTED_MODULE_4__/* .Link */ .rU)(function(param) {
    var theme = param.theme;
    return {
        display: "block",
        lineHeight: "1.25em",
        transition: theme.transitions.create([
            "color"
        ]),
        color: theme.palette.gray[70],
        ":hover": {
            color: theme.palette.purple[600]
        },
        fontWeight: 400,
        fontSize: 15
    };
});
var SidebarPageSection = function(param1) {
    var _depth = param1.depth, depth = _depth === void 0 ? 0 : _depth, _isSelectedByDefault = param1.isSelectedByDefault, isSelectedByDefault = _isSelectedByDefault === void 0 ? false : _isSelectedByDefault, pageHref = param1.pageHref, section = param1.section, maybeUpdateSelectedOffsetTop = param1.maybeUpdateSelectedOffsetTop, setSelectedAnchorElement = param1.setSelectedAnchorElement, openedPages = param1.openedPages, setOpenedPages = param1.setOpenedPages;
    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    var asPath = router.asPath;
    var sectionTitle = section.title, sectionAnchor = section.anchor, subSections = section.subSections;
    var sectionHref = sectionAnchor ? "".concat(pageHref, "#").concat(sectionAnchor) : pageHref;
    var isSectionSelected = asPath === sectionHref || isSelectedByDefault && (asPath === pageHref || asPath === "".concat(pageHref, "#"));
    var hasSelectedSubSection = (subSections === null || subSections === void 0 ? void 0 : subSections.find(function(param) {
        var subSectionAnchor = param.anchor;
        return asPath === "".concat(pageHref, "#").concat(subSectionAnchor);
    })) !== undefined;
    var isSectionOpen = openedPages.includes(sectionHref);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                mb: 1.5,
                display: "flex",
                alignItems: "flex-start",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarLink, {
                        replace: true,
                        ref: function(ref) {
                            if (ref && isSectionSelected) {
                                setSelectedAnchorElement(ref);
                            }
                        },
                        href: sectionHref,
                        sx: function(theme) {
                            return {
                                paddingLeft: depth * 1 + 1.25,
                                color: isSectionSelected ? theme.palette.purple[600] : theme.palette.gray[70],
                                fontWeight: isSectionSelected ? 700 : 400
                            };
                        },
                        children: sectionTitle
                    }),
                    subSections && subSections.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z, {
                        onClick: _asyncToGenerator(_Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
                            return _Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {
                                while(1)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        if (!hasSelectedSubSection) {
                                            _ctx.next = 3;
                                            break;
                                        }
                                        _ctx.next = 3;
                                        return router.push(sectionHref);
                                    case 3:
                                        setOpenedPages(function(prev) {
                                            return prev.includes(sectionHref) ? prev.filter(function(prevHref) {
                                                return prevHref !== sectionHref;
                                            }) : _toConsumableArray(prev).concat([
                                                sectionHref
                                            ]);
                                        });
                                    case 4:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        })),
                        sx: function(theme) {
                            return {
                                padding: 0,
                                marginLeft: 1,
                                marginTop: 0.5,
                                transition: theme.transitions.create("transform"),
                                transform: "rotate(".concat(isSectionOpen ? "90deg" : "0deg", ")"),
                                "& svg": {
                                    color: isSectionSelected ? theme.palette.purple[600] : theme.palette.gray[50]
                                }
                            };
                        },
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                            className: "fa-chevron-right",
                            sx: {
                                fontSize: 14
                            }
                        })
                    }) : null
                ]
            }),
            subSections && subSections.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z, {
                in: isSectionOpen,
                onEntered: maybeUpdateSelectedOffsetTop,
                onExited: maybeUpdateSelectedOffsetTop,
                children: subSections.map(function(subSection) {
                    /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarPageSection, {
                        depth: depth + 1,
                        pageHref: pageHref,
                        section: subSection,
                        maybeUpdateSelectedOffsetTop: maybeUpdateSelectedOffsetTop,
                        setSelectedAnchorElement: setSelectedAnchorElement,
                        openedPages: openedPages,
                        setOpenedPages: setOpenedPages
                    }, subSection.anchor);
                })
            }) : null
        ]
    }));
};
var SidebarPage = function(param) {
    var page = param.page, maybeUpdateSelectedOffsetTop = param.maybeUpdateSelectedOffsetTop, setSelectedAnchorElement = param.setSelectedAnchorElement, openedPages = param.openedPages, setOpenedPages = param.setOpenedPages;
    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    var asPath = router.asPath;
    var href = page.href, title = page.title, sections = page.sections;
    var isSelected = asPath === href || asPath === "".concat(href, "#");
    var isOpen = openedPages.includes(href);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                mb: 1.5,
                display: "flex",
                alignItems: "flex-start",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarLink, {
                        ref: function(ref) {
                            if (ref && isSelected) {
                                setSelectedAnchorElement(ref);
                            }
                        },
                        scroll: !(asPath === null || asPath === void 0 ? void 0 : asPath.startsWith("/docs")) && !(asPath === null || asPath === void 0 ? void 0 : asPath.startsWith("/spec")),
                        href: href,
                        sx: function(theme) {
                            return {
                                alignSelf: "flex-start",
                                color: isSelected ? theme.palette.purple[600] : theme.palette.gray[70],
                                fontWeight: isSelected ? 700 : 400,
                                paddingLeft: 1.25
                            };
                        },
                        children: title
                    }),
                    sections && sections.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z, {
                        onClick: _asyncToGenerator(_Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
                            return _Users_kdy1_projects_lab_blockprotocol_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {
                                while(1)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        if (!asPath.startsWith("".concat(href, "#"))) {
                                            _ctx.next = 3;
                                            break;
                                        }
                                        _ctx.next = 3;
                                        return router.push(href);
                                    case 3:
                                        setOpenedPages(function(prev) {
                                            return prev.includes(href) ? prev.filter(function(prevHref) {
                                                return prevHref !== href;
                                            }) : _toConsumableArray(prev).concat([
                                                href
                                            ]);
                                        });
                                    case 4:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        })),
                        sx: function(theme) {
                            return {
                                padding: 0,
                                marginLeft: 1,
                                marginTop: 0.5,
                                transition: theme.transitions.create("transform"),
                                transform: "rotate(".concat(isOpen ? "90deg" : "0deg", ")"),
                                "& svg": {
                                    color: isSelected ? theme.palette.purple[600] : theme.palette.gray[50]
                                }
                            };
                        },
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                            className: "fa-chevron-right",
                            sx: {
                                fontSize: 14
                            }
                        })
                    }) : null
                ]
            }),
            sections && sections.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z, {
                in: isOpen,
                onEntered: maybeUpdateSelectedOffsetTop,
                onExited: maybeUpdateSelectedOffsetTop,
                children: sections.map(function(section) {
                    /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarPageSection, {
                        depth: 1,
                        pageHref: href,
                        section: section,
                        maybeUpdateSelectedOffsetTop: maybeUpdateSelectedOffsetTop,
                        setSelectedAnchorElement: setSelectedAnchorElement,
                        openedPages: openedPages,
                        setOpenedPages: setOpenedPages
                    }, section.anchor);
                })
            }) : null
        ]
    }, href));
};
var getInitialOpenedPages = function(params) {
    var pages = params.pages, asPath = params.asPath;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var page = _step.value;
            var href = page.href, sections = page.sections;
            if (asPath === href || asPath === "".concat(href, "#")) {
                return [
                    href
                ];
            } else if (sections) {
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    for(var _iterator1 = sections[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var section = _step1.value;
                        var sectionAnchor = section.anchor, subSections = section.subSections;
                        var sectionHref = "".concat(href, "#").concat(sectionAnchor);
                        if (asPath === sectionHref) {
                            return [
                                href,
                                sectionHref
                            ];
                        } else if (subSections) {
                            var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                            try {
                                for(var _iterator2 = subSections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                                    var subSection = _step2.value;
                                    var subSectionAnchor = subSection.anchor;
                                    var subSectionHref = "".concat(href, "#").concat(subSectionAnchor);
                                    if (asPath === subSectionHref) {
                                        return [
                                            href,
                                            sectionHref,
                                            subSectionHref
                                        ];
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                        _iterator2.return();
                                    }
                                } finally{
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return [];
};
var Sidebar = function(_param1) {
    var appendices = _param1.appendices, pages = _param1.pages, header = _param1.header, boxProps = _objectWithoutProperties(_param1, [
        "appendices",
        "pages",
        "header"
    ]);
    var theme = (0,_mui_material__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)();
    var asPath = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)().asPath;
    var stickinessDetectorRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), isSticky = ref[0], setIsSticky = ref[1];
    // Approach inspired by: https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        var cachedRef = stickinessDetectorRef.current;
        if (cachedRef) {
            var observer = new IntersectionObserver(function(param) {
                var _param = _slicedToArray(param, 1), event = _param[0];
                return setIsSticky(event.intersectionRatio < 1);
            }, {
                threshold: [
                    1
                ]
            });
            observer.observe(cachedRef);
            return function() {
                observer.unobserve(cachedRef);
            };
        }
    }, []);
    var ref1 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), selectedAnchorElement = ref1[0], setSelectedAnchorElement = ref1[1];
    var ref2 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), selectedOffsetTop = ref2[0], setSelectedOffsetTop = ref2[1];
    var ref3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(getInitialOpenedPages({
        pages: pages,
        asPath: asPath
    })), openedPages = ref3[0], setOpenedPages = ref3[1];
    var maybeUpdateSelectedOffsetTop = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function() {
        if (selectedAnchorElement && selectedOffsetTop !== selectedAnchorElement.offsetTop) {
            setSelectedOffsetTop(selectedAnchorElement.offsetTop);
        }
    }, [
        selectedOffsetTop,
        selectedAnchorElement
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        maybeUpdateSelectedOffsetTop();
    }, [
        maybeUpdateSelectedOffsetTop
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        setOpenedPages(function(prev) {
            return _toConsumableArray(prev).concat(_toConsumableArray(getInitialOpenedPages({
                pages: pages,
                asPath: asPath
            }).filter(function(href) {
                return !prev.includes(href);
            })));
        });
    }, [
        asPath,
        pages
    ]);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, _objectSpread({}, boxProps, {
        position: "sticky",
        flexShrink: 0,
        width: SIDEBAR_WIDTH,
        sx: _objectSpread({}, boxProps.sx, {
            top: 0
        }),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                ref: stickinessDetectorRef,
                sx: {
                    position: "absolute",
                    top: "-1px",
                    height: "1px",
                    width: "1px"
                }
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                sx: {
                    maxHeight: isSticky ? "100vh" : undefined,
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: isSticky ? "".concat(_Navbar__WEBPACK_IMPORTED_MODULE_5__/* .DESKTOP_NAVBAR_HEIGHT */ .q6 + (0,_util_muiUtils__WEBPACK_IMPORTED_MODULE_6__/* .parseIntFromPixelString */ .y)(theme.spacing(1)), "px") : 0,
                    paddingRight: 3,
                    transition: theme.transitions.create([
                        "padding-top",
                        "padding-bottom", 
                    ])
                },
                children: [
                    header,
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                        position: "relative",
                        sx: {
                            paddingRight: 3,
                            marginRight: -3,
                            overflow: "auto",
                            paddingBottom: isSticky ? theme.spacing(6) : 0,
                            flexShrink: 1
                        },
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                                sx: {
                                    position: "absolute",
                                    width: 3,
                                    height: 14,
                                    backgroundColor: function(param) {
                                        var palette = param.palette;
                                        return palette.purple[600];
                                    },
                                    top: selectedOffsetTop === undefined ? 0 : selectedOffsetTop + 3,
                                    opacity: selectedOffsetTop === undefined ? 0 : 1,
                                    transition: theme.transitions.create([
                                        "top",
                                        "opacity"
                                    ], {
                                        duration: 150
                                    })
                                }
                            }),
                            pages.length > 1 ? pages.map(function(page) {
                                /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarPage, {
                                    page: page,
                                    maybeUpdateSelectedOffsetTop: maybeUpdateSelectedOffsetTop,
                                    setSelectedAnchorElement: setSelectedAnchorElement,
                                    openedPages: openedPages,
                                    setOpenedPages: setOpenedPages
                                }, page.href);
                            }) : pages.length === 1 ? pages[0].sections.map(function(section, i) {
                                /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarPageSection, {
                                    isSelectedByDefault: i === 0,
                                    pageHref: pages[0].href,
                                    section: section,
                                    maybeUpdateSelectedOffsetTop: maybeUpdateSelectedOffsetTop,
                                    setSelectedAnchorElement: setSelectedAnchorElement,
                                    openedPages: openedPages,
                                    setOpenedPages: setOpenedPages
                                }, section.anchor);
                            }) : null,
                            appendices && appendices.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z, {
                                        sx: {
                                            marginBottom: 2
                                        }
                                    }),
                                    appendices.map(function(page) {
                                        /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SidebarPage, {
                                            page: page,
                                            maybeUpdateSelectedOffsetTop: maybeUpdateSelectedOffsetTop,
                                            setSelectedAnchorElement: setSelectedAnchorElement,
                                            openedPages: openedPages,
                                            setOpenedPages: setOpenedPages
                                        }, page.href);
                                    })
                                ]
                            }) : null
                        ]
                    })
                ]
            })
        ]
    })));
};



/***/ }),

/***/ 5397:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": function() { return /* binding */ Snippet; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7378);
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7282);
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prismjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5310);
/* harmony import */ var prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5094);
/* harmony import */ var prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5095);
/* harmony import */ var prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4__);
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
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}




/**
 * Add support for another language:
 *
 * - import the grammar package from "prismjs/components/prism-[language]"
 * - eventually you may have to re-build and download the prism.css
 *   to support the new language at https://prismjs.com/download.html
 *   that file resides at src/styles/prism.css and has to be imported by
 *   nextjs' _app.tsx as per nextjs convention.
 *
 * @see https://prismjs.com
 */ 

var Snippet = function(_param) {
    var source = _param.source, language = _param.language, boxProps = _objectWithoutProperties(_param, [
        "source",
        "language"
    ]);
    var grammar = (prismjs__WEBPACK_IMPORTED_MODULE_2___default().languages)[language];
    if (!grammar) {
        return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, _objectSpread({
            component: "code"
        }, boxProps, {
            children: source
        })));
    }
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, _objectSpread({
        component: "code"
    }, boxProps, {
        // trust prism to properly escape the source
        dangerouslySetInnerHTML: {
            __html: prismjs__WEBPACK_IMPORTED_MODULE_2___default().highlight(source, grammar, language)
        }
    })));
};



/***/ }),

/***/ 1485:
/***/ (function(module) {


;(function (name, root, factory) {
  if (true) {
    module.exports = factory()
    module.exports["default"] = factory()
  }
  /* istanbul ignore next */
  else {}
}('slugify', this, function () {
  var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}')
  var locales = JSON.parse('{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och"}}')

  function replace (string, options) {
    if (typeof string !== 'string') {
      throw new Error('slugify: string argument expected')
    }

    options = (typeof options === 'string')
      ? {replacement: options}
      : options || {}

    var locale = locales[options.locale] || {}

    var replacement = options.replacement === undefined ? '-' : options.replacement

    var trim = options.trim === undefined ? true : options.trim

    var slug = string.normalize().split('')
      // replace characters based on charMap
      .reduce(function (result, ch) {
        return result + (locale[ch] || charMap[ch] ||  (ch === replacement ? ' ' : ch))
          // remove not allowed characters
          .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
      }, '');

    if (options.strict) {
      slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
    }

    if (trim) {
      slug = slug.trim()
    }

    // Replace spaces with replacement character, treating multiple consecutive
    // spaces as a single space.
    slug = slug.replace(/\s+/g, replacement);

    if (options.lower) {
      slug = slug.toLowerCase()
    }

    return slug
  }

  replace.extend = function (customMap) {
    Object.assign(charMap, customMap)
  }

  return replace
}))


/***/ })

}]);