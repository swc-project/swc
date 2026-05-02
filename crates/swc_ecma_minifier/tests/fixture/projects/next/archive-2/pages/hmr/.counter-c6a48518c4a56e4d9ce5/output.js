(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        370
    ],
    {
        /***/ 2911: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _assertThisInitialized(self1) {
                if (void 0 === self1) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self1;
            }
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function() {
                    return /* binding */ _assertThisInitialized;
                }
            });
        /***/ },
        /***/ 8436: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function() {
                    return /* binding */ _classCallCheck;
                }
            });
        /***/ },
        /***/ 8370: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
            }
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function() {
                    return /* binding */ _createClass;
                }
            });
        /***/ },
        /***/ 9178: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _defineProperty(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function() {
                    return /* binding */ _defineProperty;
                }
            });
        /***/ },
        /***/ 2374: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _getPrototypeOf(o) {
                return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                })(o);
            }
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function() {
                    return /* binding */ _getPrototypeOf;
                }
            });
        /***/ },
        /***/ 3001: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _setPrototypeOf(o, p) {
                return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o, p);
            } // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/inherits.js
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf(subClass, superClass);
            }
            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return /* binding */ _inherits;
                }
            });
        /***/ },
        /***/ 7130: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _typeof(obj) {
                return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return /* binding */ _possibleConstructorReturn;
                }
            });
            // EXTERNAL MODULE: ../../../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
            var assertThisInitialized = __webpack_require__(2911); // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
            function _possibleConstructorReturn(self1, call) {
                return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (0, assertThisInitialized /* default */ .Z)(self1);
            }
        /***/ },
        /***/ 5228: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ default: function() {
                    return /* binding */ Counter;
                }
            });
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8436), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8370), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2911), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3001), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7130), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2374), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9178), Counter = /*#__PURE__*/ function(_React$Component) {
                (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ /* .default */ .Z)(Counter, _React$Component);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("u" < typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ /* .default */ .Z)(Counter);
                    return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ /* .default */ .Z)(this).constructor) : Super.apply(this, arguments), (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ /* .default */ .Z)(this, result);
                });
                function Counter() {
                    var _this;
                    (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ /* .default */ .Z)(this, Counter);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ /* .default */ .Z)((0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__ /* .default */ .Z)(_this), "state", {
                        count: 0
                    }), _this;
                }
                return (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_8__ /* .default */ .Z)(Counter, [
                    {
                        key: "incr",
                        value: function() {
                            var count = this.state.count;
                            this.setState({
                                count: count + 1
                            });
                        }
                    },
                    {
                        key: "render",
                        value: function() {
                            var _this2 = this;
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                        children: [
                                            "COUNT: ",
                                            this.state.count
                                        ]
                                    }),
                                    /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        onClick: function() {
                                            return _this2.incr();
                                        },
                                        children: "Increment"
                                    })
                                ]
                            });
                        }
                    }
                ]), Counter;
            }(__webpack_require__(2735).Component);
        /***/ },
        /***/ 2421: /***/ function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/counter",
                function() {
                    return __webpack_require__(5228);
                }
            ]);
        /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 2421);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
