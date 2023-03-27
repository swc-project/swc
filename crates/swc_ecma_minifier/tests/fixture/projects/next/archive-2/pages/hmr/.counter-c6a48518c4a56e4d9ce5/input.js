(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [370],
    {
        /***/ 2911: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function () {
                    return /* binding */ _assert_this_initialized;
                },
                /* harmony export */
            });
            function _assert_this_initialized(self) {
                if (self === void 0) {
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                }

                return self;
            }

            /***/
        },

        /***/ 8436: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function () {
                    return /* binding */ _class_call_check;
                },
                /* harmony export */
            });
            function _class_call_check(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            /***/
        },

        /***/ 8370: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function () {
                    return /* binding */ _create_class;
                },
                /* harmony export */
            });
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            function _create_class(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }

            /***/
        },

        /***/ 9178: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function () {
                    return /* binding */ _define_property;
                },
                /* harmony export */
            });
            function _define_property(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }

                return obj;
            }

            /***/
        },

        /***/ 2374: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Z: function () {
                    return /* binding */ _get_prototype_of;
                },
                /* harmony export */
            });
            function _get_prototype_of(o) {
                _get_prototype_of = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function _get_prototype_of(o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      };
                return _get_prototype_of(o);
            }

            /***/
        },

        /***/ 3001: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";

            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                Z: function () {
                    return /* binding */ _inherits;
                },
            }); // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js

            function _set_prototype_of(o, p) {
                _set_prototype_of =
                    Object.setPrototypeOf ||
                    function _set_prototype_of(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                return _set_prototype_of(o, p);
            } // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/inherits.js
            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError(
                        "Super expression must either be null or a function"
                    );
                }

                subClass.prototype = Object.create(
                    superClass && superClass.prototype,
                    {
                        constructor: {
                            value: subClass,
                            writable: true,
                            configurable: true,
                        },
                    }
                );
                if (superClass) _set_prototype_of(subClass, superClass);
            }

            /***/
        },

        /***/ 7130: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";

            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                Z: function () {
                    return /* binding */ _possible_constructor_return;
                },
            }); // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/typeof.js

            function _typeof(obj) {
                "@babel/helpers - typeof";

                if (
                    typeof Symbol === "function" &&
                    typeof Symbol.iterator === "symbol"
                ) {
                    _typeof = function _typeof(obj) {
                        return typeof obj;
                    };
                } else {
                    _typeof = function _typeof(obj) {
                        return obj &&
                            typeof Symbol === "function" &&
                            obj.constructor === Symbol &&
                            obj !== Symbol.prototype
                            ? "symbol"
                            : typeof obj;
                    };
                }

                return _typeof(obj);
            }
            // EXTERNAL MODULE: ../../../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
            var assertThisInitialized = __webpack_require__(2911); // CONCATENATED MODULE: ../../../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
            function _possible_constructor_return(self, call) {
                if (
                    call &&
                    (_typeof(call) === "object" || typeof call === "function")
                ) {
                    return call;
                }

                return (0, assertThisInitialized /* default */.Z)(self);
            }

            /***/
        },

        /***/ 5228: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ default: function () {
                    return /* binding */ Counter;
                },
                /* harmony export */
            });
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(4512);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_class_call_check__WEBPACK_IMPORTED_MODULE_5__ =
                __webpack_require__(8436);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_create_class__WEBPACK_IMPORTED_MODULE_8__ =
                __webpack_require__(8370);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assert_this_initialized__WEBPACK_IMPORTED_MODULE_7__ =
                __webpack_require__(2911);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ =
                __webpack_require__(3001);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possible_constructor_return__WEBPACK_IMPORTED_MODULE_2__ =
                __webpack_require__(7130);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_get_prototype_of__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(2374);
            /* harmony import */ var _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_define_property__WEBPACK_IMPORTED_MODULE_6__ =
                __webpack_require__(9178);
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ =
                __webpack_require__(2735);

            function _create_super(Derived) {
                var hasNativeReflectConstruct = _is_native_reflect_construct();
                return function _createSuperInternal() {
                    var Super = (0,
                        _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_get_prototype_of__WEBPACK_IMPORTED_MODULE_1__ /* .default */.Z)(
                            Derived
                        ),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = (0,
                        _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_get_prototype_of__WEBPACK_IMPORTED_MODULE_1__ /* .default */.Z)(
                            this
                        ).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return (0,
                    _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possible_constructor_return__WEBPACK_IMPORTED_MODULE_2__ /* .default */.Z)(
                        this,
                        result
                    );
                };
            }

            function _is_native_reflect_construct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }

            var Counter = /*#__PURE__*/ (function (_React$Component) {
                (0,
                _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ /* .default */.Z)(
                    Counter,
                    _React$Component
                );

                var _super = _create_super(Counter);

                function Counter() {
                    var _this;

                    (0,
                    _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_class_call_check__WEBPACK_IMPORTED_MODULE_5__ /* .default */.Z)(
                        this,
                        Counter
                    );

                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }

                    _this = _super.call.apply(_super, [this].concat(args));

                    (0,
                    _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_define_property__WEBPACK_IMPORTED_MODULE_6__ /* .default */.Z)(
                        (0,
                        _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assert_this_initialized__WEBPACK_IMPORTED_MODULE_7__ /* .default */.Z)(
                            _this
                        ),
                        "state",
                        {
                            count: 0,
                        }
                    );

                    return _this;
                }

                (0,
                _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_create_class__WEBPACK_IMPORTED_MODULE_8__ /* .default */.Z)(
                    Counter,
                    [
                        {
                            key: "incr",
                            value: function incr() {
                                var count = this.state.count;
                                this.setState({
                                    count: count + 1,
                                });
                            },
                        },
                        {
                            key: "render",
                            value: function render() {
                                var _this2 = this;

                                return /*#__PURE__*/ (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                    "div",
                                    {
                                        children: [
                                            /*#__PURE__*/ (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                                "p",
                                                {
                                                    children: [
                                                        "COUNT: ",
                                                        this.state.count,
                                                    ],
                                                }
                                            ),
                                            /*#__PURE__*/ (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                "button",
                                                {
                                                    onClick:
                                                        function onClick() {
                                                            return _this2.incr();
                                                        },
                                                    children: "Increment",
                                                }
                                            ),
                                        ],
                                    }
                                );
                            },
                        },
                    ]
                );

                return Counter;
            })(react__WEBPACK_IMPORTED_MODULE_3__.Component);

            /***/
        },

        /***/ 2421: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/hmr/counter",
                function () {
                    return __webpack_require__(5228);
                },
            ]);

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 888, 179], function () {
            return __webpack_exec__(2421);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
