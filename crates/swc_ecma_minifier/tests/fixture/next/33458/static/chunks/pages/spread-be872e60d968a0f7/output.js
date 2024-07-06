(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        217
    ],
    {
        /***/ 2809: /***/ function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/spread",
                function() {
                    return __webpack_require__(1767);
                }
            ]);
        /***/ },
        /***/ 2726: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return /* binding */ components_Form;
                }
            });
            // EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
            var jsx_runtime = __webpack_require__(5893), react = __webpack_require__(7294), components_Input = function(param) {
                var value = param.value, onChange = param.onChange;
                return /*#__PURE__*/ (0, jsx_runtime.jsx)("input", {
                    value: value,
                    onChange: onChange
                });
            }, components_Form = function(param) {
                var value = param.value, onChange = param.onChange;
                return (0, react.useEffect)(function() {
                    // If parent component spreads the props,
                    // will cause remount on every re-render
                    console.log("EFFECT");
                }, []), /*#__PURE__*/ (0, jsx_runtime.jsx)(components_Input, {
                    value: value,
                    onChange: onChange
                });
            };
        /***/ },
        /***/ 1767: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__), // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return /* binding */ PageWithSpread;
                }
            });
            // EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
            var jsx_runtime = __webpack_require__(5893), react = __webpack_require__(7294), Form = __webpack_require__(2726), components_Container = function(props) {
                return /*#__PURE__*/ (0, jsx_runtime.jsx)(Form /* default */ .Z, function(target) {
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
                }({}, props));
            };
            function PageWithSpread() {
                var ref = (0, react.useState)(""), text = ref[0], setText = ref[1], handleChange = (0, react.useCallback)(function(e) {
                    setText(e.target.value);
                }, []);
                return /*#__PURE__*/ (0, jsx_runtime.jsx)(components_Container, {
                    onChange: handleChange,
                    value: text
                });
            }
        /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 2809);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
