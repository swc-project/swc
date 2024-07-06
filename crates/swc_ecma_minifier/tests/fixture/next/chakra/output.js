(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        888
    ],
    {
        /***/ 2260: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__), // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return /* binding */ _app;
                }
            });
            // EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
            var initialState, state, listeners, setState, config, _lg$1, _md$1, _sm$1, _baseStyleRoot, _Input$baseStyle$fiel, _Input$baseStyle, _Input$variants$unsty$1, _xs, _sm, _md, _lg, _xl, _container2, _container3, _container4, _Input$variants$unsty, _Input$sizes$xs$field, _Input$sizes$sm$field, _Input$sizes$md$field, _Input$sizes$lg$field, jsx_runtime = __webpack_require__(5893), react = __webpack_require__(7294), emotion_react_browser_esm = __webpack_require__(917), CSSReset$1 = function() {
                return /*#__PURE__*/ react.createElement(emotion_react_browser_esm /* Global */ .xB, {
                    styles: '\n      html {\n        line-height: 1.5;\n        -webkit-text-size-adjust: 100%;\n        font-family: system-ui, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;\n        -moz-osx-font-smoothing: grayscale;\n        touch-action: manipulation;\n      }\n\n      body {\n        position: relative;\n        min-height: 100%;\n        font-feature-settings: \'kern\';\n      }\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        box-sizing: border-box;\n      }\n\n      main {\n        display: block;\n      }\n\n      hr {\n        border-top-width: 1px;\n        box-sizing: content-box;\n        height: 0;\n        overflow: visible;\n      }\n\n      pre,\n      code,\n      kbd,\n      samp {\n        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;\n        font-size: 1em;\n      }\n\n      a {\n        background-color: transparent;\n        color: inherit;\n        text-decoration: inherit;\n      }\n\n      abbr[title] {\n        border-bottom: none;\n        text-decoration: underline;\n        -webkit-text-decoration: underline dotted;\n        text-decoration: underline dotted;\n      }\n\n      b,\n      strong {\n        font-weight: bold;\n      }\n\n      small {\n        font-size: 80%;\n      }\n\n      sub,\n      sup {\n        font-size: 75%;\n        line-height: 0;\n        position: relative;\n        vertical-align: baseline;\n      }\n\n      sub {\n        bottom: -0.25em;\n      }\n\n      sup {\n        top: -0.5em;\n      }\n\n      img {\n        border-style: none;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        font-family: inherit;\n        font-size: 100%;\n        line-height: 1.15;\n        margin: 0;\n      }\n\n      button,\n      input {\n        overflow: visible;\n      }\n\n      button,\n      select {\n        text-transform: none;\n      }\n\n      button::-moz-focus-inner,\n      [type="button"]::-moz-focus-inner,\n      [type="reset"]::-moz-focus-inner,\n      [type="submit"]::-moz-focus-inner {\n        border-style: none;\n        padding: 0;\n      }\n\n      fieldset {\n        padding: 0.35em 0.75em 0.625em;\n      }\n\n      legend {\n        box-sizing: border-box;\n        color: inherit;\n        display: table;\n        max-width: 100%;\n        padding: 0;\n        white-space: normal;\n      }\n\n      progress {\n        vertical-align: baseline;\n      }\n\n      textarea {\n        overflow: auto;\n      }\n\n      [type="checkbox"],\n      [type="radio"] {\n        box-sizing: border-box;\n        padding: 0;\n      }\n\n      [type="number"]::-webkit-inner-spin-button,\n      [type="number"]::-webkit-outer-spin-button {\n        -webkit-appearance: none !important;\n      }\n\n      input[type="number"] {\n        -moz-appearance: textfield;\n      }\n\n      [type="search"] {\n        -webkit-appearance: textfield;\n        outline-offset: -2px;\n      }\n\n      [type="search"]::-webkit-search-decoration {\n        -webkit-appearance: none !important;\n      }\n\n      ::-webkit-file-upload-button {\n        -webkit-appearance: button;\n        font: inherit;\n      }\n\n      details {\n        display: block;\n      }\n\n      summary {\n        display: list-item;\n      }\n\n      template {\n        display: none;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      body,\n      blockquote,\n      dl,\n      dd,\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6,\n      hr,\n      figure,\n      p,\n      pre {\n        margin: 0;\n      }\n\n      button {\n        background: transparent;\n        padding: 0;\n      }\n\n      fieldset {\n        margin: 0;\n        padding: 0;\n      }\n\n      ol,\n      ul {\n        margin: 0;\n        padding: 0;\n      }\n\n      textarea {\n        resize: vertical;\n      }\n\n      button,\n      [role="button"] {\n        cursor: pointer;\n      }\n\n      button::-moz-focus-inner {\n        border: 0 !important;\n      }\n\n      table {\n        border-collapse: collapse;\n      }\n\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-size: inherit;\n        font-weight: inherit;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        padding: 0;\n        line-height: inherit;\n        color: inherit;\n      }\n\n      img,\n      svg,\n      video,\n      canvas,\n      audio,\n      iframe,\n      embed,\n      object {\n        display: block;\n      }\n\n      img,\n      video {\n        max-width: 100%;\n        height: auto;\n      }\n\n      [data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled]) {\n        outline: none;\n        box-shadow: none;\n      }\n\n      select::-ms-expand {\n        display: none;\n      }\n    '
                });
            }, chakra_ui_utils_esm = __webpack_require__(5031), chakra_ui_react_utils_esm = __webpack_require__(6450), chakra_ui_hooks_esm = __webpack_require__(7375), use_animation_state_5054a9f7_esm = __webpack_require__(4697), react_dom = __webpack_require__(3935), _createContext$1 = (0, chakra_ui_react_utils_esm /* createContext */ .kr)({
                strict: !1,
                name: "PortalManagerContext"
            }), PortalManagerContextProvider = _createContext$1[0], usePortalManager = _createContext$1[1];
            function PortalManager(props) {
                var children = props.children, zIndex = props.zIndex;
                return /*#__PURE__*/ react.createElement(PortalManagerContextProvider, {
                    value: {
                        zIndex: zIndex
                    }
                }, children);
            }
            function _extends() {
                return (_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            chakra_ui_utils_esm /* __DEV__ */ .Ts && (PortalManager.displayName = "PortalManager");
            var _excluded = [
                "containerRef"
            ], _createContext = (0, chakra_ui_react_utils_esm /* createContext */ .kr)({
                strict: !1,
                name: "PortalContext"
            }), PortalContextProvider = _createContext[0], usePortalContext = _createContext[1], PORTAL_CLASSNAME = "chakra-portal", Container = function(props) {
                return /*#__PURE__*/ react.createElement("div", {
                    className: "chakra-portal-zIndex",
                    style: {
                        position: "absolute",
                        zIndex: props.zIndex,
                        top: 0,
                        left: 0,
                        right: 0
                    }
                }, props.children);
            }, DefaultPortal = function(props) {
                var appendToParentPortal = props.appendToParentPortal, children = props.children, tempNode = react.useRef(null), portal = react.useRef(null), forceUpdate = (0, chakra_ui_hooks_esm /* useForceUpdate */ .NW)(), parentPortal = usePortalContext(), manager = usePortalManager();
                (0, use_animation_state_5054a9f7_esm.a)(function() {
                    if (tempNode.current) {
                        var doc = tempNode.current.ownerDocument, host = appendToParentPortal && null != parentPortal ? parentPortal : doc.body;
                        if (host) {
                            portal.current = doc.createElement("div"), portal.current.className = PORTAL_CLASSNAME, host.appendChild(portal.current), forceUpdate();
                            var portalNode = portal.current;
                            return function() {
                                host.contains(portalNode) && host.removeChild(portalNode);
                            };
                        }
                    }
                }, []);
                var _children = null != manager && manager.zIndex ? /*#__PURE__*/ react.createElement(Container, {
                    zIndex: null == manager ? void 0 : manager.zIndex
                }, children) : children;
                return portal.current ? /*#__PURE__*/ (0, react_dom.createPortal)(/*#__PURE__*/ react.createElement(PortalContextProvider, {
                    value: portal.current
                }, _children), portal.current) : /*#__PURE__*/ react.createElement("span", {
                    ref: tempNode
                });
            }, ContainerPortal = function(props) {
                var children = props.children, containerRef = props.containerRef, appendToParentPortal = props.appendToParentPortal, containerEl = containerRef.current, host = null != containerEl ? containerEl : chakra_ui_utils_esm /* isBrowser */ .jU ? document.body : void 0, portal = react.useMemo(function() {
                    var node = null == containerEl ? void 0 : containerEl.ownerDocument.createElement("div");
                    return node && (node.className = PORTAL_CLASSNAME), node;
                }, [
                    containerEl
                ]), forceUpdate = (0, chakra_ui_hooks_esm /* useForceUpdate */ .NW)();
                return ((0, use_animation_state_5054a9f7_esm.a)(function() {
                    forceUpdate();
                }, []), (0, use_animation_state_5054a9f7_esm.a)(function() {
                    if (portal && host) return host.appendChild(portal), function() {
                        host.removeChild(portal);
                    };
                }, [
                    portal,
                    host
                ]), host && portal) ? /*#__PURE__*/ (0, react_dom.createPortal)(/*#__PURE__*/ react.createElement(PortalContextProvider, {
                    value: appendToParentPortal ? portal : null
                }, children), portal) : null;
            };
            /**
             * Portal
             *
             * Declarative component used to render children into a DOM node
             * that exists outside the DOM hierarchy of the parent component.
             *
             * @see Docs https://chakra-ui.com/portal
             */ function Portal(props) {
                var containerRef = props.containerRef, rest = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = {}, sourceKeys = Object.keys(source);
                    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                    return target;
                }(props, _excluded);
                return containerRef ? /*#__PURE__*/ react.createElement(ContainerPortal, _extends({
                    containerRef: containerRef
                }, rest)) : /*#__PURE__*/ react.createElement(DefaultPortal, rest);
            }
            Portal.defaultProps = {
                appendToParentPortal: !0
            }, Portal.className = PORTAL_CLASSNAME, Portal.selector = ".chakra-portal", chakra_ui_utils_esm /* __DEV__ */ .Ts && (Portal.displayName = "Portal");
            // EXTERNAL MODULE: ./node_modules/@chakra-ui/system/dist/chakra-ui-system.esm.js + 3 modules
            var chakra_ui_system_esm = __webpack_require__(2846), chakra_ui_color_mode_esm = __webpack_require__(949), ssrDocument = {
                body: {
                    classList: {
                        add: function() {},
                        remove: function() {}
                    }
                },
                addEventListener: function() {},
                removeEventListener: function() {},
                activeElement: {
                    blur: function() {},
                    nodeName: ""
                },
                querySelector: function() {
                    return null;
                },
                querySelectorAll: function() {
                    return [];
                },
                getElementById: function() {
                    return null;
                },
                createEvent: function() {
                    return {
                        initEvent: function() {}
                    };
                },
                createElement: function() {
                    return {
                        children: [],
                        childNodes: [],
                        style: {},
                        setAttribute: function() {},
                        getElementsByTagName: function() {
                            return [];
                        }
                    };
                }
            }, noop = function() {}, defaultEnv = chakra_ui_utils_esm /* isBrowser */ .jU ? {
                window: window,
                document: document
            } : {
                window: {
                    document: ssrDocument,
                    navigator: {
                        userAgent: ""
                    },
                    CustomEvent: function() {
                        return this;
                    },
                    addEventListener: noop,
                    removeEventListener: noop,
                    getComputedStyle: function() {
                        return {
                            getPropertyValue: function() {
                                return "";
                            }
                        };
                    },
                    matchMedia: function() {
                        return {
                            matches: !1,
                            addListener: noop,
                            removeListener: noop
                        };
                    },
                    requestAnimationFrame: function(callback) {
                        return "undefined" == typeof setTimeout ? (callback(), null) : setTimeout(callback, 0);
                    },
                    cancelAnimationFrame: function(id) {
                        "undefined" != typeof setTimeout && clearTimeout(id);
                    },
                    setTimeout: function() {
                        return 0;
                    },
                    clearTimeout: noop,
                    setInterval: function() {
                        return 0;
                    },
                    clearInterval: noop
                },
                document: ssrDocument
            }, EnvironmentContext = /*#__PURE__*/ (0, react.createContext)(defaultEnv);
            function EnvironmentProvider(props) {
                var children = props.children, environmentProp = props.environment, _useState = (0, react.useState)(null), node = _useState[0], setNode = _useState[1], context = (0, react.useMemo)(function() {
                    var _ref, doc = null == node ? void 0 : node.ownerDocument, win = null == node ? void 0 : node.ownerDocument.defaultView;
                    return null != (_ref = null != environmentProp ? environmentProp : doc ? {
                        document: doc,
                        window: win
                    } : void 0) ? _ref : defaultEnv;
                }, [
                    node,
                    environmentProp
                ]);
                return /*#__PURE__*/ react.createElement(EnvironmentContext.Provider, {
                    value: context
                }, children, /*#__PURE__*/ react.createElement("span", {
                    hidden: !0,
                    className: "chakra-env",
                    ref: function(el) {
                        (0, react.startTransition)(function() {
                            el && setNode(el);
                        });
                    }
                }));
            }
            chakra_ui_utils_esm /* __DEV__ */ .Ts && (EnvironmentContext.displayName = "EnvironmentContext"), chakra_ui_utils_esm /* __DEV__ */ .Ts && (EnvironmentProvider.displayName = "EnvironmentProvider");
            /**
             * The global provider that must be added to make all Chakra components
             * work correctly
             */ var chakra_ui_provider_esm_ChakraProvider = function(props) {
                var children = props.children, colorModeManager = props.colorModeManager, portalZIndex = props.portalZIndex, _props$resetCSS = props.resetCSS, _props$theme = props.theme, theme = void 0 === _props$theme ? {} : _props$theme, environment = props.environment, cssVarsRoot = props.cssVarsRoot, _children = /*#__PURE__*/ react.createElement(EnvironmentProvider, {
                    environment: environment
                }, children);
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* ThemeProvider */ .f6, {
                    theme: theme,
                    cssVarsRoot: cssVarsRoot
                }, /*#__PURE__*/ react.createElement(chakra_ui_color_mode_esm /* ColorModeProvider */ .SG, {
                    colorModeManager: colorModeManager,
                    options: theme.config
                }, (void 0 === _props$resetCSS || _props$resetCSS) && /*#__PURE__*/ react.createElement(CSSReset$1, null), /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* GlobalStyle */ .ZL, null), portalZIndex ? /*#__PURE__*/ react.createElement(PortalManager, {
                    zIndex: portalZIndex
                }, _children) : _children));
            }, spacing = {
                px: "1px",
                0.5: "0.125rem",
                1: "0.25rem",
                1.5: "0.375rem",
                2: "0.5rem",
                2.5: "0.625rem",
                3: "0.75rem",
                3.5: "0.875rem",
                4: "1rem",
                5: "1.25rem",
                6: "1.5rem",
                7: "1.75rem",
                8: "2rem",
                9: "2.25rem",
                10: "2.5rem",
                12: "3rem",
                14: "3.5rem",
                16: "4rem",
                20: "5rem",
                24: "6rem",
                28: "7rem",
                32: "8rem",
                36: "9rem",
                40: "10rem",
                44: "11rem",
                48: "12rem",
                52: "13rem",
                56: "14rem",
                60: "15rem",
                64: "16rem",
                72: "18rem",
                80: "20rem",
                96: "24rem"
            }; // CONCATENATED MODULE: ./node_modules/@chakra-ui/theme/foundations/spacing/dist/chakra-ui-theme-foundations-spacing.esm.js
            function sizes_501602a9_esm_extends() {
                return (sizes_501602a9_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            var sizes = sizes_501602a9_esm_extends({}, spacing, {
                max: "max-content",
                min: "min-content",
                full: "100%",
                "3xs": "14rem",
                "2xs": "16rem",
                xs: "20rem",
                sm: "24rem",
                md: "28rem",
                lg: "32rem",
                xl: "36rem",
                "2xl": "42rem",
                "3xl": "48rem",
                "4xl": "56rem",
                "5xl": "64rem",
                "6xl": "72rem",
                "7xl": "80rem",
                "8xl": "90rem"
            }, {
                container: {
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px"
                }
            }); // CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/util.js
            /**
             * Take input from [0, n] and return it as [0, 1]
             * @hidden
             */ function bound01(n, max) {
                "string" == typeof (n1 = n) && -1 !== n1.indexOf(".") && 1 === parseFloat(n1) && (n = "100%");
                var n1, n2, isPercent = "string" == typeof (n2 = n) && -1 !== n2.indexOf("%");
                return(// Handle floating point rounding errors
                (n = 360 === max ? n : Math.min(max, Math.max(0, parseFloat(n))), isPercent && (n = parseInt(String(n * max), 10) / 100), 0.000001 > Math.abs(n - max)) ? 1 : // If n is a hue given in degrees,
                // wrap around out-of-range values into [0, 360] range
                // then convert into [0, 1].
                n = 360 === max ? (n < 0 ? n % max + max : n % max) / parseFloat(String(max)) : n % max / parseFloat(String(max)));
            }
            /**
             * Force a number between 0 and 1
             * @hidden
             */ function clamp01(val) {
                return Math.min(1, Math.max(0, val));
            }
            /**
             * Return a valid alpha value [0,1] with all invalid values being set to 1
             * @hidden
             */ function boundAlpha(a) {
                return (isNaN(a = parseFloat(a)) || a < 0 || a > 1) && (a = 1), a;
            }
            /**
             * Replace a decimal with it's percentage value
             * @hidden
             */ function convertToPercentage(n) {
                return n <= 1 ? "".concat(100 * Number(n), "%") : n;
            }
            /**
             * Force a hex value to have 2 characters
             * @hidden
             */ function util_pad2(c) {
                return 1 === c.length ? "0" + c : String(c);
            } // CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/conversion.js
            /**
             * Converts an RGB color value to HSL.
             * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
             * *Returns:* { h, s, l } in [0,1]
             */ function rgbToHsl(r, g, b) {
                var max = Math.max(r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255)), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2;
                if (max === min) s = 0, h = 0;
                else {
                    var d = max - min;
                    switch(s = l > 0.5 ? d / (2 - max - min) : d / (max + min), max){
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: s,
                    l: l
                };
            }
            function hue2rgb(p, q, t) {
                return (t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6) ? p + 6 * t * (q - p) : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
            }
            /**
             * Converts an RGB color value to HSV
             *
             * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
             * *Returns:* { h, s, v } in [0,1]
             */ function rgbToHsv(r, g, b) {
                var max = Math.max(r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255)), min = Math.min(r, g, b), h = 0, d = max - min;
                if (max === min) h = 0; // achromatic
                else {
                    switch(max){
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: 0 === max ? 0 : d / max,
                    v: max
                };
            }
            /**
             * Converts an RGB color to hex
             *
             * Assumes r, g, and b are contained in the set [0, 255]
             * Returns a 3 or 6 character hex
             */ function rgbToHex(r, g, b, allow3Char) {
                var hex = [
                    util_pad2(Math.round(r).toString(16)),
                    util_pad2(Math.round(g).toString(16)),
                    util_pad2(Math.round(b).toString(16))
                ];
                return(// Return a 3 character hex if possible
                allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) ? hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) : hex.join(""));
            }
            /** Parse a base-16 hex value into a base-10 integer */ function parseIntFromHex(val) {
                return parseInt(val, 16);
            }
            // https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
            /**
             * @hidden
             */ var names = {
                aliceblue: "#f0f8ff",
                antiquewhite: "#faebd7",
                aqua: "#00ffff",
                aquamarine: "#7fffd4",
                azure: "#f0ffff",
                beige: "#f5f5dc",
                bisque: "#ffe4c4",
                black: "#000000",
                blanchedalmond: "#ffebcd",
                blue: "#0000ff",
                blueviolet: "#8a2be2",
                brown: "#a52a2a",
                burlywood: "#deb887",
                cadetblue: "#5f9ea0",
                chartreuse: "#7fff00",
                chocolate: "#d2691e",
                coral: "#ff7f50",
                cornflowerblue: "#6495ed",
                cornsilk: "#fff8dc",
                crimson: "#dc143c",
                cyan: "#00ffff",
                darkblue: "#00008b",
                darkcyan: "#008b8b",
                darkgoldenrod: "#b8860b",
                darkgray: "#a9a9a9",
                darkgreen: "#006400",
                darkgrey: "#a9a9a9",
                darkkhaki: "#bdb76b",
                darkmagenta: "#8b008b",
                darkolivegreen: "#556b2f",
                darkorange: "#ff8c00",
                darkorchid: "#9932cc",
                darkred: "#8b0000",
                darksalmon: "#e9967a",
                darkseagreen: "#8fbc8f",
                darkslateblue: "#483d8b",
                darkslategray: "#2f4f4f",
                darkslategrey: "#2f4f4f",
                darkturquoise: "#00ced1",
                darkviolet: "#9400d3",
                deeppink: "#ff1493",
                deepskyblue: "#00bfff",
                dimgray: "#696969",
                dimgrey: "#696969",
                dodgerblue: "#1e90ff",
                firebrick: "#b22222",
                floralwhite: "#fffaf0",
                forestgreen: "#228b22",
                fuchsia: "#ff00ff",
                gainsboro: "#dcdcdc",
                ghostwhite: "#f8f8ff",
                goldenrod: "#daa520",
                gold: "#ffd700",
                gray: "#808080",
                green: "#008000",
                greenyellow: "#adff2f",
                grey: "#808080",
                honeydew: "#f0fff0",
                hotpink: "#ff69b4",
                indianred: "#cd5c5c",
                indigo: "#4b0082",
                ivory: "#fffff0",
                khaki: "#f0e68c",
                lavenderblush: "#fff0f5",
                lavender: "#e6e6fa",
                lawngreen: "#7cfc00",
                lemonchiffon: "#fffacd",
                lightblue: "#add8e6",
                lightcoral: "#f08080",
                lightcyan: "#e0ffff",
                lightgoldenrodyellow: "#fafad2",
                lightgray: "#d3d3d3",
                lightgreen: "#90ee90",
                lightgrey: "#d3d3d3",
                lightpink: "#ffb6c1",
                lightsalmon: "#ffa07a",
                lightseagreen: "#20b2aa",
                lightskyblue: "#87cefa",
                lightslategray: "#778899",
                lightslategrey: "#778899",
                lightsteelblue: "#b0c4de",
                lightyellow: "#ffffe0",
                lime: "#00ff00",
                limegreen: "#32cd32",
                linen: "#faf0e6",
                magenta: "#ff00ff",
                maroon: "#800000",
                mediumaquamarine: "#66cdaa",
                mediumblue: "#0000cd",
                mediumorchid: "#ba55d3",
                mediumpurple: "#9370db",
                mediumseagreen: "#3cb371",
                mediumslateblue: "#7b68ee",
                mediumspringgreen: "#00fa9a",
                mediumturquoise: "#48d1cc",
                mediumvioletred: "#c71585",
                midnightblue: "#191970",
                mintcream: "#f5fffa",
                mistyrose: "#ffe4e1",
                moccasin: "#ffe4b5",
                navajowhite: "#ffdead",
                navy: "#000080",
                oldlace: "#fdf5e6",
                olive: "#808000",
                olivedrab: "#6b8e23",
                orange: "#ffa500",
                orangered: "#ff4500",
                orchid: "#da70d6",
                palegoldenrod: "#eee8aa",
                palegreen: "#98fb98",
                paleturquoise: "#afeeee",
                palevioletred: "#db7093",
                papayawhip: "#ffefd5",
                peachpuff: "#ffdab9",
                peru: "#cd853f",
                pink: "#ffc0cb",
                plum: "#dda0dd",
                powderblue: "#b0e0e6",
                purple: "#800080",
                rebeccapurple: "#663399",
                red: "#ff0000",
                rosybrown: "#bc8f8f",
                royalblue: "#4169e1",
                saddlebrown: "#8b4513",
                salmon: "#fa8072",
                sandybrown: "#f4a460",
                seagreen: "#2e8b57",
                seashell: "#fff5ee",
                sienna: "#a0522d",
                silver: "#c0c0c0",
                skyblue: "#87ceeb",
                slateblue: "#6a5acd",
                slategray: "#708090",
                slategrey: "#708090",
                snow: "#fffafa",
                springgreen: "#00ff7f",
                steelblue: "#4682b4",
                tan: "#d2b48c",
                teal: "#008080",
                thistle: "#d8bfd8",
                tomato: "#ff6347",
                turquoise: "#40e0d0",
                violet: "#ee82ee",
                wheat: "#f5deb3",
                white: "#ffffff",
                whitesmoke: "#f5f5f5",
                yellow: "#ffff00",
                yellowgreen: "#9acd32"
            }, CSS_UNIT = "(?:".concat("[-\\+]?\\d*\\.\\d+%?", ")|(?:").concat("[-\\+]?\\d+%?", ")"), PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?"), PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?"), matchers = {
                CSS_UNIT: new RegExp(CSS_UNIT),
                rgb: RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: RegExp("hsv" + PERMISSIVE_MATCH3),
                hsva: RegExp("hsva" + PERMISSIVE_MATCH4),
                hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            }; // CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/format-input.js
            /**
             * Check to see if it looks like a CSS unit
             * (see `matchers` above for definition).
             */ function isValidCSSUnit(color) {
                return !!matchers.CSS_UNIT.exec(String(color));
            } // CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/index.js
            var module_TinyColor = /** @class */ function() {
                function TinyColor(color, opts) {
                    // If input is already a tinycolor, return itself
                    if (void 0 === color && (color = ""), void 0 === opts && (opts = {}), color instanceof TinyColor) // eslint-disable-next-line no-constructor-return
                    return color;
                    "number" == typeof color && (color = {
                        r: (color1 = color) >> 16,
                        g: (0xff00 & color1) >> 8,
                        b: 0xff & color1
                    }), this.originalInput = color;
                    var color1, color2, r, g, b, h, s, v, i, f, p, q, t, mod, rgb, a, s1, v1, l, ok, format, _a, rgb1 = (rgb = {
                        r: 0,
                        g: 0,
                        b: 0
                    }, a = 1, s1 = null, v1 = null, l = null, ok = !1, format = !1, "string" == typeof (color2 = color) && (color2 = /**
             * Permissive string parsing.  Take in a number of formats, and output an object
             * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
             */ function(color) {
                        if (0 === (color = color.trim().toLowerCase()).length) return !1;
                        var named = !1;
                        if (names[color]) color = names[color], named = !0;
                        else if ("transparent" === color) return {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0,
                            format: "name"
                        };
                        // Try to match string input using regular expressions.
                        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
                        // Just return an object and let the conversion functions handle that.
                        // This way the result will be the same whether the tinycolor is initialized with string or object.
                        var match = matchers.rgb.exec(color);
                        return match ? {
                            r: match[1],
                            g: match[2],
                            b: match[3]
                        } : (match = matchers.rgba.exec(color)) ? {
                            r: match[1],
                            g: match[2],
                            b: match[3],
                            a: match[4]
                        } : (match = matchers.hsl.exec(color)) ? {
                            h: match[1],
                            s: match[2],
                            l: match[3]
                        } : (match = matchers.hsla.exec(color)) ? {
                            h: match[1],
                            s: match[2],
                            l: match[3],
                            a: match[4]
                        } : (match = matchers.hsv.exec(color)) ? {
                            h: match[1],
                            s: match[2],
                            v: match[3]
                        } : (match = matchers.hsva.exec(color)) ? {
                            h: match[1],
                            s: match[2],
                            v: match[3],
                            a: match[4]
                        } : (match = matchers.hex8.exec(color)) ? {
                            r: parseIntFromHex(match[1]),
                            g: parseIntFromHex(match[2]),
                            b: parseIntFromHex(match[3]),
                            a: parseIntFromHex(match[4]) / 255,
                            format: named ? "name" : "hex8"
                        } : (match = matchers.hex6.exec(color)) ? {
                            r: parseIntFromHex(match[1]),
                            g: parseIntFromHex(match[2]),
                            b: parseIntFromHex(match[3]),
                            format: named ? "name" : "hex"
                        } : (match = matchers.hex4.exec(color)) ? {
                            r: parseIntFromHex(match[1] + match[1]),
                            g: parseIntFromHex(match[2] + match[2]),
                            b: parseIntFromHex(match[3] + match[3]),
                            a: parseIntFromHex(match[4] + match[4]) / 255,
                            format: named ? "name" : "hex8"
                        } : !!(match = matchers.hex3.exec(color)) && {
                            r: parseIntFromHex(match[1] + match[1]),
                            g: parseIntFromHex(match[2] + match[2]),
                            b: parseIntFromHex(match[3] + match[3]),
                            format: named ? "name" : "hex"
                        };
                    }(color2)), "object" == typeof color2 && (isValidCSSUnit(color2.r) && isValidCSSUnit(color2.g) && isValidCSSUnit(color2.b) ? (r = color2.r, g = color2.g, b = color2.b, rgb = {
                        r: 255 * bound01(r, 255),
                        g: 255 * bound01(g, 255),
                        b: 255 * bound01(b, 255)
                    }, ok = !0, format = "%" === String(color2.r).substr(-1) ? "prgb" : "rgb") : isValidCSSUnit(color2.h) && isValidCSSUnit(color2.s) && isValidCSSUnit(color2.v) ? (s1 = convertToPercentage(color2.s), v1 = convertToPercentage(color2.v), h = color2.h, s = s1, v = v1, h = 6 * bound01(h, 360), s = bound01(s, 100), v = bound01(v, 100), i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), rgb = {
                        r: 255 * [
                            v,
                            q,
                            p,
                            p,
                            t,
                            v
                        ][mod = i % 6],
                        g: 255 * [
                            t,
                            v,
                            v,
                            q,
                            p,
                            p
                        ][mod],
                        b: 255 * [
                            p,
                            p,
                            t,
                            v,
                            v,
                            q
                        ][mod]
                    }, ok = !0, format = "hsv") : isValidCSSUnit(color2.h) && isValidCSSUnit(color2.s) && isValidCSSUnit(color2.l) && (s1 = convertToPercentage(color2.s), l = convertToPercentage(color2.l), rgb = /**
             * Converts an HSL color value to RGB.
             *
             * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
             * *Returns:* { r, g, b } in the set [0, 255]
             */ function(h, s, l) {
                        if (h = bound01(h, 360), s = bound01(s, 100), l = bound01(l, 100), 0 === s) // achromatic
                        g = l, b = l, r = l;
                        else {
                            var r, g, b, q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
                            r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
                        }
                        return {
                            r: 255 * r,
                            g: 255 * g,
                            b: 255 * b
                        };
                    }(color2.h, s1, l), ok = !0, format = "hsl"), Object.prototype.hasOwnProperty.call(color2, "a") && (a = color2.a)), a = boundAlpha(a), {
                        ok: ok,
                        format: color2.format || format,
                        r: Math.min(255, Math.max(rgb.r, 0)),
                        g: Math.min(255, Math.max(rgb.g, 0)),
                        b: Math.min(255, Math.max(rgb.b, 0)),
                        a: a
                    });
                    this.originalInput = color, this.r = rgb1.r, this.g = rgb1.g, this.b = rgb1.b, this.a = rgb1.a, this.roundA = Math.round(100 * this.a) / 100, this.format = null !== (_a = opts.format) && void 0 !== _a ? _a : rgb1.format, this.gradientType = opts.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = rgb1.ok;
                }
                return TinyColor.prototype.isDark = function() {
                    return 128 > this.getBrightness();
                }, TinyColor.prototype.isLight = function() {
                    return !this.isDark();
                }, /**
                 * Returns the perceived brightness of the color, from 0-255.
                 */ TinyColor.prototype.getBrightness = function() {
                    // http://www.w3.org/TR/AERT#color-contrast
                    var rgb = this.toRgb();
                    return (299 * rgb.r + 587 * rgb.g + 114 * rgb.b) / 1000;
                }, /**
                 * Returns the perceived luminance of a color, from 0-1.
                 */ TinyColor.prototype.getLuminance = function() {
                    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
                    var rgb = this.toRgb(), RsRGB = rgb.r / 255, GsRGB = rgb.g / 255, BsRGB = rgb.b / 255;
                    return 0.2126 * (RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4)) + 0.7152 * (GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4)) + 0.0722 * (BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4));
                }, /**
                 * Returns the alpha value of a color, from 0-1.
                 */ TinyColor.prototype.getAlpha = function() {
                    return this.a;
                }, /**
                 * Sets the alpha value on the current color.
                 *
                 * @param alpha - The new alpha value. The accepted range is 0-1.
                 */ TinyColor.prototype.setAlpha = function(alpha) {
                    return this.a = boundAlpha(alpha), this.roundA = Math.round(100 * this.a) / 100, this;
                }, /**
                 * Returns the object as a HSVA object.
                 */ TinyColor.prototype.toHsv = function() {
                    var hsv = rgbToHsv(this.r, this.g, this.b);
                    return {
                        h: 360 * hsv.h,
                        s: hsv.s,
                        v: hsv.v,
                        a: this.a
                    };
                }, /**
                 * Returns the hsva values interpolated into a string with the following format:
                 * "hsva(xxx, xxx, xxx, xx)".
                 */ TinyColor.prototype.toHsvString = function() {
                    var hsv = rgbToHsv(this.r, this.g, this.b), h = Math.round(360 * hsv.h), s = Math.round(100 * hsv.s), v = Math.round(100 * hsv.v);
                    return 1 === this.a ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
                }, /**
                 * Returns the object as a HSLA object.
                 */ TinyColor.prototype.toHsl = function() {
                    var hsl = rgbToHsl(this.r, this.g, this.b);
                    return {
                        h: 360 * hsl.h,
                        s: hsl.s,
                        l: hsl.l,
                        a: this.a
                    };
                }, /**
                 * Returns the hsla values interpolated into a string with the following format:
                 * "hsla(xxx, xxx, xxx, xx)".
                 */ TinyColor.prototype.toHslString = function() {
                    var hsl = rgbToHsl(this.r, this.g, this.b), h = Math.round(360 * hsl.h), s = Math.round(100 * hsl.s), l = Math.round(100 * hsl.l);
                    return 1 === this.a ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
                }, /**
                 * Returns the hex value of the color.
                 * @param allow3Char will shorten hex value to 3 char if possible
                 */ TinyColor.prototype.toHex = function(allow3Char) {
                    return void 0 === allow3Char && (allow3Char = !1), rgbToHex(this.r, this.g, this.b, allow3Char);
                }, /**
                 * Returns the hex value of the color -with a # appened.
                 * @param allow3Char will shorten hex value to 3 char if possible
                 */ TinyColor.prototype.toHexString = function(allow3Char) {
                    return void 0 === allow3Char && (allow3Char = !1), "#" + this.toHex(allow3Char);
                }, /**
                 * Returns the hex 8 value of the color.
                 * @param allow4Char will shorten hex value to 4 char if possible
                 */ TinyColor.prototype.toHex8 = function(allow4Char) {
                    var r, g, b, a, allow4Char1, hex;
                    return void 0 === allow4Char && (allow4Char = !1), r = this.r, g = this.g, b = this.b, a = this.a, allow4Char1 = allow4Char, hex = [
                        util_pad2(Math.round(r).toString(16)),
                        util_pad2(Math.round(g).toString(16)),
                        util_pad2(Math.round(b).toString(16)),
                        util_pad2(Math.round(255 * parseFloat(a)).toString(16))
                    ], // Return a 4 character hex if possible
                    allow4Char1 && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1)) ? hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0) : hex.join("");
                }, /**
                 * Returns the hex 8 value of the color -with a # appened.
                 * @param allow4Char will shorten hex value to 4 char if possible
                 */ TinyColor.prototype.toHex8String = function(allow4Char) {
                    return void 0 === allow4Char && (allow4Char = !1), "#" + this.toHex8(allow4Char);
                }, /**
                 * Returns the object as a RGBA object.
                 */ TinyColor.prototype.toRgb = function() {
                    return {
                        r: Math.round(this.r),
                        g: Math.round(this.g),
                        b: Math.round(this.b),
                        a: this.a
                    };
                }, /**
                 * Returns the RGBA values interpolated into a string with the following format:
                 * "RGBA(xxx, xxx, xxx, xx)".
                 */ TinyColor.prototype.toRgbString = function() {
                    var r = Math.round(this.r), g = Math.round(this.g), b = Math.round(this.b);
                    return 1 === this.a ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
                }, /**
                 * Returns the object as a RGBA object.
                 */ TinyColor.prototype.toPercentageRgb = function() {
                    var fmt = function(x) {
                        return "".concat(Math.round(100 * bound01(x, 255)), "%");
                    };
                    return {
                        r: fmt(this.r),
                        g: fmt(this.g),
                        b: fmt(this.b),
                        a: this.a
                    };
                }, /**
                 * Returns the RGBA relative values interpolated into a string
                 */ TinyColor.prototype.toPercentageRgbString = function() {
                    var rnd = function(x) {
                        return Math.round(100 * bound01(x, 255));
                    };
                    return 1 === this.a ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
                }, /**
                 * The 'real' name of the color -if there is one.
                 */ TinyColor.prototype.toName = function() {
                    if (0 === this.a) return "transparent";
                    if (this.a < 1) return !1;
                    for(var hex = "#" + rgbToHex(this.r, this.g, this.b, !1), _i = 0, _a = Object.entries(names); _i < _a.length; _i++){
                        var _b = _a[_i], key = _b[0];
                        if (hex === _b[1]) return key;
                    }
                    return !1;
                }, TinyColor.prototype.toString = function(format) {
                    var formatSet = !!format;
                    format = null != format ? format : this.format;
                    var formattedString = !1, hasAlpha = this.a < 1 && this.a >= 0;
                    return !formatSet && hasAlpha && (format.startsWith("hex") || "name" === format) ? // Special case for "transparent", all other non-alpha formats
                    // will return rgba when there is transparency.
                    "name" === format && 0 === this.a ? this.toName() : this.toRgbString() : ("rgb" === format && (formattedString = this.toRgbString()), "prgb" === format && (formattedString = this.toPercentageRgbString()), ("hex" === format || "hex6" === format) && (formattedString = this.toHexString()), "hex3" === format && (formattedString = this.toHexString(!0)), "hex4" === format && (formattedString = this.toHex8String(!0)), "hex8" === format && (formattedString = this.toHex8String()), "name" === format && (formattedString = this.toName()), "hsl" === format && (formattedString = this.toHslString()), "hsv" === format && (formattedString = this.toHsvString()), formattedString || this.toHexString());
                }, TinyColor.prototype.toNumber = function() {
                    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
                }, TinyColor.prototype.clone = function() {
                    return new TinyColor(this.toString());
                }, /**
                 * Lighten the color a given amount. Providing 100 will always return white.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.lighten = function(amount) {
                    void 0 === amount && (amount = 10);
                    var hsl = this.toHsl();
                    return hsl.l += amount / 100, hsl.l = clamp01(hsl.l), new TinyColor(hsl);
                }, /**
                 * Brighten the color a given amount, from 0 to 100.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.brighten = function(amount) {
                    void 0 === amount && (amount = 10);
                    var rgb = this.toRgb();
                    return rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(-(amount / 100 * 255)))), rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(-(amount / 100 * 255)))), rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(-(amount / 100 * 255)))), new TinyColor(rgb);
                }, /**
                 * Darken the color a given amount, from 0 to 100.
                 * Providing 100 will always return black.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.darken = function(amount) {
                    void 0 === amount && (amount = 10);
                    var hsl = this.toHsl();
                    return hsl.l -= amount / 100, hsl.l = clamp01(hsl.l), new TinyColor(hsl);
                }, /**
                 * Mix the color with pure white, from 0 to 100.
                 * Providing 0 will do nothing, providing 100 will always return white.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.tint = function(amount) {
                    return void 0 === amount && (amount = 10), this.mix("white", amount);
                }, /**
                 * Mix the color with pure black, from 0 to 100.
                 * Providing 0 will do nothing, providing 100 will always return black.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.shade = function(amount) {
                    return void 0 === amount && (amount = 10), this.mix("black", amount);
                }, /**
                 * Desaturate the color a given amount, from 0 to 100.
                 * Providing 100 will is the same as calling greyscale
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.desaturate = function(amount) {
                    void 0 === amount && (amount = 10);
                    var hsl = this.toHsl();
                    return hsl.s -= amount / 100, hsl.s = clamp01(hsl.s), new TinyColor(hsl);
                }, /**
                 * Saturate the color a given amount, from 0 to 100.
                 * @param amount - valid between 1-100
                 */ TinyColor.prototype.saturate = function(amount) {
                    void 0 === amount && (amount = 10);
                    var hsl = this.toHsl();
                    return hsl.s += amount / 100, hsl.s = clamp01(hsl.s), new TinyColor(hsl);
                }, /**
                 * Completely desaturates a color into greyscale.
                 * Same as calling `desaturate(100)`
                 */ TinyColor.prototype.greyscale = function() {
                    return this.desaturate(100);
                }, /**
                 * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
                 * Values outside of this range will be wrapped into this range.
                 */ TinyColor.prototype.spin = function(amount) {
                    var hsl = this.toHsl(), hue = (hsl.h + amount) % 360;
                    return hsl.h = hue < 0 ? 360 + hue : hue, new TinyColor(hsl);
                }, /**
                 * Mix the current color a given amount with another color, from 0 to 100.
                 * 0 means no mixing (return current color).
                 */ TinyColor.prototype.mix = function(color, amount) {
                    void 0 === amount && (amount = 50);
                    var rgb1 = this.toRgb(), rgb2 = new TinyColor(color).toRgb(), p = amount / 100;
                    return new TinyColor({
                        r: (rgb2.r - rgb1.r) * p + rgb1.r,
                        g: (rgb2.g - rgb1.g) * p + rgb1.g,
                        b: (rgb2.b - rgb1.b) * p + rgb1.b,
                        a: (rgb2.a - rgb1.a) * p + rgb1.a
                    });
                }, TinyColor.prototype.analogous = function(results, slices) {
                    void 0 === results && (results = 6), void 0 === slices && (slices = 30);
                    var hsl = this.toHsl(), part = 360 / slices, ret = [
                        this
                    ];
                    for(hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;)hsl.h = (hsl.h + part) % 360, ret.push(new TinyColor(hsl));
                    return ret;
                }, /**
                 * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
                 */ TinyColor.prototype.complement = function() {
                    var hsl = this.toHsl();
                    return hsl.h = (hsl.h + 180) % 360, new TinyColor(hsl);
                }, TinyColor.prototype.monochromatic = function(results) {
                    void 0 === results && (results = 6);
                    for(var hsv = this.toHsv(), h = hsv.h, s = hsv.s, v = hsv.v, res = [], modification = 1 / results; results--;)res.push(new TinyColor({
                        h: h,
                        s: s,
                        v: v
                    })), v = (v + modification) % 1;
                    return res;
                }, TinyColor.prototype.splitcomplement = function() {
                    var hsl = this.toHsl(), h = hsl.h;
                    return [
                        this,
                        new TinyColor({
                            h: (h + 72) % 360,
                            s: hsl.s,
                            l: hsl.l
                        }),
                        new TinyColor({
                            h: (h + 216) % 360,
                            s: hsl.s,
                            l: hsl.l
                        })
                    ];
                }, /**
                 * Compute how the color would appear on a background
                 */ TinyColor.prototype.onBackground = function(background) {
                    var fg = this.toRgb(), bg = new TinyColor(background).toRgb();
                    return new TinyColor({
                        r: bg.r + (fg.r - bg.r) * fg.a,
                        g: bg.g + (fg.g - bg.g) * fg.a,
                        b: bg.b + (fg.b - bg.b) * fg.a
                    });
                }, /**
                 * Alias for `polyad(3)`
                 */ TinyColor.prototype.triad = function() {
                    return this.polyad(3);
                }, /**
                 * Alias for `polyad(4)`
                 */ TinyColor.prototype.tetrad = function() {
                    return this.polyad(4);
                }, /**
                 * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
                 * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
                 */ TinyColor.prototype.polyad = function(n) {
                    for(var hsl = this.toHsl(), h = hsl.h, result = [
                        this
                    ], increment = 360 / n, i = 1; i < n; i++)result.push(new TinyColor({
                        h: (h + i * increment) % 360,
                        s: hsl.s,
                        l: hsl.l
                    }));
                    return result;
                }, /**
                 * compare color vs current color
                 */ TinyColor.prototype.equals = function(color) {
                    return this.toRgbString() === new TinyColor(color).toRgbString();
                }, TinyColor;
            }();
            function getColorInfo(hue) {
                // Maps red colors to make picking hue easier
                hue >= 334 && hue <= 360 && (hue -= 360);
                for(var _i = 0; _i < bounds.length; _i++){
                    var color = defineColor(bounds[_i]);
                    if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) return color;
                }
                throw Error("Color not found");
            }
            function randomWithin(range, seed) {
                if (void 0 === seed) return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
                // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
                var max = range[1] || 1, min = range[0] || 0;
                return Math.floor(min + (seed = (9301 * seed + 49297) % 233280) / 233280.0 * (max - min));
            }
            function defineColor(bound) {
                var sMin = bound.lowerBounds[0][0], sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0], bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1], bMax = bound.lowerBounds[0][1];
                return {
                    name: bound.name,
                    hueRange: bound.hueRange,
                    lowerBounds: bound.lowerBounds,
                    saturationRange: [
                        sMin,
                        sMax
                    ],
                    brightnessRange: [
                        bMin,
                        bMax
                    ]
                };
            }
            /**
             * @hidden
             */ var bounds = [
                {
                    name: "monochrome",
                    hueRange: null,
                    lowerBounds: [
                        [
                            0,
                            0
                        ],
                        [
                            100,
                            0
                        ]
                    ]
                },
                {
                    name: "red",
                    hueRange: [
                        -26,
                        18
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            92
                        ],
                        [
                            40,
                            89
                        ],
                        [
                            50,
                            85
                        ],
                        [
                            60,
                            78
                        ],
                        [
                            70,
                            70
                        ],
                        [
                            80,
                            60
                        ],
                        [
                            90,
                            55
                        ],
                        [
                            100,
                            50
                        ]
                    ]
                },
                {
                    name: "orange",
                    hueRange: [
                        19,
                        46
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            93
                        ],
                        [
                            40,
                            88
                        ],
                        [
                            50,
                            86
                        ],
                        [
                            60,
                            85
                        ],
                        [
                            70,
                            70
                        ],
                        [
                            100,
                            70
                        ]
                    ]
                },
                {
                    name: "yellow",
                    hueRange: [
                        47,
                        62
                    ],
                    lowerBounds: [
                        [
                            25,
                            100
                        ],
                        [
                            40,
                            94
                        ],
                        [
                            50,
                            89
                        ],
                        [
                            60,
                            86
                        ],
                        [
                            70,
                            84
                        ],
                        [
                            80,
                            82
                        ],
                        [
                            90,
                            80
                        ],
                        [
                            100,
                            75
                        ]
                    ]
                },
                {
                    name: "green",
                    hueRange: [
                        63,
                        178
                    ],
                    lowerBounds: [
                        [
                            30,
                            100
                        ],
                        [
                            40,
                            90
                        ],
                        [
                            50,
                            85
                        ],
                        [
                            60,
                            81
                        ],
                        [
                            70,
                            74
                        ],
                        [
                            80,
                            64
                        ],
                        [
                            90,
                            50
                        ],
                        [
                            100,
                            40
                        ]
                    ]
                },
                {
                    name: "blue",
                    hueRange: [
                        179,
                        257
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            86
                        ],
                        [
                            40,
                            80
                        ],
                        [
                            50,
                            74
                        ],
                        [
                            60,
                            60
                        ],
                        [
                            70,
                            52
                        ],
                        [
                            80,
                            44
                        ],
                        [
                            90,
                            39
                        ],
                        [
                            100,
                            35
                        ]
                    ]
                },
                {
                    name: "purple",
                    hueRange: [
                        258,
                        282
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            87
                        ],
                        [
                            40,
                            79
                        ],
                        [
                            50,
                            70
                        ],
                        [
                            60,
                            65
                        ],
                        [
                            70,
                            59
                        ],
                        [
                            80,
                            52
                        ],
                        [
                            90,
                            45
                        ],
                        [
                            100,
                            42
                        ]
                    ]
                },
                {
                    name: "pink",
                    hueRange: [
                        283,
                        334
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            90
                        ],
                        [
                            40,
                            86
                        ],
                        [
                            60,
                            84
                        ],
                        [
                            80,
                            80
                        ],
                        [
                            90,
                            75
                        ],
                        [
                            100,
                            73
                        ]
                    ]
                }
            ], getColor = function(theme, color, fallback) {
                var hex = (0, chakra_ui_utils_esm /* memoizedGet */ .Wf)(theme, "colors." + color, color);
                return new module_TinyColor(hex).isValid ? hex : fallback;
            }, transparentize = function(color, opacity) {
                return function(theme) {
                    return new module_TinyColor(getColor(theme, color)).setAlpha(opacity).toRgbString();
                };
            }; // CONCATENATED MODULE: ./node_modules/@chakra-ui/theme-tools/dist/chakra-ui-theme-tools.esm.js
            function generateStripe(size, color) {
                return void 0 === size && (size = "1rem"), void 0 === color && (color = "rgba(255, 255, 255, 0.15)"), {
                    backgroundImage: "linear-gradient(\n    45deg,\n    " + color + " 25%,\n    transparent 25%,\n    transparent 50%,\n    " + color + " 50%,\n    " + color + " 75%,\n    transparent 75%,\n    transparent\n  )",
                    backgroundSize: size + " " + size
                };
            }
            function mode(light, dark) {
                return function(props) {
                    return "dark" === props.colorMode ? dark : light;
                };
            }
            function orient(options) {
                var orientation = options.orientation, vertical = options.vertical, horizontal = options.horizontal;
                return orientation ? "vertical" === orientation ? vertical : horizontal : {};
            }
            function chakra_ui_theme_tools_esm_extends() {
                return (chakra_ui_theme_tools_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            /**
             * Used to define the anatomy/parts of a component in a way that provides
             * a consistent API for `className`, css selector and `theming`.
             */ var Anatomy = /*#__PURE__*/ function() {
                var protoProps;
                function Anatomy(name) {
                    var _this = this;
                    this.map = {}, this.called = !1, this.assert = function() {
                        if (!_this.called) {
                            _this.called = !0;
                            return;
                        }
                        throw Error("[anatomy] .part(...) should only be called once. Did you mean to use .extend(...) ?");
                    }, this.parts = function() {
                        _this.assert();
                        for(var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++)values[_key] = arguments[_key];
                        for(var _i = 0; _i < values.length; _i++){
                            var part = values[_i];
                            _this.map[part] = _this.toPart(part);
                        }
                        return _this;
                    }, this.extend = function() {
                        for(var _len2 = arguments.length, parts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++)parts[_key2] = arguments[_key2];
                        for(var _i2 = 0; _i2 < parts.length; _i2++){
                            var part = parts[_i2];
                            part in _this.map || (_this.map[part] = _this.toPart(part));
                        }
                        return _this;
                    }, this.toPart = function(part) {
                        var className = "chakra-" + ([
                            "container",
                            "root"
                        ].includes(null != part ? part : "") ? [
                            _this.name
                        ] : [
                            _this.name,
                            part
                        ]).filter(Boolean).join("__");
                        return {
                            className: className,
                            selector: "." + className,
                            toString: function() {
                                return part;
                            }
                        };
                    }, this.__type = {};
                }
                return protoProps = [
                    {
                        key: "selectors",
                        get: /**
                             * Get all selectors for the component anatomy
                             */ function() {
                            return (0, chakra_ui_utils_esm /* fromEntries */ .sq)(Object.entries(this.map).map(function(_ref) {
                                return [
                                    _ref[0],
                                    _ref[1].selector
                                ];
                            }));
                        }
                    },
                    {
                        key: "classNames",
                        get: function() {
                            return (0, chakra_ui_utils_esm /* fromEntries */ .sq)(Object.entries(this.map).map(function(_ref2) {
                                return [
                                    _ref2[0],
                                    _ref2[1].className
                                ];
                            }));
                        }
                    },
                    {
                        key: "keys",
                        get: function() {
                            return Object.keys(this.map);
                        }
                    }
                ], function(target, props) {
                    for(var i = 0; i < props.length; i++){
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }(Anatomy.prototype, protoProps), Object.defineProperty(Anatomy, "prototype", {
                    writable: !1
                }), Anatomy;
            }();
            function anatomy(name) {
                return new Anatomy(name);
            }
            function toRef(operand) {
                return (0, chakra_ui_utils_esm /* isObject */ .Kn)(operand) && operand.reference ? operand.reference : String(operand);
            }
            var toExpr = function(operator) {
                for(var _len = arguments.length, operands = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)operands[_key - 1] = arguments[_key];
                return operands.map(toRef).join(" " + operator + " ").replace(/calc/g, "");
            }, _add = function() {
                for(var _len2 = arguments.length, operands = Array(_len2), _key2 = 0; _key2 < _len2; _key2++)operands[_key2] = arguments[_key2];
                return "calc(" + toExpr.apply(void 0, [
                    "+"
                ].concat(operands)) + ")";
            }, _subtract = function() {
                for(var _len3 = arguments.length, operands = Array(_len3), _key3 = 0; _key3 < _len3; _key3++)operands[_key3] = arguments[_key3];
                return "calc(" + toExpr.apply(void 0, [
                    "-"
                ].concat(operands)) + ")";
            }, _multiply = function() {
                for(var _len4 = arguments.length, operands = Array(_len4), _key4 = 0; _key4 < _len4; _key4++)operands[_key4] = arguments[_key4];
                return "calc(" + toExpr.apply(void 0, [
                    "*"
                ].concat(operands)) + ")";
            }, _divide = function() {
                for(var _len5 = arguments.length, operands = Array(_len5), _key5 = 0; _key5 < _len5; _key5++)operands[_key5] = arguments[_key5];
                return "calc(" + toExpr.apply(void 0, [
                    "/"
                ].concat(operands)) + ")";
            }, _negate = function(x) {
                var value = toRef(x);
                return null == value || Number.isNaN(parseFloat(value)) ? _multiply(value, -1) : String(value).startsWith("-") ? String(value).slice(1) : "-" + value;
            }, calc = Object.assign(function(x) {
                return {
                    add: function() {
                        for(var _len6 = arguments.length, operands = Array(_len6), _key6 = 0; _key6 < _len6; _key6++)operands[_key6] = arguments[_key6];
                        return calc(_add.apply(void 0, [
                            x
                        ].concat(operands)));
                    },
                    subtract: function() {
                        for(var _len7 = arguments.length, operands = Array(_len7), _key7 = 0; _key7 < _len7; _key7++)operands[_key7] = arguments[_key7];
                        return calc(_subtract.apply(void 0, [
                            x
                        ].concat(operands)));
                    },
                    multiply: function() {
                        for(var _len8 = arguments.length, operands = Array(_len8), _key8 = 0; _key8 < _len8; _key8++)operands[_key8] = arguments[_key8];
                        return calc(_multiply.apply(void 0, [
                            x
                        ].concat(operands)));
                    },
                    divide: function() {
                        for(var _len9 = arguments.length, operands = Array(_len9), _key9 = 0; _key9 < _len9; _key9++)operands[_key9] = arguments[_key9];
                        return calc(_divide.apply(void 0, [
                            x
                        ].concat(operands)));
                    },
                    negate: function() {
                        return calc(_negate(x));
                    },
                    toString: function() {
                        return x.toString();
                    }
                };
            }, {
                add: _add,
                subtract: _subtract,
                multiply: _multiply,
                divide: _divide,
                negate: _negate
            });
            function chakra_ui_theme_tools_esm_escape(value) {
                var value1, replaceValue, valueStr = (value1 = value.toString(), void 0 === replaceValue && (replaceValue = "-"), value1.replace(/\s+/g, replaceValue));
                return valueStr.includes("\\.") ? value : Number.isInteger(parseFloat(value.toString())) ? value : valueStr.replace(".", "\\.");
            }
            function cssVar(name, options) {
                var fallback, prefix, prefix1, fallback1, cssVariable = (void 0 === (prefix = null == options ? void 0 : options.prefix) && (prefix = ""), "--" + (void 0 === (prefix1 = prefix) && (prefix1 = ""), [
                    prefix1,
                    chakra_ui_theme_tools_esm_escape(name)
                ].filter(Boolean).join("-")));
                return {
                    variable: cssVariable,
                    reference: (fallback1 = "string" == typeof (fallback = null == options ? void 0 : options.fallback) ? fallback : null == fallback ? void 0 : fallback.reference, "var(" + chakra_ui_theme_tools_esm_escape(cssVariable) + (fallback1 ? ", " + fallback1 : "") + ")")
                };
            }
            /**
             * **Accordion anatomy**
             * - Root: the root container of the accordion
             * - Container: the accordion item contains the button and panel
             * - Button: the button is the trigger for the panel
             * - Panel: the panel is the content of the accordion item
             * - Icon: the expanded/collapsed icon
             */ var accordionAnatomy = anatomy("accordion").parts("root", "container", "button", "panel").extend("icon"), alertAnatomy = anatomy("alert").parts("title", "description", "container").extend("icon", "spinner"), avatarAnatomy = anatomy("avatar").parts("label", "badge", "container").extend("excessLabel", "group"), breadcrumbAnatomy = anatomy("breadcrumb").parts("link", "item", "container").extend("separator");
            anatomy("button").parts();
            var checkboxAnatomy = anatomy("checkbox").parts("control", "icon", "container").extend("label");
            anatomy("progress").parts("track", "filledTrack").extend("label");
            var drawerAnatomy = anatomy("drawer").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer"), editableAnatomy = anatomy("editable").parts("preview", "input", "textarea"), formAnatomy = anatomy("form").parts("container", "requiredIndicator", "helperText"), formErrorAnatomy = anatomy("formError").parts("text", "icon"), inputAnatomy = anatomy("input").parts("addon", "field", "element"), listAnatomy = anatomy("list").parts("container", "item", "icon"), menuAnatomy = anatomy("menu").parts("button", "list", "item").extend("groupTitle", "command", "divider"), modalAnatomy = anatomy("modal").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer"), numberInputAnatomy = anatomy("numberinput").parts("root", "field", "stepperGroup", "stepper");
            anatomy("pininput").parts("field");
            var popoverAnatomy = anatomy("popover").parts("content", "header", "body", "footer").extend("popper", "arrow", "closeButton"), progressAnatomy = anatomy("progress").parts("label", "filledTrack", "track"), radioAnatomy = anatomy("radio").parts("container", "control", "label"), selectAnatomy = anatomy("select").parts("field", "icon"), sliderAnatomy = anatomy("slider").parts("container", "track", "thumb", "filledTrack"), statAnatomy = anatomy("stat").parts("container", "label", "helpText", "number", "icon"), switchAnatomy = anatomy("switch").parts("container", "track", "thumb"), tableAnatomy = anatomy("table").parts("table", "thead", "tbody", "tr", "th", "td", "tfoot", "caption"), tabsAnatomy = anatomy("tabs").parts("root", "tab", "tablist", "tabpanel", "tabpanels", "indicator"), tagAnatomy = anatomy("tag").parts("container", "label", "closeButton"), typography = {
                letterSpacings: {
                    tighter: "-0.05em",
                    tight: "-0.025em",
                    normal: "0",
                    wide: "0.025em",
                    wider: "0.05em",
                    widest: "0.1em"
                },
                lineHeights: {
                    normal: "normal",
                    none: 1,
                    shorter: 1.25,
                    short: 1.375,
                    base: 1.5,
                    tall: 1.625,
                    taller: "2",
                    3: ".75rem",
                    4: "1rem",
                    5: "1.25rem",
                    6: "1.5rem",
                    7: "1.75rem",
                    8: "2rem",
                    9: "2.25rem",
                    10: "2.5rem"
                },
                fontWeights: {
                    hairline: 100,
                    thin: 200,
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700,
                    extrabold: 800,
                    black: 900
                },
                fonts: {
                    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
                },
                fontSizes: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                    lg: "1.125rem",
                    xl: "1.25rem",
                    "2xl": "1.5rem",
                    "3xl": "1.875rem",
                    "4xl": "2.25rem",
                    "5xl": "3rem",
                    "6xl": "3.75rem",
                    "7xl": "4.5rem",
                    "8xl": "6rem",
                    "9xl": "8rem"
                }
            }, lodash_mergewith = __webpack_require__(8554), lodash_mergewith_default = /*#__PURE__*/ __webpack_require__.n(lodash_mergewith), Accordion = {
                parts: accordionAnatomy.keys,
                baseStyle: {
                    root: {},
                    container: {
                        borderTopWidth: "1px",
                        borderColor: "inherit",
                        _last: {
                            borderBottomWidth: "1px"
                        }
                    },
                    button: {
                        transitionProperty: "common",
                        transitionDuration: "normal",
                        fontSize: "1rem",
                        _focusVisible: {
                            boxShadow: "outline"
                        },
                        _hover: {
                            bg: "blackAlpha.50"
                        },
                        _disabled: {
                            opacity: 0.4,
                            cursor: "not-allowed"
                        },
                        px: 4,
                        py: 2
                    },
                    panel: {
                        pt: 2,
                        px: 4,
                        pb: 5
                    },
                    icon: {
                        fontSize: "1.25em"
                    }
                }
            };
            function getBg(props) {
                var theme = props.theme, c = props.colorScheme;
                return mode(getColor(theme, c + ".100", c), transparentize(c + ".200", 0.16)(theme))(props);
            }
            var Alert = {
                parts: alertAnatomy.keys,
                baseStyle: {
                    container: {
                        px: 4,
                        py: 3
                    },
                    title: {
                        fontWeight: "bold",
                        lineHeight: 6,
                        marginEnd: 2
                    },
                    description: {
                        lineHeight: 6
                    },
                    icon: {
                        flexShrink: 0,
                        marginEnd: 3,
                        w: 5,
                        h: 6
                    },
                    spinner: {
                        flexShrink: 0,
                        marginEnd: 3,
                        w: 5,
                        h: 5
                    }
                },
                variants: {
                    subtle: function(props) {
                        var c = props.colorScheme;
                        return {
                            container: {
                                bg: getBg(props)
                            },
                            icon: {
                                color: mode(c + ".500", c + ".200")(props)
                            },
                            spinner: {
                                color: mode(c + ".500", c + ".200")(props)
                            }
                        };
                    },
                    "left-accent": function(props) {
                        var c = props.colorScheme;
                        return {
                            container: {
                                paddingStart: 3,
                                borderStartWidth: "4px",
                                borderStartColor: mode(c + ".500", c + ".200")(props),
                                bg: getBg(props)
                            },
                            icon: {
                                color: mode(c + ".500", c + ".200")(props)
                            },
                            spinner: {
                                color: mode(c + ".500", c + ".200")(props)
                            }
                        };
                    },
                    "top-accent": function(props) {
                        var c = props.colorScheme;
                        return {
                            container: {
                                pt: 2,
                                borderTopWidth: "4px",
                                borderTopColor: mode(c + ".500", c + ".200")(props),
                                bg: getBg(props)
                            },
                            icon: {
                                color: mode(c + ".500", c + ".200")(props)
                            },
                            spinner: {
                                color: mode(c + ".500", c + ".200")(props)
                            }
                        };
                    },
                    solid: function(props) {
                        var c = props.colorScheme;
                        return {
                            container: {
                                bg: mode(c + ".500", c + ".200")(props),
                                color: mode("white", "gray.900")(props)
                            }
                        };
                    }
                },
                defaultProps: {
                    variant: "subtle",
                    colorScheme: "blue"
                }
            }, baseStyleContainer$3 = function(props) {
                var list, opts, fallback, name = props.name, theme = props.theme, bg = name ? (opts = {
                    string: name
                }, fallback = // randomColor by David Merfield under the CC0 license
                // https://github.com/davidmerfield/randomColor/
                (function random(options) {
                    // Check if we need to generate multiple colors
                    if (void 0 === options && (options = {}), void 0 !== options.count && null !== options.count) {
                        var hue, seed, res, totalColors = options.count, colors = [];
                        for(options.count = void 0; totalColors > colors.length;)// Since we're generating multiple colors,
                        // incremement the seed. Otherwise we'd just
                        // generate the same color each time...
                        options.count = null, options.seed && (options.seed += 1), colors.push(random(options));
                        return options.count = totalColors, colors;
                    }
                    // First we pick a hue (H)
                    var h = (hue = options.hue, seed = options.seed, (res = randomWithin(function(colorInput) {
                        var num = parseInt(colorInput, 10);
                        if (!Number.isNaN(num) && num < 360 && num > 0) return [
                            num,
                            num
                        ];
                        if ("string" == typeof colorInput) {
                            var namedColor = bounds.find(function(n) {
                                return n.name === colorInput;
                            });
                            if (namedColor) {
                                var color = defineColor(namedColor);
                                if (color.hueRange) return color.hueRange;
                            }
                            var parsed = new module_TinyColor(colorInput);
                            if (parsed.isValid) {
                                var hue = parsed.toHsv().h;
                                return [
                                    hue,
                                    hue
                                ];
                            }
                        }
                        return [
                            0,
                            360
                        ];
                    }(hue), seed)) < 0 && (res = 360 + res), res), s = function(hue, options) {
                        if ("monochrome" === options.hue) return 0;
                        if ("random" === options.luminosity) return randomWithin([
                            0,
                            100
                        ], options.seed);
                        var saturationRange = getColorInfo(hue).saturationRange, sMin = saturationRange[0], sMax = saturationRange[1];
                        switch(options.luminosity){
                            case "bright":
                                sMin = 55;
                                break;
                            case "dark":
                                sMin = sMax - 10;
                                break;
                            case "light":
                                sMax = 55;
                        }
                        return randomWithin([
                            sMin,
                            sMax
                        ], options.seed);
                    }(h, options), v = function(H, S, options) {
                        var bMin = function(H, S) {
                            for(var lowerBounds = getColorInfo(H).lowerBounds, i = 0; i < lowerBounds.length - 1; i++){
                                var s1 = lowerBounds[i][0], v1 = lowerBounds[i][1], s2 = lowerBounds[i + 1][0], v2 = lowerBounds[i + 1][1];
                                if (S >= s1 && S <= s2) {
                                    var m = (v2 - v1) / (s2 - s1), b = v1 - m * s1;
                                    return m * S + b;
                                }
                            }
                            return 0;
                        }(H, S), bMax = 100;
                        switch(options.luminosity){
                            case "dark":
                                bMax = bMin + 20;
                                break;
                            case "light":
                                bMin = (bMax + bMin) / 2;
                                break;
                            case "random":
                                bMin = 0, bMax = 100;
                        }
                        return randomWithin([
                            bMin,
                            bMax
                        ], options.seed);
                    }(h, s, options), res1 = {
                        h: h,
                        s: s,
                        v: v
                    };
                    // Then we return the HSB color in the desired format
                    return void 0 !== options.alpha && (res1.a = options.alpha), new module_TinyColor(res1);
                })().toHexString(), !opts || (0, chakra_ui_utils_esm /* isEmptyObject */ .Qr)(opts) ? fallback : opts.string && opts.colors ? function(str, list) {
                    var index = 0;
                    if (0 === str.length) return list[0];
                    for(var i = 0; i < str.length; i += 1)index = str.charCodeAt(i) + ((index << 5) - index), index &= index;
                    return index = (index % list.length + list.length) % list.length, list[index];
                }(opts.string, opts.colors) : opts.string && !opts.colors ? function(str) {
                    var hash = 0;
                    if (0 === str.length) return hash.toString();
                    for(var i = 0; i < str.length; i += 1)hash = str.charCodeAt(i) + ((hash << 5) - hash), hash &= hash;
                    for(var color = "#", j = 0; j < 3; j += 1)color += ("00" + (hash >> 8 * j & 255).toString(16)).substr(-2);
                    return color;
                }(opts.string) : opts.colors && !opts.string ? (list = opts.colors)[Math.floor(Math.random() * list.length)] : fallback) : "gray.400", isBgDark = "dark" == (new module_TinyColor(getColor(theme, bg)).isDark() ? "dark" : "light"), color = "white";
                return isBgDark || (color = "gray.800"), {
                    bg: bg,
                    color: color,
                    borderColor: mode("white", "gray.800")(props),
                    verticalAlign: "top"
                };
            };
            function getSize$3(size) {
                var themeSize = "100%" !== size ? sizes[size] : void 0;
                return {
                    container: {
                        width: size,
                        height: size,
                        fontSize: "calc(" + (null != themeSize ? themeSize : size) + " / 2.5)"
                    },
                    excessLabel: {
                        width: size,
                        height: size
                    },
                    label: {
                        fontSize: "calc(" + (null != themeSize ? themeSize : size) + " / 2.5)",
                        lineHeight: "100%" !== size ? null != themeSize ? themeSize : size : void 0
                    }
                };
            }
            var sizes$k = {
                "2xs": getSize$3(4),
                xs: getSize$3(6),
                sm: getSize$3(8),
                md: getSize$3(12),
                lg: getSize$3(16),
                xl: getSize$3(24),
                "2xl": getSize$3(32),
                full: getSize$3("100%")
            }, Avatar = {
                parts: avatarAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        badge: {
                            transform: "translate(25%, 25%)",
                            borderRadius: "full",
                            border: "0.2em solid",
                            borderColor: mode("white", "gray.800")(props)
                        },
                        excessLabel: {
                            bg: mode("gray.200", "whiteAlpha.400")(props)
                        },
                        container: baseStyleContainer$3(props)
                    };
                },
                sizes: sizes$k,
                defaultProps: {
                    size: "md"
                }
            }, Badge = {
                baseStyle: {
                    px: 1,
                    textTransform: "uppercase",
                    fontSize: "xs",
                    borderRadius: "sm",
                    fontWeight: "bold"
                },
                variants: {
                    solid: function(props) {
                        var c = props.colorScheme, theme = props.theme, dark = transparentize(c + ".500", 0.6)(theme);
                        return {
                            bg: mode(c + ".500", dark)(props),
                            color: mode("white", "whiteAlpha.800")(props)
                        };
                    },
                    subtle: function(props) {
                        var c = props.colorScheme, theme = props.theme, darkBg = transparentize(c + ".200", 0.16)(theme);
                        return {
                            bg: mode(c + ".100", darkBg)(props),
                            color: mode(c + ".800", c + ".200")(props)
                        };
                    },
                    outline: function(props) {
                        var c = props.colorScheme, theme = props.theme, darkColor = transparentize(c + ".200", 0.8)(theme), color = mode(getColor(theme, c + ".500"), darkColor)(props);
                        return {
                            color: color,
                            boxShadow: "inset 0 0 0px 1px " + color
                        };
                    }
                },
                defaultProps: {
                    variant: "subtle",
                    colorScheme: "gray"
                }
            }, Breadcrumb = {
                parts: breadcrumbAnatomy.keys,
                baseStyle: {
                    link: {
                        transitionProperty: "common",
                        transitionDuration: "fast",
                        transitionTimingFunction: "ease-out",
                        cursor: "pointer",
                        textDecoration: "none",
                        outline: "none",
                        color: "inherit",
                        _hover: {
                            textDecoration: "underline"
                        },
                        _focusVisible: {
                            boxShadow: "outline"
                        }
                    }
                }
            }, variantGhost = function(props) {
                var c = props.colorScheme, theme = props.theme;
                if ("gray" === c) return {
                    color: mode("inherit", "whiteAlpha.900")(props),
                    _hover: {
                        bg: mode("gray.100", "whiteAlpha.200")(props)
                    },
                    _active: {
                        bg: mode("gray.200", "whiteAlpha.300")(props)
                    }
                };
                var darkHoverBg = transparentize(c + ".200", 0.12)(theme), darkActiveBg = transparentize(c + ".200", 0.24)(theme);
                return {
                    color: mode(c + ".600", c + ".200")(props),
                    bg: "transparent",
                    _hover: {
                        bg: mode(c + ".50", darkHoverBg)(props)
                    },
                    _active: {
                        bg: mode(c + ".100", darkActiveBg)(props)
                    }
                };
            }, accessibleColorMap = {
                yellow: {
                    bg: "yellow.400",
                    color: "black",
                    hoverBg: "yellow.500",
                    activeBg: "yellow.600"
                },
                cyan: {
                    bg: "cyan.400",
                    color: "black",
                    hoverBg: "cyan.500",
                    activeBg: "cyan.600"
                }
            }, baseStyleControl$1 = function(props) {
                var c = props.colorScheme;
                return {
                    w: "100%",
                    transitionProperty: "box-shadow",
                    transitionDuration: "normal",
                    border: "2px solid",
                    borderRadius: "sm",
                    borderColor: "inherit",
                    color: "white",
                    _checked: {
                        bg: mode(c + ".500", c + ".200")(props),
                        borderColor: mode(c + ".500", c + ".200")(props),
                        color: mode("white", "gray.900")(props),
                        _hover: {
                            bg: mode(c + ".600", c + ".300")(props),
                            borderColor: mode(c + ".600", c + ".300")(props)
                        },
                        _disabled: {
                            borderColor: mode("gray.200", "transparent")(props),
                            bg: mode("gray.200", "whiteAlpha.300")(props),
                            color: mode("gray.500", "whiteAlpha.500")(props)
                        }
                    },
                    _indeterminate: {
                        bg: mode(c + ".500", c + ".200")(props),
                        borderColor: mode(c + ".500", c + ".200")(props),
                        color: mode("white", "gray.900")(props)
                    },
                    _disabled: {
                        bg: mode("gray.100", "whiteAlpha.100")(props),
                        borderColor: mode("gray.100", "transparent")(props)
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _invalid: {
                        borderColor: mode("red.500", "red.300")(props)
                    }
                };
            }, baseStyleContainer$2 = {
                _disabled: {
                    cursor: "not-allowed"
                }
            }, baseStyleLabel$3 = {
                userSelect: "none",
                _disabled: {
                    opacity: 0.4
                }
            }, baseStyleIcon$4 = {
                transitionProperty: "transform",
                transitionDuration: "normal"
            }, Checkbox = {
                parts: checkboxAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        icon: baseStyleIcon$4,
                        container: baseStyleContainer$2,
                        control: baseStyleControl$1(props),
                        label: baseStyleLabel$3
                    };
                },
                sizes: {
                    sm: {
                        control: {
                            h: 3,
                            w: 3
                        },
                        label: {
                            fontSize: "sm"
                        },
                        icon: {
                            fontSize: "0.45rem"
                        }
                    },
                    md: {
                        control: {
                            w: 4,
                            h: 4
                        },
                        label: {
                            fontSize: "md"
                        },
                        icon: {
                            fontSize: "0.625rem"
                        }
                    },
                    lg: {
                        control: {
                            w: 5,
                            h: 5
                        },
                        label: {
                            fontSize: "lg"
                        },
                        icon: {
                            fontSize: "0.625rem"
                        }
                    }
                },
                defaultProps: {
                    size: "md",
                    colorScheme: "blue"
                }
            }, $size$1 = cssVar("close-button-size"), sizes$h = {
                lg: ((_lg$1 = {})[$size$1.variable] = "40px", _lg$1.fontSize = "16px", _lg$1),
                md: ((_md$1 = {})[$size$1.variable] = "32px", _md$1.fontSize = "12px", _md$1),
                sm: ((_sm$1 = {})[$size$1.variable] = "24px", _sm$1.fontSize = "10px", _sm$1)
            }, variants$8 = Badge.variants, defaultProps$h = Badge.defaultProps;
            /**
             * Since the `maxWidth` prop references theme.sizes internally,
             * we can leverage that to size our modals.
             */ function getSize$2(value) {
                return "full" === value ? {
                    dialog: {
                        maxW: "100vw",
                        h: "100vh"
                    }
                } : {
                    dialog: {
                        maxW: value
                    }
                };
            }
            var baseStyleOverlay$1 = {
                bg: "blackAlpha.600",
                zIndex: "overlay"
            }, baseStyleDialogContainer$1 = {
                display: "flex",
                zIndex: "modal",
                justifyContent: "center"
            }, baseStyleDialog$1 = function(props) {
                var isFullHeight = props.isFullHeight;
                return sizes_501602a9_esm_extends({}, isFullHeight && {
                    height: "100vh"
                }, {
                    zIndex: "modal",
                    maxH: "100vh",
                    bg: mode("white", "gray.700")(props),
                    color: "inherit",
                    boxShadow: mode("lg", "dark-lg")(props)
                });
            }, baseStyleHeader$2 = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            }, baseStyleCloseButton$3 = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            }, baseStyleBody$2 = {
                px: 6,
                py: 2,
                flex: 1,
                overflow: "auto"
            }, baseStyleFooter$2 = {
                px: 6,
                py: 4
            }, sizes$g = {
                xs: getSize$2("xs"),
                sm: getSize$2("md"),
                md: getSize$2("lg"),
                lg: getSize$2("2xl"),
                xl: getSize$2("4xl"),
                full: getSize$2("full")
            }, Drawer = {
                parts: drawerAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        overlay: baseStyleOverlay$1,
                        dialogContainer: baseStyleDialogContainer$1,
                        dialog: baseStyleDialog$1(props),
                        header: baseStyleHeader$2,
                        closeButton: baseStyleCloseButton$3,
                        body: baseStyleBody$2,
                        footer: baseStyleFooter$2
                    };
                },
                sizes: sizes$g,
                defaultProps: {
                    size: "xs"
                }
            }, Editable = {
                parts: editableAnatomy.keys,
                baseStyle: {
                    preview: {
                        borderRadius: "md",
                        py: "3px",
                        transitionProperty: "common",
                        transitionDuration: "normal"
                    },
                    input: {
                        borderRadius: "md",
                        py: "3px",
                        transitionProperty: "common",
                        transitionDuration: "normal",
                        width: "full",
                        _focusVisible: {
                            boxShadow: "outline"
                        },
                        _placeholder: {
                            opacity: 0.6
                        }
                    },
                    textarea: {
                        borderRadius: "md",
                        py: "3px",
                        transitionProperty: "common",
                        transitionDuration: "normal",
                        width: "full",
                        _focusVisible: {
                            boxShadow: "outline"
                        },
                        _placeholder: {
                            opacity: 0.6
                        }
                    }
                }
            }, Form = {
                parts: formAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        container: {
                            width: "100%",
                            position: "relative"
                        },
                        requiredIndicator: {
                            marginStart: 1,
                            color: mode("red.500", "red.300")(props)
                        },
                        helperText: {
                            mt: 2,
                            color: mode("gray.500", "whiteAlpha.600")(props),
                            lineHeight: "normal",
                            fontSize: "sm"
                        }
                    };
                }
            }, FormError = {
                parts: formErrorAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        text: {
                            color: mode("red.500", "red.300")(props),
                            mt: 2,
                            fontSize: "sm",
                            lineHeight: "normal"
                        },
                        icon: {
                            marginEnd: "0.5em",
                            color: mode("red.500", "red.300")(props)
                        }
                    };
                }
            }, size_lg = {
                fontSize: "lg",
                px: 4,
                h: 12,
                borderRadius: "md"
            }, size_md = {
                fontSize: "md",
                px: 4,
                h: 10,
                borderRadius: "md"
            }, size_sm = {
                fontSize: "sm",
                px: 3,
                h: 8,
                borderRadius: "sm"
            }, size_xs = {
                fontSize: "xs",
                px: 2,
                h: 6,
                borderRadius: "sm"
            };
            function getDefaults(props) {
                var fc = props.focusBorderColor, ec = props.errorBorderColor;
                return {
                    focusBorderColor: fc || mode("blue.500", "blue.300")(props),
                    errorBorderColor: ec || mode("red.500", "red.300")(props)
                };
            }
            var Input = {
                parts: inputAnatomy.keys,
                baseStyle: {
                    field: {
                        width: "100%",
                        minWidth: 0,
                        outline: 0,
                        position: "relative",
                        appearance: "none",
                        transitionProperty: "common",
                        transitionDuration: "normal"
                    }
                },
                sizes: {
                    lg: {
                        field: size_lg,
                        addon: size_lg
                    },
                    md: {
                        field: size_md,
                        addon: size_md
                    },
                    sm: {
                        field: size_sm,
                        addon: size_sm
                    },
                    xs: {
                        field: size_xs,
                        addon: size_xs
                    }
                },
                variants: {
                    outline: function(props) {
                        var theme = props.theme, _getDefaults = getDefaults(props), fc = _getDefaults.focusBorderColor, ec = _getDefaults.errorBorderColor;
                        return {
                            field: {
                                border: "1px solid",
                                borderColor: "inherit",
                                bg: "inherit",
                                _hover: {
                                    borderColor: mode("gray.300", "whiteAlpha.400")(props)
                                },
                                _readOnly: {
                                    boxShadow: "none !important",
                                    userSelect: "all"
                                },
                                _disabled: {
                                    opacity: 0.4,
                                    cursor: "not-allowed"
                                },
                                _invalid: {
                                    borderColor: getColor(theme, ec),
                                    boxShadow: "0 0 0 1px " + getColor(theme, ec)
                                },
                                _focusVisible: {
                                    zIndex: 1,
                                    borderColor: getColor(theme, fc),
                                    boxShadow: "0 0 0 1px " + getColor(theme, fc)
                                }
                            },
                            addon: {
                                border: "1px solid",
                                borderColor: mode("inherit", "whiteAlpha.50")(props),
                                bg: mode("gray.100", "whiteAlpha.300")(props)
                            }
                        };
                    },
                    filled: function(props) {
                        var theme = props.theme, _getDefaults2 = getDefaults(props), fc = _getDefaults2.focusBorderColor, ec = _getDefaults2.errorBorderColor;
                        return {
                            field: {
                                border: "2px solid",
                                borderColor: "transparent",
                                bg: mode("gray.100", "whiteAlpha.50")(props),
                                _hover: {
                                    bg: mode("gray.200", "whiteAlpha.100")(props)
                                },
                                _readOnly: {
                                    boxShadow: "none !important",
                                    userSelect: "all"
                                },
                                _disabled: {
                                    opacity: 0.4,
                                    cursor: "not-allowed"
                                },
                                _invalid: {
                                    borderColor: getColor(theme, ec)
                                },
                                _focusVisible: {
                                    bg: "transparent",
                                    borderColor: getColor(theme, fc)
                                }
                            },
                            addon: {
                                border: "2px solid",
                                borderColor: "transparent",
                                bg: mode("gray.100", "whiteAlpha.50")(props)
                            }
                        };
                    },
                    flushed: function(props) {
                        var theme = props.theme, _getDefaults3 = getDefaults(props), fc = _getDefaults3.focusBorderColor, ec = _getDefaults3.errorBorderColor;
                        return {
                            field: {
                                borderBottom: "1px solid",
                                borderColor: "inherit",
                                borderRadius: 0,
                                px: 0,
                                bg: "transparent",
                                _readOnly: {
                                    boxShadow: "none !important",
                                    userSelect: "all"
                                },
                                _invalid: {
                                    borderColor: getColor(theme, ec),
                                    boxShadow: "0px 1px 0px 0px " + getColor(theme, ec)
                                },
                                _focusVisible: {
                                    borderColor: getColor(theme, fc),
                                    boxShadow: "0px 1px 0px 0px " + getColor(theme, fc)
                                }
                            },
                            addon: {
                                borderBottom: "2px solid",
                                borderColor: "inherit",
                                borderRadius: 0,
                                px: 0,
                                bg: "transparent"
                            }
                        };
                    },
                    unstyled: {
                        field: {
                            bg: "transparent",
                            px: 0,
                            height: "auto"
                        },
                        addon: {
                            bg: "transparent",
                            px: 0,
                            height: "auto"
                        }
                    }
                },
                defaultProps: {
                    size: "md",
                    variant: "outline"
                }
            }, List = {
                parts: listAnatomy.keys,
                baseStyle: {
                    container: {},
                    item: {},
                    icon: {
                        marginEnd: "0.5rem",
                        display: "inline",
                        verticalAlign: "text-bottom"
                    }
                }
            }, baseStyleGroupTitle = {
                mx: 4,
                my: 2,
                fontWeight: "semibold",
                fontSize: "sm"
            }, baseStyleCommand = {
                opacity: 0.6
            }, baseStyleDivider = {
                border: 0,
                borderBottom: "1px solid",
                borderColor: "inherit",
                my: "0.5rem",
                opacity: 0.6
            }, baseStyleButton = {
                transitionProperty: "common",
                transitionDuration: "normal"
            }, Menu = {
                parts: menuAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        button: baseStyleButton,
                        list: {
                            bg: mode("#fff", "gray.700")(props),
                            boxShadow: mode("sm", "dark-lg")(props),
                            color: "inherit",
                            minW: "3xs",
                            py: "2",
                            zIndex: 1,
                            borderRadius: "md",
                            borderWidth: "1px"
                        },
                        item: {
                            py: "0.4rem",
                            px: "0.8rem",
                            transitionProperty: "background",
                            transitionDuration: "ultra-fast",
                            transitionTimingFunction: "ease-in",
                            _focus: {
                                bg: mode("gray.100", "whiteAlpha.100")(props)
                            },
                            _active: {
                                bg: mode("gray.200", "whiteAlpha.200")(props)
                            },
                            _expanded: {
                                bg: mode("gray.100", "whiteAlpha.100")(props)
                            },
                            _disabled: {
                                opacity: 0.4,
                                cursor: "not-allowed"
                            }
                        },
                        groupTitle: baseStyleGroupTitle,
                        command: baseStyleCommand,
                        divider: baseStyleDivider
                    };
                }
            }, baseStyleOverlay = {
                bg: "blackAlpha.600",
                zIndex: "modal"
            }, baseStyleDialog = function(props) {
                var scrollBehavior = props.scrollBehavior;
                return {
                    borderRadius: "md",
                    bg: mode("white", "gray.700")(props),
                    color: "inherit",
                    my: "3.75rem",
                    zIndex: "modal",
                    maxH: "inside" === scrollBehavior ? "calc(100% - 7.5rem)" : void 0,
                    boxShadow: mode("lg", "dark-lg")(props)
                };
            }, baseStyleHeader$1 = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            }, baseStyleCloseButton$2 = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            }, baseStyleFooter$1 = {
                px: 6,
                py: 4
            };
            /**
             * Since the `maxWidth` prop references theme.sizes internally,
             * we can leverage that to size our modals.
             */ function getSize$1(value) {
                return "full" === value ? {
                    dialog: {
                        maxW: "100vw",
                        minH: "100vh",
                        "@supports(min-height: -webkit-fill-available)": {
                            minH: "-webkit-fill-available"
                        },
                        my: 0
                    }
                } : {
                    dialog: {
                        maxW: value
                    }
                };
            }
            var sizes$d = {
                xs: getSize$1("xs"),
                sm: getSize$1("sm"),
                md: getSize$1("md"),
                lg: getSize$1("lg"),
                xl: getSize$1("xl"),
                "2xl": getSize$1("2xl"),
                "3xl": getSize$1("3xl"),
                "4xl": getSize$1("4xl"),
                "5xl": getSize$1("5xl"),
                "6xl": getSize$1("6xl"),
                full: getSize$1("full")
            }, Modal = {
                parts: modalAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        overlay: baseStyleOverlay,
                        dialogContainer: {
                            display: "flex",
                            zIndex: "modal",
                            justifyContent: "center",
                            alignItems: props.isCentered ? "center" : "flex-start",
                            overflow: "inside" === props.scrollBehavior ? "hidden" : "auto"
                        },
                        dialog: baseStyleDialog(props),
                        header: baseStyleHeader$1,
                        closeButton: baseStyleCloseButton$2,
                        body: {
                            px: 6,
                            py: 2,
                            flex: 1,
                            overflow: "inside" === props.scrollBehavior ? "auto" : void 0
                        },
                        footer: baseStyleFooter$1
                    };
                },
                sizes: sizes$d,
                defaultProps: {
                    size: "md"
                }
            }, variants$5 = Input.variants, defaultProps$b = Input.defaultProps, $stepperWidth = cssVar("number-input-stepper-width"), $inputPadding = cssVar("number-input-input-padding"), inputPaddingValue = calc($stepperWidth).add("0.5rem").toString(), baseStyleRoot$1 = ((_baseStyleRoot = {})[$stepperWidth.variable] = "24px", _baseStyleRoot[$inputPadding.variable] = inputPaddingValue, _baseStyleRoot), baseStyleField$1 = null != (_Input$baseStyle$fiel = null == (_Input$baseStyle = Input.baseStyle) ? void 0 : _Input$baseStyle.field) ? _Input$baseStyle$fiel : {}, baseStyleStepperGroup = {
                width: [
                    $stepperWidth.reference
                ]
            };
            function getSize(size) {
                var _sizeStyle$field$font, _sizeStyle$field, sizeStyle = Input.sizes[size], radius = {
                    lg: "md",
                    md: "md",
                    sm: "sm",
                    xs: "sm"
                }, _fontSize = null != (_sizeStyle$field$font = null == (_sizeStyle$field = sizeStyle.field) ? void 0 : _sizeStyle$field.fontSize) ? _sizeStyle$field$font : "md", fontSize = typography.fontSizes[_fontSize];
                return {
                    field: sizes_501602a9_esm_extends({}, sizeStyle.field, {
                        paddingInlineEnd: $inputPadding.reference,
                        verticalAlign: "top"
                    }),
                    stepper: {
                        fontSize: calc(fontSize).multiply(0.75).toString(),
                        _first: {
                            borderTopEndRadius: radius[size]
                        },
                        _last: {
                            borderBottomEndRadius: radius[size],
                            mt: "-1px",
                            borderTopWidth: 1
                        }
                    }
                };
            }
            var sizes$c = {
                xs: getSize("xs"),
                sm: getSize("sm"),
                md: getSize("md"),
                lg: getSize("lg")
            }, NumberInput = {
                parts: numberInputAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        root: baseStyleRoot$1,
                        field: baseStyleField$1,
                        stepperGroup: baseStyleStepperGroup,
                        stepper: {
                            borderStart: "1px solid",
                            borderStartColor: mode("inherit", "whiteAlpha.300")(props),
                            color: mode("inherit", "whiteAlpha.800")(props),
                            _active: {
                                bg: mode("gray.200", "whiteAlpha.300")(props)
                            },
                            _disabled: {
                                opacity: 0.4,
                                cursor: "not-allowed"
                            }
                        }
                    };
                },
                sizes: sizes$c,
                variants: variants$5,
                defaultProps: defaultProps$b
            }, baseStyle$f = sizes_501602a9_esm_extends({}, Input.baseStyle.field, {
                textAlign: "center"
            }), variants$4 = {
                outline: function(props) {
                    var _Input$variants$outli;
                    return null != (_Input$variants$outli = Input.variants.outline(props).field) ? _Input$variants$outli : {};
                },
                flushed: function(props) {
                    var _Input$variants$flush;
                    return null != (_Input$variants$flush = Input.variants.flushed(props).field) ? _Input$variants$flush : {};
                },
                filled: function(props) {
                    var _Input$variants$fille;
                    return null != (_Input$variants$fille = Input.variants.filled(props).field) ? _Input$variants$fille : {};
                },
                unstyled: null != (_Input$variants$unsty$1 = Input.variants.unstyled.field) ? _Input$variants$unsty$1 : {}
            }, defaultProps$a = Input.defaultProps, $popperBg = cssVar("popper-bg"), $arrowBg$1 = cssVar("popper-arrow-bg"), $arrowShadowColor = cssVar("popper-arrow-shadow-color"), baseStylePopper = {
                zIndex: 10
            }, baseStyleContent = function(props) {
                var _ref, bg = mode("white", "gray.700")(props), shadowColor = mode("gray.200", "whiteAlpha.300")(props);
                return (_ref = {})[$popperBg.variable] = "colors." + bg, _ref.bg = $popperBg.reference, _ref[$arrowBg$1.variable] = $popperBg.reference, _ref[$arrowShadowColor.variable] = "colors." + shadowColor, _ref.width = "xs", _ref.border = "1px solid", _ref.borderColor = "inherit", _ref.borderRadius = "md", _ref.boxShadow = "sm", _ref.zIndex = "inherit", _ref._focusVisible = {
                    outline: 0,
                    boxShadow: "outline"
                }, _ref;
            }, baseStyleHeader = {
                px: 3,
                py: 2,
                borderBottomWidth: "1px"
            }, baseStyleBody = {
                px: 3,
                py: 2
            }, baseStyleFooter = {
                px: 3,
                py: 2,
                borderTopWidth: "1px"
            }, baseStyleCloseButton$1 = {
                position: "absolute",
                borderRadius: "md",
                top: 1,
                insetEnd: 2,
                padding: 2
            }, Popover = {
                parts: popoverAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        popper: baseStylePopper,
                        content: baseStyleContent(props),
                        header: baseStyleHeader,
                        body: baseStyleBody,
                        footer: baseStyleFooter,
                        arrow: {},
                        closeButton: baseStyleCloseButton$1
                    };
                }
            }, baseStyleLabel$2 = {
                lineHeight: "1",
                fontSize: "0.25em",
                fontWeight: "bold",
                color: "white"
            }, baseStyleFilledTrack$1 = function(props) {
                var c, t, isIndeterminate, hasStripe, stripeStyle, bgColor, gradient;
                return sizes_501602a9_esm_extends({
                    transitionProperty: "common",
                    transitionDuration: "slow"
                }, (c = props.colorScheme, t = props.theme, isIndeterminate = props.isIndeterminate, hasStripe = props.hasStripe, stripeStyle = mode(generateStripe(), generateStripe("1rem", "rgba(0,0,0,0.1)"))(props), gradient = "linear-gradient(\n    to right,\n    transparent 0%,\n    " + getColor(t, bgColor = mode(c + ".500", c + ".200")(props)) + " 50%,\n    transparent 100%\n  )", sizes_501602a9_esm_extends({}, !isIndeterminate && hasStripe && stripeStyle, isIndeterminate ? {
                    bgImage: gradient
                } : {
                    bgColor: bgColor
                })));
            }, Progress = {
                parts: progressAnatomy.keys,
                sizes: {
                    xs: {
                        track: {
                            h: "0.25rem"
                        }
                    },
                    sm: {
                        track: {
                            h: "0.5rem"
                        }
                    },
                    md: {
                        track: {
                            h: "0.75rem"
                        }
                    },
                    lg: {
                        track: {
                            h: "1rem"
                        }
                    }
                },
                baseStyle: function(props) {
                    return {
                        label: baseStyleLabel$2,
                        filledTrack: baseStyleFilledTrack$1(props),
                        track: {
                            bg: mode("gray.100", "whiteAlpha.300")(props)
                        }
                    };
                },
                defaultProps: {
                    size: "md",
                    colorScheme: "blue"
                }
            }, baseStyleControl = function(props) {
                var _Checkbox$baseStyle$c = Checkbox.baseStyle(props).control, control = void 0 === _Checkbox$baseStyle$c ? {} : _Checkbox$baseStyle$c;
                return sizes_501602a9_esm_extends({}, control, {
                    borderRadius: "full",
                    _checked: sizes_501602a9_esm_extends({}, control._checked, {
                        _before: {
                            content: '""',
                            display: "inline-block",
                            pos: "relative",
                            w: "50%",
                            h: "50%",
                            borderRadius: "50%",
                            bg: "currentColor"
                        }
                    })
                });
            }, Radio = {
                parts: radioAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        label: Checkbox.baseStyle(props).label,
                        container: Checkbox.baseStyle(props).container,
                        control: baseStyleControl(props)
                    };
                },
                sizes: {
                    md: {
                        control: {
                            w: 4,
                            h: 4
                        },
                        label: {
                            fontSize: "md"
                        }
                    },
                    lg: {
                        control: {
                            w: 5,
                            h: 5
                        },
                        label: {
                            fontSize: "lg"
                        }
                    },
                    sm: {
                        control: {
                            width: 3,
                            height: 3
                        },
                        label: {
                            fontSize: "sm"
                        }
                    }
                },
                defaultProps: {
                    size: "md",
                    colorScheme: "blue"
                }
            }, baseStyleIcon$1 = {
                width: "1.5rem",
                height: "100%",
                insetEnd: "0.5rem",
                position: "relative",
                color: "currentColor",
                fontSize: "1.25rem",
                _disabled: {
                    opacity: 0.5
                }
            }, iconSpacing = {
                paddingInlineEnd: "2rem"
            }, sizes$8 = lodash_mergewith_default()({}, Input.sizes, {
                lg: {
                    field: iconSpacing
                },
                md: {
                    field: iconSpacing
                },
                sm: {
                    field: iconSpacing
                },
                xs: {
                    field: iconSpacing,
                    icon: {
                        insetEnd: "0.25rem"
                    }
                }
            }), Select = {
                parts: selectAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        field: sizes_501602a9_esm_extends({}, Input.baseStyle.field, {
                            bg: mode("white", "gray.700")(props),
                            appearance: "none",
                            paddingBottom: "1px",
                            lineHeight: "normal",
                            "> option, > optgroup": {
                                bg: mode("white", "gray.700")(props)
                            }
                        }),
                        icon: baseStyleIcon$1
                    };
                },
                sizes: sizes$8,
                variants: Input.variants,
                defaultProps: Input.defaultProps
            }, baseStyleContainer$1 = function(props) {
                var orientation = props.orientation;
                return sizes_501602a9_esm_extends({
                    display: "inline-block",
                    position: "relative",
                    cursor: "pointer",
                    _disabled: {
                        opacity: 0.6,
                        cursor: "default",
                        pointerEvents: "none"
                    }
                }, orient({
                    orientation: orientation,
                    vertical: {
                        h: "100%"
                    },
                    horizontal: {
                        w: "100%"
                    }
                }));
            }, baseStyleFilledTrack = function(props) {
                var c = props.colorScheme;
                return {
                    width: "inherit",
                    height: "inherit",
                    bg: mode(c + ".500", c + ".200")(props)
                };
            }, Slider = {
                parts: sliderAnatomy.keys,
                sizes: {
                    lg: function(props) {
                        return {
                            thumb: {
                                w: "16px",
                                h: "16px"
                            },
                            track: orient({
                                orientation: props.orientation,
                                horizontal: {
                                    h: "4px"
                                },
                                vertical: {
                                    w: "4px"
                                }
                            })
                        };
                    },
                    md: function(props) {
                        return {
                            thumb: {
                                w: "14px",
                                h: "14px"
                            },
                            track: orient({
                                orientation: props.orientation,
                                horizontal: {
                                    h: "4px"
                                },
                                vertical: {
                                    w: "4px"
                                }
                            })
                        };
                    },
                    sm: function(props) {
                        return {
                            thumb: {
                                w: "10px",
                                h: "10px"
                            },
                            track: orient({
                                orientation: props.orientation,
                                horizontal: {
                                    h: "2px"
                                },
                                vertical: {
                                    w: "2px"
                                }
                            })
                        };
                    }
                },
                baseStyle: function(props) {
                    return {
                        container: baseStyleContainer$1(props),
                        track: {
                            overflow: "hidden",
                            borderRadius: "sm",
                            bg: mode("gray.200", "whiteAlpha.200")(props),
                            _disabled: {
                                bg: mode("gray.300", "whiteAlpha.300")(props)
                            }
                        },
                        thumb: sizes_501602a9_esm_extends({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            outline: 0,
                            zIndex: 1,
                            borderRadius: "full",
                            bg: "white",
                            boxShadow: "base",
                            border: "1px solid",
                            borderColor: "transparent",
                            transitionProperty: "transform",
                            transitionDuration: "normal",
                            _focusVisible: {
                                boxShadow: "outline"
                            },
                            _disabled: {
                                bg: "gray.300"
                            }
                        }, orient({
                            orientation: props.orientation,
                            vertical: {
                                left: "50%",
                                transform: "translateX(-50%)",
                                _active: {
                                    transform: "translateX(-50%) scale(1.15)"
                                }
                            },
                            horizontal: {
                                top: "50%",
                                transform: "translateY(-50%)",
                                _active: {
                                    transform: "translateY(-50%) scale(1.15)"
                                }
                            }
                        })),
                        filledTrack: baseStyleFilledTrack(props)
                    };
                },
                defaultProps: {
                    size: "md",
                    colorScheme: "blue"
                }
            }, $size = cssVar("spinner-size"), baseStyle$7 = {
                width: [
                    $size.reference
                ],
                height: [
                    $size.reference
                ]
            }, sizes$6 = {
                xs: ((_xs = {})[$size.variable] = "0.75rem", _xs),
                sm: ((_sm = {})[$size.variable] = "1rem", _sm),
                md: ((_md = {})[$size.variable] = "1.5rem", _md),
                lg: ((_lg = {})[$size.variable] = "2rem", _lg),
                xl: ((_xl = {})[$size.variable] = "3rem", _xl)
            }, Stat = {
                parts: statAnatomy.keys,
                baseStyle: {
                    container: {},
                    label: {
                        fontWeight: "medium"
                    },
                    helpText: {
                        opacity: 0.8,
                        marginBottom: 2
                    },
                    number: {
                        verticalAlign: "baseline",
                        fontWeight: "semibold"
                    },
                    icon: {
                        marginEnd: 1,
                        w: "14px",
                        h: "14px",
                        verticalAlign: "middle"
                    }
                },
                sizes: {
                    md: {
                        label: {
                            fontSize: "sm"
                        },
                        helpText: {
                            fontSize: "sm"
                        },
                        number: {
                            fontSize: "2xl"
                        }
                    }
                },
                defaultProps: {
                    size: "md"
                }
            }, $width = cssVar("switch-track-width"), $height = cssVar("switch-track-height"), $diff = cssVar("switch-track-diff"), diffValue = calc.subtract($width, $height), $translateX = cssVar("switch-thumb-x"), baseStyleTrack = function(props) {
                var c = props.colorScheme;
                return {
                    borderRadius: "full",
                    p: "2px",
                    width: [
                        $width.reference
                    ],
                    height: [
                        $height.reference
                    ],
                    transitionProperty: "common",
                    transitionDuration: "fast",
                    bg: mode("gray.300", "whiteAlpha.400")(props),
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    },
                    _checked: {
                        bg: mode(c + ".500", c + ".200")(props)
                    }
                };
            }, baseStyleThumb = {
                bg: "white",
                transitionProperty: "transform",
                transitionDuration: "normal",
                borderRadius: "inherit",
                width: [
                    $height.reference
                ],
                height: [
                    $height.reference
                ],
                _checked: {
                    transform: "translateX(" + $translateX.reference + ")"
                }
            }, sizes$4 = {
                sm: {
                    container: ((_container2 = {})[$width.variable] = "1.375rem", _container2[$height.variable] = "0.75rem", _container2)
                },
                md: {
                    container: ((_container3 = {})[$width.variable] = "1.875rem", _container3[$height.variable] = "1rem", _container3)
                },
                lg: {
                    container: ((_container4 = {})[$width.variable] = "2.875rem", _container4[$height.variable] = "1.5rem", _container4)
                }
            }, Switch = {
                parts: switchAnatomy.keys,
                baseStyle: function(props) {
                    var _rtl, _container;
                    return {
                        container: ((_container = {})[$diff.variable] = diffValue, _container[$translateX.variable] = $diff.reference, _container._rtl = ((_rtl = {})[$translateX.variable] = calc($diff).negate().toString(), _rtl), _container),
                        track: baseStyleTrack(props),
                        thumb: baseStyleThumb
                    };
                },
                sizes: sizes$4,
                defaultProps: {
                    size: "md",
                    colorScheme: "blue"
                }
            }, numericStyles = {
                "&[data-is-numeric=true]": {
                    textAlign: "end"
                }
            }, Table = {
                parts: tableAnatomy.keys,
                baseStyle: {
                    table: {
                        fontVariantNumeric: "lining-nums tabular-nums",
                        borderCollapse: "collapse",
                        width: "full"
                    },
                    th: {
                        fontFamily: "heading",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "wider",
                        textAlign: "start"
                    },
                    td: {
                        textAlign: "start"
                    },
                    caption: {
                        mt: 4,
                        fontFamily: "heading",
                        textAlign: "center",
                        fontWeight: "medium"
                    }
                },
                variants: {
                    simple: function(props) {
                        var c = props.colorScheme;
                        return {
                            th: sizes_501602a9_esm_extends({
                                color: mode("gray.600", "gray.400")(props),
                                borderBottom: "1px",
                                borderColor: mode(c + ".100", c + ".700")(props)
                            }, numericStyles),
                            td: sizes_501602a9_esm_extends({
                                borderBottom: "1px",
                                borderColor: mode(c + ".100", c + ".700")(props)
                            }, numericStyles),
                            caption: {
                                color: mode("gray.600", "gray.100")(props)
                            },
                            tfoot: {
                                tr: {
                                    "&:last-of-type": {
                                        th: {
                                            borderBottomWidth: 0
                                        }
                                    }
                                }
                            }
                        };
                    },
                    striped: function(props) {
                        var c = props.colorScheme;
                        return {
                            th: sizes_501602a9_esm_extends({
                                color: mode("gray.600", "gray.400")(props),
                                borderBottom: "1px",
                                borderColor: mode(c + ".100", c + ".700")(props)
                            }, numericStyles),
                            td: sizes_501602a9_esm_extends({
                                borderBottom: "1px",
                                borderColor: mode(c + ".100", c + ".700")(props)
                            }, numericStyles),
                            caption: {
                                color: mode("gray.600", "gray.100")(props)
                            },
                            tbody: {
                                tr: {
                                    "&:nth-of-type(odd)": {
                                        "th, td": {
                                            borderBottomWidth: "1px",
                                            borderColor: mode(c + ".100", c + ".700")(props)
                                        },
                                        td: {
                                            background: mode(c + ".100", c + ".700")(props)
                                        }
                                    }
                                }
                            },
                            tfoot: {
                                tr: {
                                    "&:last-of-type": {
                                        th: {
                                            borderBottomWidth: 0
                                        }
                                    }
                                }
                            }
                        };
                    },
                    unstyled: {}
                },
                sizes: {
                    sm: {
                        th: {
                            px: "4",
                            py: "1",
                            lineHeight: "4",
                            fontSize: "xs"
                        },
                        td: {
                            px: "4",
                            py: "2",
                            fontSize: "sm",
                            lineHeight: "4"
                        },
                        caption: {
                            px: "4",
                            py: "2",
                            fontSize: "xs"
                        }
                    },
                    md: {
                        th: {
                            px: "6",
                            py: "3",
                            lineHeight: "4",
                            fontSize: "xs"
                        },
                        td: {
                            px: "6",
                            py: "4",
                            lineHeight: "5"
                        },
                        caption: {
                            px: "6",
                            py: "2",
                            fontSize: "sm"
                        }
                    },
                    lg: {
                        th: {
                            px: "8",
                            py: "4",
                            lineHeight: "5",
                            fontSize: "sm"
                        },
                        td: {
                            px: "8",
                            py: "5",
                            lineHeight: "6"
                        },
                        caption: {
                            px: "6",
                            py: "2",
                            fontSize: "md"
                        }
                    }
                },
                defaultProps: {
                    variant: "simple",
                    size: "md",
                    colorScheme: "gray"
                }
            }, baseStyleTablist = function(props) {
                var _props$align = props.align;
                return {
                    justifyContent: ({
                        end: "flex-end",
                        center: "center",
                        start: "flex-start"
                    })[void 0 === _props$align ? "start" : _props$align],
                    flexDirection: "vertical" === props.orientation ? "column" : "row"
                };
            }, baseStyleTabpanel = {
                p: 4
            }, Tabs = {
                parts: tabsAnatomy.keys,
                baseStyle: function(props) {
                    return {
                        root: {
                            display: "vertical" === props.orientation ? "flex" : "block"
                        },
                        tab: {
                            flex: props.isFitted ? 1 : void 0,
                            transitionProperty: "common",
                            transitionDuration: "normal",
                            _focusVisible: {
                                zIndex: 1,
                                boxShadow: "outline"
                            },
                            _disabled: {
                                cursor: "not-allowed",
                                opacity: 0.4
                            }
                        },
                        tablist: baseStyleTablist(props),
                        tabpanel: baseStyleTabpanel
                    };
                },
                sizes: {
                    sm: {
                        tab: {
                            py: 1,
                            px: 4,
                            fontSize: "sm"
                        }
                    },
                    md: {
                        tab: {
                            fontSize: "md",
                            py: 2,
                            px: 4
                        }
                    },
                    lg: {
                        tab: {
                            fontSize: "lg",
                            py: 3,
                            px: 4
                        }
                    }
                },
                variants: {
                    line: function(props) {
                        var _tablist, _tab, c = props.colorScheme, orientation = props.orientation, borderProp = "vertical" === orientation ? "borderStart" : "borderBottom";
                        return {
                            tablist: ((_tablist = {})[borderProp] = "2px solid", _tablist.borderColor = "inherit", _tablist),
                            tab: ((_tab = {})[borderProp] = "2px solid", _tab.borderColor = "transparent", _tab["vertical" === orientation ? "marginStart" : "marginBottom"] = "-2px", _tab._selected = {
                                color: mode(c + ".600", c + ".300")(props),
                                borderColor: "currentColor"
                            }, _tab._active = {
                                bg: mode("gray.200", "whiteAlpha.300")(props)
                            }, _tab._disabled = {
                                _active: {
                                    bg: "none"
                                }
                            }, _tab)
                        };
                    },
                    enclosed: function(props) {
                        var c = props.colorScheme;
                        return {
                            tab: {
                                borderTopRadius: "md",
                                border: "1px solid",
                                borderColor: "transparent",
                                mb: "-1px",
                                _selected: {
                                    color: mode(c + ".600", c + ".300")(props),
                                    borderColor: "inherit",
                                    borderBottomColor: mode("white", "gray.800")(props)
                                }
                            },
                            tablist: {
                                mb: "-1px",
                                borderBottom: "1px solid",
                                borderColor: "inherit"
                            }
                        };
                    },
                    "enclosed-colored": function(props) {
                        var c = props.colorScheme;
                        return {
                            tab: {
                                border: "1px solid",
                                borderColor: "inherit",
                                bg: mode("gray.50", "whiteAlpha.50")(props),
                                mb: "-1px",
                                _notLast: {
                                    marginEnd: "-1px"
                                },
                                _selected: {
                                    bg: mode("#fff", "gray.800")(props),
                                    color: mode(c + ".600", c + ".300")(props),
                                    borderColor: "inherit",
                                    borderTopColor: "currentColor",
                                    borderBottomColor: "transparent"
                                }
                            },
                            tablist: {
                                mb: "-1px",
                                borderBottom: "1px solid",
                                borderColor: "inherit"
                            }
                        };
                    },
                    "soft-rounded": function(props) {
                        var c = props.colorScheme, theme = props.theme;
                        return {
                            tab: {
                                borderRadius: "full",
                                fontWeight: "semibold",
                                color: "gray.600",
                                _selected: {
                                    color: getColor(theme, c + ".700"),
                                    bg: getColor(theme, c + ".100")
                                }
                            }
                        };
                    },
                    "solid-rounded": function(props) {
                        var c = props.colorScheme;
                        return {
                            tab: {
                                borderRadius: "full",
                                fontWeight: "semibold",
                                color: mode("gray.600", "inherit")(props),
                                _selected: {
                                    color: mode("#fff", "gray.800")(props),
                                    bg: mode(c + ".600", c + ".300")(props)
                                }
                            }
                        };
                    },
                    unstyled: {}
                },
                defaultProps: {
                    size: "md",
                    variant: "line",
                    colorScheme: "blue"
                }
            }, Tag = {
                parts: tagAnatomy.keys,
                variants: {
                    subtle: function(props) {
                        return {
                            container: Badge.variants.subtle(props)
                        };
                    },
                    solid: function(props) {
                        return {
                            container: Badge.variants.solid(props)
                        };
                    },
                    outline: function(props) {
                        return {
                            container: Badge.variants.outline(props)
                        };
                    }
                },
                baseStyle: {
                    container: {
                        fontWeight: "medium",
                        lineHeight: 1.2,
                        outline: 0,
                        borderRadius: "md",
                        _focusVisible: {
                            boxShadow: "outline"
                        }
                    },
                    label: {
                        lineHeight: 1.2,
                        overflow: "visible"
                    },
                    closeButton: {
                        fontSize: "18px",
                        w: "1.25rem",
                        h: "1.25rem",
                        transitionProperty: "common",
                        transitionDuration: "normal",
                        borderRadius: "full",
                        marginStart: "0.375rem",
                        marginEnd: "-1",
                        opacity: 0.5,
                        _disabled: {
                            opacity: 0.4
                        },
                        _focusVisible: {
                            boxShadow: "outline",
                            bg: "rgba(0, 0, 0, 0.14)"
                        },
                        _hover: {
                            opacity: 0.8
                        },
                        _active: {
                            opacity: 1
                        }
                    }
                },
                sizes: {
                    sm: {
                        container: {
                            minH: "1.25rem",
                            minW: "1.25rem",
                            fontSize: "xs",
                            px: 2
                        },
                        closeButton: {
                            marginEnd: "-2px",
                            marginStart: "0.35rem"
                        }
                    },
                    md: {
                        container: {
                            minH: "1.5rem",
                            minW: "1.5rem",
                            fontSize: "sm",
                            px: 2
                        }
                    },
                    lg: {
                        container: {
                            minH: 8,
                            minW: 8,
                            fontSize: "md",
                            px: 3
                        }
                    }
                },
                defaultProps: {
                    size: "md",
                    variant: "subtle",
                    colorScheme: "gray"
                }
            }, baseStyle$1 = sizes_501602a9_esm_extends({}, Input.baseStyle.field, {
                paddingY: "8px",
                minHeight: "80px",
                lineHeight: "short",
                verticalAlign: "top"
            }), variants = {
                outline: function(props) {
                    var _Input$variants$outli;
                    return null != (_Input$variants$outli = Input.variants.outline(props).field) ? _Input$variants$outli : {};
                },
                flushed: function(props) {
                    var _Input$variants$flush;
                    return null != (_Input$variants$flush = Input.variants.flushed(props).field) ? _Input$variants$flush : {};
                },
                filled: function(props) {
                    var _Input$variants$fille;
                    return null != (_Input$variants$fille = Input.variants.filled(props).field) ? _Input$variants$fille : {};
                },
                unstyled: null != (_Input$variants$unsty = Input.variants.unstyled.field) ? _Input$variants$unsty : {}
            }, chakra_ui_theme_components_esm_sizes = {
                xs: null != (_Input$sizes$xs$field = Input.sizes.xs.field) ? _Input$sizes$xs$field : {},
                sm: null != (_Input$sizes$sm$field = Input.sizes.sm.field) ? _Input$sizes$sm$field : {},
                md: null != (_Input$sizes$md$field = Input.sizes.md.field) ? _Input$sizes$md$field : {},
                lg: null != (_Input$sizes$lg$field = Input.sizes.lg.field) ? _Input$sizes$lg$field : {}
            }, $bg = cssVar("tooltip-bg"), $arrowBg = cssVar("popper-arrow-bg"), breakpoints = (config = {
                sm: "30em",
                md: "48em",
                lg: "62em",
                xl: "80em",
                "2xl": "96em"
            }, (0, chakra_ui_utils_esm /* warn */ .ZK)({
                condition: !0,
                message: "[chakra-ui]: createBreakpoints(...) will be deprecated pretty soonsimply pass the breakpoints as an object. Remove the createBreakpoint(..) call"
            }), chakra_ui_theme_tools_esm_extends({
                base: "0em"
            }, config)), foundations = sizes_501602a9_esm_extends({
                breakpoints: breakpoints,
                zIndices: {
                    hide: -1,
                    auto: "auto",
                    base: 0,
                    docked: 10,
                    dropdown: 1000,
                    sticky: 1100,
                    banner: 1200,
                    overlay: 1300,
                    modal: 1400,
                    popover: 1500,
                    skipLink: 1600,
                    toast: 1700,
                    tooltip: 1800
                },
                radii: {
                    none: "0",
                    sm: "0.125rem",
                    base: "0.25rem",
                    md: "0.375rem",
                    lg: "0.5rem",
                    xl: "0.75rem",
                    "2xl": "1rem",
                    "3xl": "1.5rem",
                    full: "9999px"
                },
                blur: {
                    none: 0,
                    sm: "4px",
                    base: "8px",
                    md: "12px",
                    lg: "16px",
                    xl: "24px",
                    "2xl": "40px",
                    "3xl": "64px"
                },
                colors: {
                    transparent: "transparent",
                    current: "currentColor",
                    black: "#000000",
                    white: "#FFFFFF",
                    whiteAlpha: {
                        50: "rgba(255, 255, 255, 0.04)",
                        100: "rgba(255, 255, 255, 0.06)",
                        200: "rgba(255, 255, 255, 0.08)",
                        300: "rgba(255, 255, 255, 0.16)",
                        400: "rgba(255, 255, 255, 0.24)",
                        500: "rgba(255, 255, 255, 0.36)",
                        600: "rgba(255, 255, 255, 0.48)",
                        700: "rgba(255, 255, 255, 0.64)",
                        800: "rgba(255, 255, 255, 0.80)",
                        900: "rgba(255, 255, 255, 0.92)"
                    },
                    blackAlpha: {
                        50: "rgba(0, 0, 0, 0.04)",
                        100: "rgba(0, 0, 0, 0.06)",
                        200: "rgba(0, 0, 0, 0.08)",
                        300: "rgba(0, 0, 0, 0.16)",
                        400: "rgba(0, 0, 0, 0.24)",
                        500: "rgba(0, 0, 0, 0.36)",
                        600: "rgba(0, 0, 0, 0.48)",
                        700: "rgba(0, 0, 0, 0.64)",
                        800: "rgba(0, 0, 0, 0.80)",
                        900: "rgba(0, 0, 0, 0.92)"
                    },
                    gray: {
                        50: "#F7FAFC",
                        100: "#EDF2F7",
                        200: "#E2E8F0",
                        300: "#CBD5E0",
                        400: "#A0AEC0",
                        500: "#718096",
                        600: "#4A5568",
                        700: "#2D3748",
                        800: "#1A202C",
                        900: "#171923"
                    },
                    red: {
                        50: "#FFF5F5",
                        100: "#FED7D7",
                        200: "#FEB2B2",
                        300: "#FC8181",
                        400: "#F56565",
                        500: "#E53E3E",
                        600: "#C53030",
                        700: "#9B2C2C",
                        800: "#822727",
                        900: "#63171B"
                    },
                    orange: {
                        50: "#FFFAF0",
                        100: "#FEEBC8",
                        200: "#FBD38D",
                        300: "#F6AD55",
                        400: "#ED8936",
                        500: "#DD6B20",
                        600: "#C05621",
                        700: "#9C4221",
                        800: "#7B341E",
                        900: "#652B19"
                    },
                    yellow: {
                        50: "#FFFFF0",
                        100: "#FEFCBF",
                        200: "#FAF089",
                        300: "#F6E05E",
                        400: "#ECC94B",
                        500: "#D69E2E",
                        600: "#B7791F",
                        700: "#975A16",
                        800: "#744210",
                        900: "#5F370E"
                    },
                    green: {
                        50: "#F0FFF4",
                        100: "#C6F6D5",
                        200: "#9AE6B4",
                        300: "#68D391",
                        400: "#48BB78",
                        500: "#38A169",
                        600: "#2F855A",
                        700: "#276749",
                        800: "#22543D",
                        900: "#1C4532"
                    },
                    teal: {
                        50: "#E6FFFA",
                        100: "#B2F5EA",
                        200: "#81E6D9",
                        300: "#4FD1C5",
                        400: "#38B2AC",
                        500: "#319795",
                        600: "#2C7A7B",
                        700: "#285E61",
                        800: "#234E52",
                        900: "#1D4044"
                    },
                    blue: {
                        50: "#ebf8ff",
                        100: "#bee3f8",
                        200: "#90cdf4",
                        300: "#63b3ed",
                        400: "#4299e1",
                        500: "#3182ce",
                        600: "#2b6cb0",
                        700: "#2c5282",
                        800: "#2a4365",
                        900: "#1A365D"
                    },
                    cyan: {
                        50: "#EDFDFD",
                        100: "#C4F1F9",
                        200: "#9DECF9",
                        300: "#76E4F7",
                        400: "#0BC5EA",
                        500: "#00B5D8",
                        600: "#00A3C4",
                        700: "#0987A0",
                        800: "#086F83",
                        900: "#065666"
                    },
                    purple: {
                        50: "#FAF5FF",
                        100: "#E9D8FD",
                        200: "#D6BCFA",
                        300: "#B794F4",
                        400: "#9F7AEA",
                        500: "#805AD5",
                        600: "#6B46C1",
                        700: "#553C9A",
                        800: "#44337A",
                        900: "#322659"
                    },
                    pink: {
                        50: "#FFF5F7",
                        100: "#FED7E2",
                        200: "#FBB6CE",
                        300: "#F687B3",
                        400: "#ED64A6",
                        500: "#D53F8C",
                        600: "#B83280",
                        700: "#97266D",
                        800: "#702459",
                        900: "#521B41"
                    },
                    linkedin: {
                        50: "#E8F4F9",
                        100: "#CFEDFB",
                        200: "#9BDAF3",
                        300: "#68C7EC",
                        400: "#34B3E4",
                        500: "#00A0DC",
                        600: "#008CC9",
                        700: "#0077B5",
                        800: "#005E93",
                        900: "#004471"
                    },
                    facebook: {
                        50: "#E8F4F9",
                        100: "#D9DEE9",
                        200: "#B7C2DA",
                        300: "#6482C0",
                        400: "#4267B2",
                        500: "#385898",
                        600: "#314E89",
                        700: "#29487D",
                        800: "#223B67",
                        900: "#1E355B"
                    },
                    messenger: {
                        50: "#D0E6FF",
                        100: "#B9DAFF",
                        200: "#A2CDFF",
                        300: "#7AB8FF",
                        400: "#2E90FF",
                        500: "#0078FF",
                        600: "#0063D1",
                        700: "#0052AC",
                        800: "#003C7E",
                        900: "#002C5C"
                    },
                    whatsapp: {
                        50: "#dffeec",
                        100: "#b9f5d0",
                        200: "#90edb3",
                        300: "#65e495",
                        400: "#3cdd78",
                        500: "#22c35e",
                        600: "#179848",
                        700: "#0c6c33",
                        800: "#01421c",
                        900: "#001803"
                    },
                    twitter: {
                        50: "#E5F4FD",
                        100: "#C8E9FB",
                        200: "#A8DCFA",
                        300: "#83CDF7",
                        400: "#57BBF5",
                        500: "#1DA1F2",
                        600: "#1A94DA",
                        700: "#1681BF",
                        800: "#136B9E",
                        900: "#0D4D71"
                    },
                    telegram: {
                        50: "#E3F2F9",
                        100: "#C5E4F3",
                        200: "#A2D4EC",
                        300: "#7AC1E4",
                        400: "#47A9DA",
                        500: "#0088CC",
                        600: "#007AB8",
                        700: "#006BA1",
                        800: "#005885",
                        900: "#003F5E"
                    }
                }
            }, typography, {
                sizes: sizes,
                shadows: {
                    xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
                    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
                    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
                    none: "none",
                    "dark-lg": "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
                },
                space: spacing,
                borders: {
                    none: 0,
                    "1px": "1px solid",
                    "2px": "2px solid",
                    "4px": "4px solid",
                    "8px": "8px solid"
                },
                transition: {
                    property: {
                        common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
                        colors: "background-color, border-color, color, fill, stroke",
                        dimensions: "width, height",
                        position: "left, right, top, bottom",
                        background: "background-color, background-image, background-position"
                    },
                    easing: {
                        "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
                        "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
                        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
                    },
                    duration: {
                        "ultra-fast": "50ms",
                        faster: "100ms",
                        fast: "150ms",
                        normal: "200ms",
                        slow: "300ms",
                        slower: "400ms",
                        "ultra-slow": "500ms"
                    }
                }
            }), theme = sizes_501602a9_esm_extends({
                semanticTokens: {
                    colors: {
                        "chakra-body-text": {
                            _light: "gray.800",
                            _dark: "whiteAlpha.900"
                        },
                        "chakra-body-bg": {
                            _light: "white",
                            _dark: "gray.800"
                        },
                        "chakra-border-color": {
                            _light: "gray.200",
                            _dark: "whiteAlpha.300"
                        },
                        "chakra-placeholder-color": {
                            _light: "gray.500",
                            _dark: "whiteAlpha.400"
                        }
                    }
                },
                direction: "ltr"
            }, foundations, {
                components: {
                    Accordion: Accordion,
                    Alert: Alert,
                    Avatar: Avatar,
                    Badge: Badge,
                    Breadcrumb: Breadcrumb,
                    Button: {
                        baseStyle: {
                            lineHeight: "1.2",
                            borderRadius: "md",
                            fontWeight: "semibold",
                            transitionProperty: "common",
                            transitionDuration: "normal",
                            _focusVisible: {
                                boxShadow: "outline"
                            },
                            _disabled: {
                                opacity: 0.4,
                                cursor: "not-allowed",
                                boxShadow: "none"
                            },
                            _hover: {
                                _disabled: {
                                    bg: "initial"
                                }
                            }
                        },
                        variants: {
                            ghost: variantGhost,
                            outline: function(props) {
                                var c = props.colorScheme, borderColor = mode("gray.200", "whiteAlpha.300")(props);
                                return sizes_501602a9_esm_extends({
                                    border: "1px solid",
                                    borderColor: "gray" === c ? borderColor : "currentColor",
                                    ".chakra-button__group[data-attached] > &:not(:last-of-type)": {
                                        marginEnd: "-1px"
                                    }
                                }, variantGhost(props));
                            },
                            solid: function(props) {
                                var _accessibleColorMap$c, c = props.colorScheme;
                                if ("gray" === c) {
                                    var _bg = mode("gray.100", "whiteAlpha.200")(props);
                                    return {
                                        bg: _bg,
                                        _hover: {
                                            bg: mode("gray.200", "whiteAlpha.300")(props),
                                            _disabled: {
                                                bg: _bg
                                            }
                                        },
                                        _active: {
                                            bg: mode("gray.300", "whiteAlpha.400")(props)
                                        }
                                    };
                                }
                                var _ref = null != (_accessibleColorMap$c = accessibleColorMap[c]) ? _accessibleColorMap$c : {}, _ref$bg = _ref.bg, _ref$color = _ref.color, _ref$hoverBg = _ref.hoverBg, _ref$activeBg = _ref.activeBg, background = mode(void 0 === _ref$bg ? c + ".500" : _ref$bg, c + ".200")(props);
                                return {
                                    bg: background,
                                    color: mode(void 0 === _ref$color ? "white" : _ref$color, "gray.800")(props),
                                    _hover: {
                                        bg: mode(void 0 === _ref$hoverBg ? c + ".600" : _ref$hoverBg, c + ".300")(props),
                                        _disabled: {
                                            bg: background
                                        }
                                    },
                                    _active: {
                                        bg: mode(void 0 === _ref$activeBg ? c + ".700" : _ref$activeBg, c + ".400")(props)
                                    }
                                };
                            },
                            link: function(props) {
                                var c = props.colorScheme;
                                return {
                                    padding: 0,
                                    height: "auto",
                                    lineHeight: "normal",
                                    verticalAlign: "baseline",
                                    color: mode(c + ".500", c + ".200")(props),
                                    _hover: {
                                        textDecoration: "underline",
                                        _disabled: {
                                            textDecoration: "none"
                                        }
                                    },
                                    _active: {
                                        color: mode(c + ".700", c + ".500")(props)
                                    }
                                };
                            },
                            unstyled: {
                                bg: "none",
                                color: "inherit",
                                display: "inline",
                                lineHeight: "inherit",
                                m: 0,
                                p: 0
                            }
                        },
                        sizes: {
                            lg: {
                                h: 12,
                                minW: 12,
                                fontSize: "lg",
                                px: 6
                            },
                            md: {
                                h: 10,
                                minW: 10,
                                fontSize: "md",
                                px: 4
                            },
                            sm: {
                                h: 8,
                                minW: 8,
                                fontSize: "sm",
                                px: 3
                            },
                            xs: {
                                h: 6,
                                minW: 6,
                                fontSize: "xs",
                                px: 2
                            }
                        },
                        defaultProps: {
                            variant: "solid",
                            size: "md",
                            colorScheme: "gray"
                        }
                    },
                    Checkbox: Checkbox,
                    CloseButton: {
                        baseStyle: function(props) {
                            var hoverBg = mode("blackAlpha.100", "whiteAlpha.100")(props), activeBg = mode("blackAlpha.200", "whiteAlpha.200")(props);
                            return {
                                w: [
                                    $size$1.reference
                                ],
                                h: [
                                    $size$1.reference
                                ],
                                borderRadius: "md",
                                transitionProperty: "common",
                                transitionDuration: "normal",
                                _disabled: {
                                    opacity: 0.4,
                                    cursor: "not-allowed",
                                    boxShadow: "none"
                                },
                                _hover: {
                                    bg: hoverBg
                                },
                                _active: {
                                    bg: activeBg
                                },
                                _focusVisible: {
                                    boxShadow: "outline"
                                }
                            };
                        },
                        sizes: sizes$h,
                        defaultProps: {
                            size: "md"
                        }
                    },
                    Code: {
                        baseStyle: {
                            fontFamily: "mono",
                            fontSize: "sm",
                            px: "0.2em",
                            borderRadius: "sm"
                        },
                        variants: variants$8,
                        defaultProps: defaultProps$h
                    },
                    Container: {
                        baseStyle: {
                            w: "100%",
                            mx: "auto",
                            maxW: "60ch",
                            px: "1rem"
                        }
                    },
                    Divider: {
                        baseStyle: {
                            opacity: 0.6,
                            borderColor: "inherit"
                        },
                        variants: {
                            solid: {
                                borderStyle: "solid"
                            },
                            dashed: {
                                borderStyle: "dashed"
                            }
                        },
                        defaultProps: {
                            variant: "solid"
                        }
                    },
                    Drawer: Drawer,
                    Editable: Editable,
                    Form: Form,
                    FormError: FormError,
                    FormLabel: {
                        baseStyle: {
                            fontSize: "md",
                            marginEnd: 3,
                            mb: 2,
                            fontWeight: "medium",
                            transitionProperty: "common",
                            transitionDuration: "normal",
                            opacity: 1,
                            _disabled: {
                                opacity: 0.4
                            }
                        }
                    },
                    Heading: {
                        baseStyle: {
                            fontFamily: "heading",
                            fontWeight: "bold"
                        },
                        sizes: {
                            "4xl": {
                                fontSize: [
                                    "6xl",
                                    null,
                                    "7xl"
                                ],
                                lineHeight: 1
                            },
                            "3xl": {
                                fontSize: [
                                    "5xl",
                                    null,
                                    "6xl"
                                ],
                                lineHeight: 1
                            },
                            "2xl": {
                                fontSize: [
                                    "4xl",
                                    null,
                                    "5xl"
                                ],
                                lineHeight: [
                                    1.2,
                                    null,
                                    1
                                ]
                            },
                            xl: {
                                fontSize: [
                                    "3xl",
                                    null,
                                    "4xl"
                                ],
                                lineHeight: [
                                    1.33,
                                    null,
                                    1.2
                                ]
                            },
                            lg: {
                                fontSize: [
                                    "2xl",
                                    null,
                                    "3xl"
                                ],
                                lineHeight: [
                                    1.33,
                                    null,
                                    1.2
                                ]
                            },
                            md: {
                                fontSize: "xl",
                                lineHeight: 1.2
                            },
                            sm: {
                                fontSize: "md",
                                lineHeight: 1.2
                            },
                            xs: {
                                fontSize: "sm",
                                lineHeight: 1.2
                            }
                        },
                        defaultProps: {
                            size: "xl"
                        }
                    },
                    Input: Input,
                    Kbd: {
                        baseStyle: function(props) {
                            return {
                                bg: mode("gray.100", "whiteAlpha")(props),
                                borderRadius: "md",
                                borderWidth: "1px",
                                borderBottomWidth: "3px",
                                fontSize: "0.8em",
                                fontWeight: "bold",
                                lineHeight: "normal",
                                px: "0.4em",
                                whiteSpace: "nowrap"
                            };
                        }
                    },
                    Link: {
                        baseStyle: {
                            transitionProperty: "common",
                            transitionDuration: "fast",
                            transitionTimingFunction: "ease-out",
                            cursor: "pointer",
                            textDecoration: "none",
                            outline: "none",
                            color: "inherit",
                            _hover: {
                                textDecoration: "underline"
                            },
                            _focusVisible: {
                                boxShadow: "outline"
                            }
                        }
                    },
                    List: List,
                    Menu: Menu,
                    Modal: Modal,
                    NumberInput: NumberInput,
                    PinInput: {
                        baseStyle: baseStyle$f,
                        sizes: {
                            lg: {
                                fontSize: "lg",
                                w: 12,
                                h: 12,
                                borderRadius: "md"
                            },
                            md: {
                                fontSize: "md",
                                w: 10,
                                h: 10,
                                borderRadius: "md"
                            },
                            sm: {
                                fontSize: "sm",
                                w: 8,
                                h: 8,
                                borderRadius: "sm"
                            },
                            xs: {
                                fontSize: "xs",
                                w: 6,
                                h: 6,
                                borderRadius: "sm"
                            }
                        },
                        variants: variants$4,
                        defaultProps: defaultProps$a
                    },
                    Popover: Popover,
                    Progress: Progress,
                    Radio: Radio,
                    Select: Select,
                    Skeleton: {
                        baseStyle: function(props) {
                            var defaultStartColor = mode("gray.100", "gray.800")(props), defaultEndColor = mode("gray.400", "gray.600")(props), _props$startColor = props.startColor, _props$endColor = props.endColor, speed = props.speed, theme = props.theme, start = getColor(theme, void 0 === _props$startColor ? defaultStartColor : _props$startColor), end = getColor(theme, void 0 === _props$endColor ? defaultEndColor : _props$endColor);
                            return {
                                opacity: 0.7,
                                borderRadius: "2px",
                                borderColor: start,
                                background: end,
                                animation: speed + "s linear infinite alternate " + (0, emotion_react_browser_esm /* keyframes */ .F4)({
                                    from: {
                                        borderColor: start,
                                        background: start
                                    },
                                    to: {
                                        borderColor: end,
                                        background: end
                                    }
                                })
                            };
                        }
                    },
                    SkipLink: {
                        baseStyle: function(props) {
                            return {
                                borderRadius: "md",
                                fontWeight: "semibold",
                                _focusVisible: {
                                    boxShadow: "outline",
                                    padding: "1rem",
                                    position: "fixed",
                                    top: "1.5rem",
                                    insetStart: "1.5rem",
                                    bg: mode("white", "gray.700")(props)
                                }
                            };
                        }
                    },
                    Slider: Slider,
                    Spinner: {
                        baseStyle: baseStyle$7,
                        sizes: sizes$6,
                        defaultProps: {
                            size: "md"
                        }
                    },
                    Stat: Stat,
                    Switch: Switch,
                    Table: Table,
                    Tabs: Tabs,
                    Tag: Tag,
                    Textarea: {
                        baseStyle: baseStyle$1,
                        sizes: chakra_ui_theme_components_esm_sizes,
                        variants: variants,
                        defaultProps: {
                            size: "md",
                            variant: "outline"
                        }
                    },
                    Tooltip: {
                        baseStyle: function(props) {
                            var _ref, bg = mode("gray.700", "gray.300")(props);
                            return (_ref = {})[$bg.variable] = "colors." + bg, _ref.px = "8px", _ref.py = "2px", _ref.bg = [
                                $bg.reference
                            ], _ref[$arrowBg.variable] = [
                                $bg.reference
                            ], _ref.color = mode("whiteAlpha.900", "gray.900")(props), _ref.borderRadius = "sm", _ref.fontWeight = "medium", _ref.fontSize = "sm", _ref.boxShadow = "md", _ref.maxW = "320px", _ref.zIndex = "tooltip", _ref;
                        }
                    }
                },
                styles: {
                    global: {
                        body: {
                            fontFamily: "body",
                            color: "chakra-body-text",
                            bg: "chakra-body-bg",
                            transitionProperty: "background-color",
                            transitionDuration: "normal",
                            lineHeight: "base"
                        },
                        "*::placeholder": {
                            color: "chakra-placeholder-color"
                        },
                        "*, *::before, &::after": {
                            borderColor: "chakra-border-color",
                            wordWrap: "break-word"
                        }
                    }
                },
                config: {
                    useSystemColorMode: !1,
                    initialColorMode: "light",
                    cssVarPrefix: "chakra"
                }
            }), chakra_ui_visually_hidden_esm = __webpack_require__(1358);
            function chakra_ui_spinner_esm_extends() {
                return (chakra_ui_spinner_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            var chakra_ui_spinner_esm_excluded = [
                "label",
                "thickness",
                "speed",
                "emptyColor",
                "className"
            ], spin = (0, emotion_react_browser_esm /* keyframes */ .F4)({
                "0%": {
                    transform: "rotate(0deg)"
                },
                "100%": {
                    transform: "rotate(360deg)"
                }
            }), chakra_ui_spinner_esm_Spinner = /*#__PURE__*/ (0, chakra_ui_system_esm /* forwardRef */ .Gp)(function(props, ref) {
                var styles = (0, chakra_ui_system_esm /* useStyleConfig */ .mq)("Spinner", props), _omitThemingProps = (0, chakra_ui_system_esm /* omitThemingProps */ .Lr)(props), _omitThemingProps$lab = _omitThemingProps.label, label = void 0 === _omitThemingProps$lab ? "Loading..." : _omitThemingProps$lab, _omitThemingProps$thi = _omitThemingProps.thickness, _omitThemingProps$spe = _omitThemingProps.speed, _omitThemingProps$emp = _omitThemingProps.emptyColor, emptyColor = void 0 === _omitThemingProps$emp ? "transparent" : _omitThemingProps$emp, className = _omitThemingProps.className, rest = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = {}, sourceKeys = Object.keys(source);
                    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                    return target;
                }(_omitThemingProps, chakra_ui_spinner_esm_excluded), _className = (0, chakra_ui_utils_esm.cx)("chakra-spinner", className), spinnerStyles = chakra_ui_spinner_esm_extends({
                    display: "inline-block",
                    borderColor: "currentColor",
                    borderStyle: "solid",
                    borderRadius: "99999px",
                    borderWidth: void 0 === _omitThemingProps$thi ? "2px" : _omitThemingProps$thi,
                    borderBottomColor: emptyColor,
                    borderLeftColor: emptyColor,
                    animation: spin + " " + (void 0 === _omitThemingProps$spe ? "0.45s" : _omitThemingProps$spe) + " linear infinite"
                }, styles);
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, chakra_ui_spinner_esm_extends({
                    ref: ref,
                    __css: spinnerStyles,
                    className: _className
                }, rest), label && /*#__PURE__*/ react.createElement(chakra_ui_visually_hidden_esm /* VisuallyHidden */ .TX, null, label));
            });
            chakra_ui_utils_esm /* __DEV__ */ .Ts && (chakra_ui_spinner_esm_Spinner.displayName = "Spinner");
            // EXTERNAL MODULE: ./node_modules/@chakra-ui/icon/dist/chakra-ui-icon.esm.js
            var chakra_ui_icon_esm = __webpack_require__(894); // CONCATENATED MODULE: ./node_modules/@chakra-ui/alert/dist/chakra-ui-alert.esm.js
            function chakra_ui_alert_esm_extends() {
                return (chakra_ui_alert_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            var WarningIcon = function(props) {
                return /*#__PURE__*/ react.createElement(chakra_ui_icon_esm /* Icon */ .JO, chakra_ui_alert_esm_extends({
                    viewBox: "0 0 24 24"
                }, props), /*#__PURE__*/ react.createElement("path", {
                    fill: "currentColor",
                    d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                }));
            }, chakra_ui_alert_esm_excluded = [
                "status"
            ], _createStylesContext = (0, chakra_ui_system_esm /* createStylesContext */ .eC)("Alert"), StylesProvider = _createStylesContext[0], useStyles = _createStylesContext[1], STATUSES = {
                info: {
                    icon: function(props) {
                        return /*#__PURE__*/ react.createElement(chakra_ui_icon_esm /* Icon */ .JO, chakra_ui_alert_esm_extends({
                            viewBox: "0 0 24 24"
                        }, props), /*#__PURE__*/ react.createElement("path", {
                            fill: "currentColor",
                            d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
                        }));
                    },
                    colorScheme: "blue"
                },
                warning: {
                    icon: WarningIcon,
                    colorScheme: "orange"
                },
                success: {
                    icon: function(props) {
                        return /*#__PURE__*/ react.createElement(chakra_ui_icon_esm /* Icon */ .JO, chakra_ui_alert_esm_extends({
                            viewBox: "0 0 24 24"
                        }, props), /*#__PURE__*/ react.createElement("path", {
                            fill: "currentColor",
                            d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                        }));
                    },
                    colorScheme: "green"
                },
                error: {
                    icon: WarningIcon,
                    colorScheme: "red"
                },
                loading: {
                    icon: chakra_ui_spinner_esm_Spinner,
                    colorScheme: "blue"
                }
            }, chakra_ui_alert_esm_createContext = (0, chakra_ui_react_utils_esm /* createContext */ .kr)({
                name: "AlertContext",
                errorMessage: "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`"
            }), AlertProvider = chakra_ui_alert_esm_createContext[0], useAlertContext = chakra_ui_alert_esm_createContext[1], chakra_ui_alert_esm_Alert = /*#__PURE__*/ (0, chakra_ui_system_esm /* forwardRef */ .Gp)(function(props, ref) {
                var _props$colorScheme, _omitThemingProps = (0, chakra_ui_system_esm /* omitThemingProps */ .Lr)(props), _omitThemingProps$sta = _omitThemingProps.status, status = void 0 === _omitThemingProps$sta ? "info" : _omitThemingProps$sta, rest = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = {}, sourceKeys = Object.keys(source);
                    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                    return target;
                }(_omitThemingProps, chakra_ui_alert_esm_excluded), colorScheme = null != (_props$colorScheme = props.colorScheme) ? _props$colorScheme : STATUSES[status].colorScheme, styles = (0, chakra_ui_system_esm /* useMultiStyleConfig */ .jC)("Alert", chakra_ui_alert_esm_extends({}, props, {
                    colorScheme: colorScheme
                })), alertStyles = chakra_ui_alert_esm_extends({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }, styles.container);
                return /*#__PURE__*/ react.createElement(AlertProvider, {
                    value: {
                        status: status
                    }
                }, /*#__PURE__*/ react.createElement(StylesProvider, {
                    value: styles
                }, /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, chakra_ui_alert_esm_extends({
                    role: "alert",
                    ref: ref
                }, rest, {
                    className: (0, chakra_ui_utils_esm.cx)("chakra-alert", props.className),
                    __css: alertStyles
                }))));
            }), AlertTitle = /*#__PURE__*/ (0, chakra_ui_system_esm /* forwardRef */ .Gp)(function(props, ref) {
                var styles = useStyles();
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, chakra_ui_alert_esm_extends({
                    ref: ref
                }, props, {
                    className: (0, chakra_ui_utils_esm.cx)("chakra-alert__title", props.className),
                    __css: styles.title
                }));
            }), AlertDescription = /*#__PURE__*/ (0, chakra_ui_system_esm /* forwardRef */ .Gp)(function(props, ref) {
                var styles = useStyles(), descriptionStyles = chakra_ui_alert_esm_extends({
                    display: "inline"
                }, styles.description);
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, chakra_ui_alert_esm_extends({
                    ref: ref
                }, props, {
                    className: (0, chakra_ui_utils_esm.cx)("chakra-alert__desc", props.className),
                    __css: descriptionStyles
                }));
            }), AlertIcon = function(props) {
                var status = useAlertContext().status, BaseIcon = STATUSES[status].icon, styles = useStyles(), css = "loading" === status ? styles.spinner : styles.icon;
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.span */ .m$.span, chakra_ui_alert_esm_extends({
                    display: "inherit"
                }, props, {
                    className: (0, chakra_ui_utils_esm.cx)("chakra-alert__icon", props.className),
                    __css: css
                }), props.children || /*#__PURE__*/ react.createElement(BaseIcon, {
                    h: "100%",
                    w: "100%"
                }));
            };
            function chakra_ui_close_button_esm_extends() {
                return (chakra_ui_close_button_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            var chakra_ui_close_button_esm_excluded = [
                "children",
                "isDisabled",
                "__css"
            ], CloseIcon = function(props) {
                return /*#__PURE__*/ react.createElement(chakra_ui_icon_esm /* Icon */ .JO, chakra_ui_close_button_esm_extends({
                    focusable: "false",
                    "aria-hidden": !0
                }, props), /*#__PURE__*/ react.createElement("path", {
                    fill: "currentColor",
                    d: "M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                }));
            }, chakra_ui_close_button_esm_CloseButton = /*#__PURE__*/ (0, chakra_ui_system_esm /* forwardRef */ .Gp)(function(props, ref) {
                var styles = (0, chakra_ui_system_esm /* useStyleConfig */ .mq)("CloseButton", props), _omitThemingProps = (0, chakra_ui_system_esm /* omitThemingProps */ .Lr)(props), children = _omitThemingProps.children, isDisabled = _omitThemingProps.isDisabled, __css = _omitThemingProps.__css, rest = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = {}, sourceKeys = Object.keys(source);
                    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                    return target;
                }(_omitThemingProps, chakra_ui_close_button_esm_excluded);
                return /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.button */ .m$.button, chakra_ui_close_button_esm_extends({
                    type: "button",
                    "aria-label": "Close",
                    ref: ref,
                    disabled: isDisabled,
                    __css: chakra_ui_close_button_esm_extends({}, {
                        outline: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                    }, styles, __css)
                }, rest), children || /*#__PURE__*/ react.createElement(CloseIcon, {
                    width: "1em",
                    height: "1em"
                }));
            });
            chakra_ui_utils_esm /* __DEV__ */ .Ts && (chakra_ui_close_button_esm_CloseButton.displayName = "CloseButton");
            // EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
            var use_presence = __webpack_require__(5947), motion = __webpack_require__(8970), AnimatePresence = __webpack_require__(1190);
            function chakra_ui_toast_esm_extends() {
                return (chakra_ui_toast_esm_extends = Object.assign ? Object.assign.bind() : function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            /**
             * Given an array of toasts for a specific position.
             * It returns the toast that matches the `id` passed
             */ /**
             * Given the toast manager state, finds the toast that matches
             * the id and return its position and index
             */ function findToast(toasts, id) {
                var position = getToastPosition(toasts, id), index = position ? toasts[position].findIndex(function(toast) {
                    return toast.id === id;
                }) : -1;
                return {
                    position: position,
                    index: index
                };
            }
            /**
             * Given the toast manager state, finds the position of the toast that
             * matches the `id`
             */ var getToastPosition = function(toasts, id) {
                var _Object$values$flat$f;
                return null == (_Object$values$flat$f = Object.values(toasts).flat().find(function(toast) {
                    return toast.id === id;
                })) ? void 0 : _Object$values$flat$f.position;
            }, toastStore = (state = initialState = {
                top: [],
                "top-left": [],
                "top-right": [],
                "bottom-left": [],
                bottom: [],
                "bottom-right": []
            }, listeners = new Set(), setState = function(setStateFn) {
                state = setStateFn(state), listeners.forEach(function(l) {
                    return l();
                });
            }, {
                getState: function() {
                    return state;
                },
                subscribe: function(listener) {
                    return listeners.add(listener), function() {
                        // Delete all toasts on unmount
                        setState(function() {
                            return initialState;
                        }), listeners.delete(listener);
                    };
                },
                /**
                     * Delete a toast record at its position
                     */ removeToast: function(id, position) {
                    setState(function(prevState) {
                        var _extends2;
                        return chakra_ui_toast_esm_extends({}, prevState, ((_extends2 = {})[position] = prevState[position].filter(function(toast) {
                            return toast.id != id;
                        }), _extends2));
                    });
                },
                notify: function(message, options) {
                    var options1, _options$id, _options$position, id, position, toast = (void 0 === (options1 = options) && (options1 = {}), counter += 1, {
                        id: id = null != (_options$id = options1.id) ? _options$id : counter,
                        message: message,
                        position: position = null != (_options$position = options1.position) ? _options$position : "bottom",
                        duration: options1.duration,
                        onCloseComplete: options1.onCloseComplete,
                        onRequestRemove: function() {
                            return toastStore.removeToast(String(id), position);
                        },
                        status: options1.status,
                        requestClose: !1,
                        containerStyle: options1.containerStyle
                    }), position1 = toast.position, id1 = toast.id;
                    return setState(function(prevToasts) {
                        /**
                             * - If the toast is positioned at the top edges, the
                             * recent toast stacks on top of the other toasts.
                             *
                             * - If the toast is positioned at the bottom edges, the recent
                             * toast stacks below the other toasts.
                             */ var _prevToasts$position, _prevToasts$position2, _extends3, toasts = position1.includes("top") ? [
                            toast
                        ].concat(null != (_prevToasts$position = prevToasts[position1]) ? _prevToasts$position : []) : [].concat(null != (_prevToasts$position2 = prevToasts[position1]) ? _prevToasts$position2 : [], [
                            toast
                        ]);
                        return chakra_ui_toast_esm_extends({}, prevToasts, ((_extends3 = {})[position1] = toasts, _extends3));
                    }), id1;
                },
                update: function(id, options) {
                    id && setState(function(prevState) {
                        var options1, _options, render, _options$toastCompone, ToastComponent, nextState = chakra_ui_toast_esm_extends({}, prevState), _findToast = findToast(nextState, id), position = _findToast.position, index = _findToast.index;
                        return position && -1 !== index && (nextState[position][index] = chakra_ui_toast_esm_extends({}, nextState[position][index], options, {
                            message: (void 0 === (options1 = options) && (options1 = {}), render = (_options = options1).render, ToastComponent = void 0 === (_options$toastCompone = _options.toastComponent) ? Toast : _options$toastCompone, function(props) {
                                return (0, chakra_ui_utils_esm /* isFunction */ .mf)(render) ? render(props) : /*#__PURE__*/ react.createElement(ToastComponent, chakra_ui_toast_esm_extends({}, props, options1));
                            })
                        })), nextState;
                    });
                },
                closeAll: function(_temp) {
                    var positions = (void 0 === _temp ? {} : _temp).positions;
                    // only one setState here for perf reasons
                    // instead of spamming this.closeToast
                    setState(function(prev) {
                        return (null != positions ? positions : [
                            "bottom",
                            "bottom-right",
                            "bottom-left",
                            "top",
                            "top-left",
                            "top-right"
                        ]).reduce(function(acc, position) {
                            return acc[position] = prev[position].map(function(toast) {
                                return chakra_ui_toast_esm_extends({}, toast, {
                                    requestClose: !0
                                });
                            }), acc;
                        }, chakra_ui_toast_esm_extends({}, prev));
                    });
                },
                close: function(id) {
                    setState(function(prevState) {
                        var _extends4, position = getToastPosition(prevState, id);
                        return position ? chakra_ui_toast_esm_extends({}, prevState, ((_extends4 = {})[position] = prevState[position].map(function(toast) {
                            return(// id may be string or number
                            // eslint-disable-next-line eqeqeq
                            toast.id == id ? chakra_ui_toast_esm_extends({}, toast, {
                                requestClose: !0
                            }) : toast);
                        }), _extends4)) : prevState;
                    });
                },
                isActive: function(id) {
                    return !!findToast(toastStore.getState(), id).position;
                }
            }), counter = 0, Toast = function(props) {
                var status = props.status, _props$variant = props.variant, id = props.id, title = props.title, isClosable = props.isClosable, onClose = props.onClose, description = props.description, icon = props.icon, alertTitleId = void 0 !== id ? "toast-" + id + "-title" : void 0;
                return /*#__PURE__*/ react.createElement(chakra_ui_alert_esm_Alert, {
                    status: status,
                    variant: void 0 === _props$variant ? "solid" : _props$variant,
                    id: String(id),
                    alignItems: "start",
                    borderRadius: "md",
                    boxShadow: "lg",
                    paddingEnd: 8,
                    textAlign: "start",
                    width: "auto",
                    "aria-labelledby": alertTitleId
                }, /*#__PURE__*/ react.createElement(AlertIcon, null, icon), /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, {
                    flex: "1",
                    maxWidth: "100%"
                }, title && /*#__PURE__*/ react.createElement(AlertTitle, {
                    id: alertTitleId
                }, title), description && /*#__PURE__*/ react.createElement(AlertDescription, {
                    display: "block"
                }, description)), isClosable && /*#__PURE__*/ react.createElement(chakra_ui_close_button_esm_CloseButton, {
                    size: "sm",
                    onClick: onClose,
                    position: "absolute",
                    insetEnd: 1,
                    top: 1
                }));
            }, toastMotionVariants = {
                initial: function(props) {
                    var _ref, position = props.position, dir = [
                        "top",
                        "bottom"
                    ].includes(position) ? "y" : "x", factor = [
                        "top-right",
                        "bottom-right"
                    ].includes(position) ? 1 : -1;
                    return "bottom" === position && (factor = 1), (_ref = {
                        opacity: 0
                    })[dir] = 24 * factor, _ref;
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    transition: {
                        duration: 0.4,
                        ease: [
                            0.4,
                            0,
                            0.2,
                            1
                        ]
                    }
                },
                exit: {
                    opacity: 0,
                    scale: 0.85,
                    transition: {
                        duration: 0.2,
                        ease: [
                            0.4,
                            0,
                            1,
                            1
                        ]
                    }
                }
            }, ToastComponent = /*#__PURE__*/ react.memo(function(props) {
                var id = props.id, message = props.message, onCloseComplete = props.onCloseComplete, onRequestRemove = props.onRequestRemove, _props$requestClose = props.requestClose, requestClose = void 0 !== _props$requestClose && _props$requestClose, _props$position = props.position, position = void 0 === _props$position ? "bottom" : _props$position, _props$duration = props.duration, duration = void 0 === _props$duration ? 5000 : _props$duration, containerStyle = props.containerStyle, _props$motionVariants = props.motionVariants, _props$toastSpacing = props.toastSpacing, toastSpacing = void 0 === _props$toastSpacing ? "0.5rem" : _props$toastSpacing, _React$useState = react.useState(duration), delay = _React$useState[0], setDelay = _React$useState[1], isPresent = (0, use_presence /* useIsPresent */ .hO)();
                (0, chakra_ui_hooks_esm /* useUpdateEffect */ .rf)(function() {
                    isPresent || null == onCloseComplete || onCloseComplete();
                }, [
                    isPresent
                ]), (0, chakra_ui_hooks_esm /* useUpdateEffect */ .rf)(function() {
                    setDelay(duration);
                }, [
                    duration
                ]);
                var close = function() {
                    isPresent && onRequestRemove();
                };
                react.useEffect(function() {
                    isPresent && requestClose && onRequestRemove();
                }, [
                    isPresent,
                    requestClose,
                    onRequestRemove
                ]), (0, chakra_ui_hooks_esm /* useTimeout */ .KS)(close, delay);
                var containerStyles = react.useMemo(function() {
                    return chakra_ui_toast_esm_extends({
                        pointerEvents: "auto",
                        maxWidth: 560,
                        minWidth: 300,
                        margin: toastSpacing
                    }, containerStyle);
                }, [
                    containerStyle,
                    toastSpacing
                ]), toastStyle = react.useMemo(function() {
                    var isRighty, isLefty, alignItems;
                    return isRighty = position.includes("right"), isLefty = position.includes("left"), alignItems = "center", isRighty && (alignItems = "flex-end"), isLefty && (alignItems = "flex-start"), {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: alignItems
                    };
                }, [
                    position
                ]);
                return /*#__PURE__*/ react.createElement(motion /* motion.li */ .E.li, {
                    layout: !0,
                    className: "chakra-toast",
                    variants: void 0 === _props$motionVariants ? toastMotionVariants : _props$motionVariants,
                    initial: "initial",
                    animate: "animate",
                    exit: "exit",
                    onHoverStart: function() {
                        return setDelay(null);
                    },
                    onHoverEnd: function() {
                        return setDelay(duration);
                    },
                    custom: {
                        position: position
                    },
                    style: toastStyle
                }, /*#__PURE__*/ react.createElement(chakra_ui_system_esm /* chakra.div */ .m$.div, {
                    role: "status",
                    "aria-atomic": "true",
                    className: "chakra-toast__inner",
                    __css: containerStyles
                }, (0, chakra_ui_utils_esm /* runIfFn */ .Pu)(message, {
                    id: id,
                    onClose: close
                })));
            });
            chakra_ui_utils_esm /* __DEV__ */ .Ts && (ToastComponent.displayName = "ToastComponent");
            /**
             * Manages the creation, and removal of toasts
             * across all corners ("top", "bottom", etc.)
             */ var ToastProvider = function(props) {
                var state = react.useSyncExternalStore(toastStore.subscribe, toastStore.getState, toastStore.getState), children = props.children, motionVariants = props.motionVariants, _props$component = props.component, Component = void 0 === _props$component ? ToastComponent : _props$component, portalProps = props.portalProps, toastList = (0, chakra_ui_utils_esm /* objectKeys */ .Yd)(state).map(function(position) {
                    var toasts = state[position];
                    return /*#__PURE__*/ react.createElement("ul", {
                        role: "region",
                        "aria-live": "polite",
                        key: position,
                        id: "chakra-toast-manager-" + position,
                        style: {
                            position: "fixed",
                            zIndex: 5500,
                            pointerEvents: "none",
                            display: "flex",
                            flexDirection: "column",
                            margin: "top" === position || "bottom" === position ? "0 auto" : void 0,
                            top: position.includes("top") ? "env(safe-area-inset-top, 0px)" : void 0,
                            bottom: position.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : void 0,
                            right: position.includes("left") ? void 0 : "env(safe-area-inset-right, 0px)",
                            left: position.includes("right") ? void 0 : "env(safe-area-inset-left, 0px)"
                        }
                    }, /*#__PURE__*/ react.createElement(AnimatePresence /* AnimatePresence */ .M, {
                        initial: !1
                    }, toasts.map(function(toast) {
                        return /*#__PURE__*/ react.createElement(Component, chakra_ui_toast_esm_extends({
                            key: toast.id,
                            motionVariants: motionVariants
                        }, toast));
                    })));
                });
                return /*#__PURE__*/ react.createElement(react.Fragment, null, children, /*#__PURE__*/ react.createElement(Portal, portalProps, toastList));
            };
            chakra_ui_utils_esm /* noop */ .ZT, chakra_ui_utils_esm /* noop */ .ZT;
            var chakra_ui_react_esm_excluded = [
                "children",
                "toastOptions"
            ], ChakraProvider = function(_ref) {
                var children = _ref.children, toastOptions = _ref.toastOptions, restProps = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = {}, sourceKeys = Object.keys(source);
                    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                    return target;
                }(_ref, chakra_ui_react_esm_excluded);
                return /*#__PURE__*/ react.createElement(chakra_ui_provider_esm_ChakraProvider, restProps, children, /*#__PURE__*/ react.createElement(ToastProvider, toastOptions));
            };
            ChakraProvider.defaultProps = {
                theme: theme
            };
            /* harmony default export */ var _app = function(param) {
                var Component = param.Component, pageProps = param.pageProps;
                return /*#__PURE__*/ (0, jsx_runtime.jsx)(ChakraProvider, {
                    children: /*#__PURE__*/ (0, jsx_runtime.jsx)(Component, function(target) {
                        for(var i = 1; i < arguments.length; i++){
                            var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
                            "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                            }))), ownKeys.forEach(function(key) {
                                var value;
                                value = source[key], key in target ? Object.defineProperty(target, key, {
                                    value: value,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : target[key] = value;
                            });
                        }
                        return target;
                    }({}, pageProps))
                });
            };
        /***/ }
    },
    /******/ function(__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        /******/ __webpack_require__.O(0, [
            774,
            179
        ], function() {
            return __webpack_exec__(3837), __webpack_exec__(387);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
