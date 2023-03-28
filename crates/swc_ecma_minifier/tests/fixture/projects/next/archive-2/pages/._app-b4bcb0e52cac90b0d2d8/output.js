(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push(
    [
        [888,],
        {
            7430: function (
                __unused_webpack_module, exports, __webpack_require__
            ) {
                "use strict";
                var _classCallCheck = __webpack_require__(
                        4988
                    ),
                    _createClass = __webpack_require__(
                        9590
                    ),
                    _inherits = __webpack_require__(
                        4546
                    ),
                    _possibleConstructorReturn = __webpack_require__(
                        1581
                    ),
                    _getPrototypeOf = __webpack_require__(
                        852
                    ),
                    _regeneratorRuntime = __webpack_require__(
                        7945
                    );
                function _createSuper(
                    Derived
                ) {
                    var hasNativeReflectConstruct = (function (
                    ) {
                        if ("undefined" == typeof Reflect || !Reflect.construct)
                            return !1;
                        if (Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return (
                                Date.prototype.toString.call(
                                    Reflect.construct(
                                        Date,
                                        [],
                                        function (
                                        ) {}
                                    )
                                ),
                                !0
                            );
                        } catch (e) {
                            return !1;
                        }
                    })(
                    );
                    return function (
                    ) {
                        var result,
                            Super = _getPrototypeOf(
                                Derived
                            );
                        if (hasNativeReflectConstruct) {
                            var NewTarget = _getPrototypeOf(
                                this
                            ).constructor;
                            result = Reflect.construct(
                                Super,
                                arguments,
                                NewTarget
                            );
                        } else result = Super.apply(
                            this,
                            arguments
                        );
                        return _possibleConstructorReturn(
                            this,
                            result
                        );
                    };
                }
                Object.defineProperty(
                    exports,
                    "__esModule",
                    {
                        value: !0,
                    }
                ),
                Object.defineProperty(
                    exports,
                    "AppInitialProps",
                    {
                        enumerable: !0,
                        get: function (
                        ) {
                            return _utils.AppInitialProps;
                        },
                    }
                ),
                Object.defineProperty(
                    exports,
                    "NextWebVitalsMetric",
                    {
                        enumerable: !0,
                        get: function (
                        ) {
                            return _utils.NextWebVitalsMetric;
                        },
                    }
                ),
                (exports.default = void 0);
                var obj,
                    _react =
                    (obj = __webpack_require__(
                        2735
                    )) && obj.__esModule
                        ? obj
                        : {
                            default: obj,
                        },
                    _utils = __webpack_require__(
                        6373
                    );
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
                        var info = gen[key](
                                arg
                            ),
                            value = info.value;
                    } catch (error) {
                        return void reject(
                            error
                        );
                    }
                    info.done
                        ? resolve(
                            value
                        )
                        : Promise.resolve(
                            value
                        ).then(
                            _next,
                            _throw
                        );
                }
                function _asyncToGenerator(
                    fn
                ) {
                    return function (
                    ) {
                        var self = this,
                            args = arguments;
                        return new Promise(
                            function (
                                resolve, reject
                            ) {
                                var gen = fn.apply(
                                    self,
                                    args
                                );
                                function _next(
                                    value
                                ) {
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
                                function _throw(
                                    err
                                ) {
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
                                _next(
                                    void 0
                                );
                            }
                        );
                    };
                }
                function _appGetInitialProps(
                ) {
                    return (_appGetInitialProps = _asyncToGenerator(
                        _regeneratorRuntime.mark(
                            function _callee(
                                _ref
                            ) {
                                var Component, ctx, pageProps;
                                return _regeneratorRuntime.wrap(
                                    function (
                                        _context
                                    ) {
                                        for (;;)
                                            switch ((_context.prev = _context.next)) {
                                            case 0:
                                                return (
                                                    (Component = _ref.Component),
                                                    (ctx = _ref.ctx),
                                                    (_context.next = 3),
                                                    _utils.loadGetInitialProps(
                                                        Component,
                                                        ctx
                                                    )
                                                );
                                            case 3:
                                                return (
                                                    (pageProps = _context.sent),
                                                    _context.abrupt(
                                                        "return",
                                                        {
                                                            pageProps: pageProps,
                                                        }
                                                    )
                                                );
                                            case 5:
                                            case "end":
                                                return _context.stop(
                                                );
                                            }
                                    },
                                    _callee
                                );
                            }
                        )
                    )).apply(
                        this,
                        arguments
                    );
                }
                function appGetInitialProps(
                    _
                ) {
                    return _appGetInitialProps.apply(
                        this,
                        arguments
                    );
                }
                var App = (function (
                    _react$default$Compon
                ) {
                    _inherits(
                        App,
                        _react$default$Compon
                    );
                    var _super = _createSuper(
                        App
                    );
                    function App(
                    ) {
                        return (
                            _classCallCheck(
                                this,
                                App
                            ),
                            _super.apply(
                                this,
                                arguments
                            )
                        );
                    }
                    return (
                        _createClass(
                            App,
                            [
                                {
                                    key: "render",
                                    value: function (
                                    ) {
                                        var _this$props = this.props,
                                            Component = _this$props.Component,
                                            pageProps = _this$props.pageProps;
                                        return _react.default.createElement(
                                            Component,
                                            Object.assign(
                                                {
                                                },
                                                pageProps
                                            )
                                        );
                                    },
                                },
                            ]
                        ),
                        App
                    );
                })(
                    _react.default.Component
                );
                (App.origGetInitialProps = appGetInitialProps),
                (App.getInitialProps = appGetInitialProps),
                (exports.default = App);
            },
            681: function (
                __unused_webpack_module,
                __unused_webpack_exports,
                __webpack_require__
            ) {
                (window.__NEXT_P = window.__NEXT_P || []).push(
                    [
                        "/_app",
                        function (
                        ) {
                            return __webpack_require__(
                                7430
                            );
                        },
                    ]
                );
            },
        },
        function (
            __webpack_require__
        ) {
            var __webpack_exec__ = function (
                moduleId
            ) {
                return __webpack_require__(
                    (__webpack_require__.s = moduleId)
                );
            };
            __webpack_require__.O(
                0,
                [774, 179,],
                function (
                ) {
                    return __webpack_exec__(
                        681
                    ), __webpack_exec__(
                        6409
                    );
                }
            );
            var __webpack_exports__ = __webpack_require__.O(
            );
            _N_E = __webpack_exports__;
        },
    ]
);
