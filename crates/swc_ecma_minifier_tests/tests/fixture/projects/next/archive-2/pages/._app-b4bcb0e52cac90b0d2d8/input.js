(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [888],
    {
        /***/ 7430: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            var _inherits = __webpack_require__(4546);

            var _possibleConstructorReturn = __webpack_require__(1581);

            var _getPrototypeOf = __webpack_require__(852);

            var _regeneratorRuntime = __webpack_require__(7945);

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
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

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            Object.defineProperty(exports, "AppInitialProps", {
                enumerable: true,
                get: function get() {
                    return _utils.AppInitialProps;
                },
            });
            Object.defineProperty(exports, "NextWebVitalsMetric", {
                enumerable: true,
                get: function get() {
                    return _utils.NextWebVitalsMetric;
                },
            });
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _utils = __webpack_require__(6373);

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
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
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);

                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }

                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }

                        _next(undefined);
                    });
                };
            }

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function _appGetInitialProps() {
                _appGetInitialProps =
                    /**
                     * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
                     * This allows for keeping state between navigation, custom error handling, injecting additional data.
                     */
                    _asyncToGenerator(
                        /*#__PURE__*/ _regeneratorRuntime.mark(function _callee(
                            _ref
                        ) {
                            var Component, ctx, pageProps;
                            return _regeneratorRuntime.wrap(function _callee$(
                                _context
                            ) {
                                while (1) {
                                    switch ((_context.prev = _context.next)) {
                                        case 0:
                                            (Component = _ref.Component),
                                                (ctx = _ref.ctx);
                                            _context.next = 3;
                                            return (0,
                                            _utils).loadGetInitialProps(
                                                Component,
                                                ctx
                                            );

                                        case 3:
                                            pageProps = _context.sent;
                                            return _context.abrupt("return", {
                                                pageProps: pageProps,
                                            });

                                        case 5:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            },
                            _callee);
                        })
                    );
                return _appGetInitialProps.apply(this, arguments);
            }

            function appGetInitialProps(_) {
                return _appGetInitialProps.apply(this, arguments);
            }

            var App = /*#__PURE__*/ (function (_react$default$Compon) {
                _inherits(App, _react$default$Compon);

                var _super = _createSuper(App);

                function App() {
                    _classCallCheck(this, App);

                    return _super.apply(this, arguments);
                }

                _createClass(App, [
                    {
                        key: "render",
                        value: function render() {
                            var _this$props = this.props,
                                Component = _this$props.Component,
                                pageProps = _this$props.pageProps;
                            return /*#__PURE__*/ _react[
                                "default"
                            ].createElement(
                                Component,
                                Object.assign({}, pageProps)
                            );
                        },
                    },
                ]);

                return App;
            })(_react["default"].Component);

            App.origGetInitialProps = appGetInitialProps;
            App.getInitialProps = appGetInitialProps;
            exports.default = App;

            /***/
        },

        /***/ 681: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function () {
                    return __webpack_require__(7430);
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
        /******/ __webpack_require__.O(0, [774, 179], function () {
            return __webpack_exec__(681), __webpack_exec__(6409);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
