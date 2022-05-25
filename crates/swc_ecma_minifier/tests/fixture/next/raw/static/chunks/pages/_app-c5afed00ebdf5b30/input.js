(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [888],
    {
        /***/ 1597: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function () {
                    return __webpack_require__(4297);
                },
            ]);
            if (false) {
            }

            /***/
        },

        /***/ 4297: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _runtimeJs = _interopRequireDefault(__webpack_require__(4051));
            function _assertThisInitialized(self) {
                if (self === void 0) {
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                }
                return self;
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }
            function _getPrototypeOf(o1) {
                _getPrototypeOf = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function _getPrototypeOf(o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      };
                return _getPrototypeOf(o1);
            }
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
                if (superClass) _setPrototypeOf(subClass, superClass);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _possibleConstructorReturn(self, call) {
                if (
                    call &&
                    (_typeof(call) === "object" || typeof call === "function")
                ) {
                    return call;
                }
                return _assertThisInitialized(self);
            }
            function _setPrototypeOf(o2, p1) {
                _setPrototypeOf =
                    Object.setPrototypeOf ||
                    function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };
                return _setPrototypeOf(o2, p1);
            }
            var _typeof = function (obj) {
                "@swc/helpers - typeof";
                return obj &&
                    typeof Symbol !== "undefined" &&
                    obj.constructor === Symbol
                    ? "symbol"
                    : typeof obj;
            };
            function _isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(
                        Reflect.construct(Boolean, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }
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
            exports["default"] = void 0;
            var _react = _interopRequireDefault1(__webpack_require__(7294));
            var _utils = __webpack_require__(670);
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
            function _interopRequireDefault1(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function appGetInitialProps(_) {
                return _appGetInitialProps.apply(this, arguments);
            }
            function _appGetInitialProps() {
                _appGetInitialProps = /**
                 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
                 * This allows for keeping state between navigation, custom error handling, injecting additional data.
                 */ _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee(param) {
                        var Component, ctx, pageProps;
                        return _runtimeJs.default.wrap(function _callee$(_ctx) {
                            while (1)
                                switch ((_ctx.prev = _ctx.next)) {
                                    case 0:
                                        (Component = param.Component),
                                            (ctx = param.ctx);
                                        _ctx.next = 3;
                                        return (0, _utils).loadGetInitialProps(
                                            Component,
                                            ctx
                                        );
                                    case 3:
                                        pageProps = _ctx.sent;
                                        return _ctx.abrupt("return", {
                                            pageProps: pageProps,
                                        });
                                    case 5:
                                    case "end":
                                        return _ctx.stop();
                                }
                        }, _callee);
                    })
                );
                return _appGetInitialProps.apply(this, arguments);
            }
            var App = /*#__PURE__*/ (function (_Component) {
                _inherits(App, _Component);
                var _super = _createSuper(App);
                function App() {
                    _classCallCheck(this, App);
                    return _super.apply(this, arguments);
                }
                _createClass(App, [
                    {
                        key: "render",
                        value: function render() {
                            var _props = this.props,
                                Component = _props.Component,
                                pageProps = _props.pageProps;
                            return /*#__PURE__*/ _react.default.createElement(
                                Component,
                                Object.assign({}, pageProps)
                            );
                        },
                    },
                ]);
                return App;
            })(_react.default.Component);
            exports["default"] = App;
            App.origGetInitialProps = appGetInitialProps;
            App.getInitialProps = appGetInitialProps; //# sourceMappingURL=_app.js.map

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 179], function () {
            return __webpack_exec__(1597), __webpack_exec__(880);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
