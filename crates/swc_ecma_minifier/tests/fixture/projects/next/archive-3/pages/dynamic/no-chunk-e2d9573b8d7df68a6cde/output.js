(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        732
    ],
    {
        2911: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _assertThisInitialized(self1) {
                if (void 0 === self1) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self1;
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _assertThisInitialized;
                }
            });
        },
        8436: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _classCallCheck;
                }
            });
        },
        8370: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
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
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _createClass;
                }
            });
        },
        9178: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _defineProperty(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _defineProperty;
                }
            });
        },
        2374: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _getPrototypeOf(o) {
                return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                })(o);
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _getPrototypeOf;
                }
            });
        },
        3001: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _setPrototypeOf(o, p) {
                return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o, p);
            }
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
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _inherits;
                }
            });
        },
        7130: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _typeof(obj) {
                return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _possibleConstructorReturn;
                }
            });
            var assertThisInitialized = __webpack_require__(2911);
            function _possibleConstructorReturn(self1, call) {
                return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (0, assertThisInitialized.Z)(self1);
            }
        },
        8551: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _defineProperty = __webpack_require__(566);
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly && (symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    })), keys.push.apply(keys, symbols);
                }
                return keys;
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
                return target;
            }
            exports.default = function(dynamicOptions, options) {
                var loadableOptions, loadableFn = _loadable.default, loadableOptions1 = {
                    loading: function(_ref) {
                        return _ref.error, _ref.isLoading, _ref.pastDelay, null;
                    }
                };
                if (dynamicOptions instanceof Promise ? loadableOptions1.loader = function() {
                    return dynamicOptions;
                } : "function" == typeof dynamicOptions ? loadableOptions1.loader = dynamicOptions : "object" == typeof dynamicOptions && (loadableOptions1 = _objectSpread(_objectSpread({}, loadableOptions1), dynamicOptions)), (loadableOptions1 = _objectSpread(_objectSpread({}, loadableOptions1), options)).loadableGenerated && (loadableOptions1 = _objectSpread(_objectSpread({}, loadableOptions1), loadableOptions1.loadableGenerated), delete loadableOptions1.loadableGenerated), "boolean" == typeof loadableOptions1.ssr) {
                    if (!loadableOptions1.ssr) return delete loadableOptions1.ssr, loadableOptions = loadableOptions1, delete loadableOptions.webpack, delete loadableOptions.modules, loadableFn(loadableOptions);
                    delete loadableOptions1.ssr;
                }
                return loadableFn(loadableOptions1);
            }, _interopRequireDefault(__webpack_require__(2735));
            var _loadable = _interopRequireDefault(__webpack_require__(880));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
        },
        8183: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.LoadableContext = void 0;
            var obj, LoadableContext = ((obj = __webpack_require__(2735)) && obj.__esModule ? obj : {
                default: obj
            }).default.createContext(null);
            exports.LoadableContext = LoadableContext;
        },
        880: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj, _defineProperty = __webpack_require__(566), _classCallCheck = __webpack_require__(4988), _createClass = __webpack_require__(9590);
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly && (symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    })), keys.push.apply(keys, symbols);
                }
                return keys;
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
                return target;
            }
            function _arrayLikeToArray(arr, len) {
                (null == len || len > arr.length) && (len = arr.length);
                for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
                return arr2;
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = void 0;
            var _react = (obj = __webpack_require__(2735)) && obj.__esModule ? obj : {
                default: obj
            }, _useSubscription = __webpack_require__(4234), _loadableContext = __webpack_require__(8183), ALL_INITIALIZERS = [], READY_INITIALIZERS = [], initialized = !1;
            function load(loader) {
                var promise = loader(), state = {
                    loading: !0,
                    loaded: null,
                    error: null
                };
                return state.promise = promise.then(function(loaded) {
                    return state.loading = !1, state.loaded = loaded, loaded;
                }).catch(function(err) {
                    throw state.loading = !1, state.error = err, err;
                }), state;
            }
            var LoadableSubscription = function() {
                function LoadableSubscription(loadFn, opts) {
                    _classCallCheck(this, LoadableSubscription), this._loadFn = loadFn, this._opts = opts, this._callbacks = new Set(), this._delay = null, this._timeout = null, this.retry();
                }
                return _createClass(LoadableSubscription, [
                    {
                        key: "promise",
                        value: function() {
                            return this._res.promise;
                        }
                    },
                    {
                        key: "retry",
                        value: function() {
                            var _this = this;
                            this._clearTimeouts(), this._res = this._loadFn(this._opts.loader), this._state = {
                                pastDelay: !1,
                                timedOut: !1
                            };
                            var res = this._res, opts1 = this._opts;
                            res.loading && ("number" == typeof opts1.delay && (0 === opts1.delay ? this._state.pastDelay = !0 : this._delay = setTimeout(function() {
                                _this._update({
                                    pastDelay: !0
                                });
                            }, opts1.delay)), "number" == typeof opts1.timeout && (this._timeout = setTimeout(function() {
                                _this._update({
                                    timedOut: !0
                                });
                            }, opts1.timeout))), this._res.promise.then(function() {
                                _this._update({}), _this._clearTimeouts();
                            }).catch(function(_err) {
                                _this._update({}), _this._clearTimeouts();
                            }), this._update({});
                        }
                    },
                    {
                        key: "_update",
                        value: function(partial) {
                            this._state = _objectSpread(_objectSpread({}, this._state), {}, {
                                error: this._res.error,
                                loaded: this._res.loaded,
                                loading: this._res.loading
                            }, partial), this._callbacks.forEach(function(callback) {
                                return callback();
                            });
                        }
                    },
                    {
                        key: "_clearTimeouts",
                        value: function() {
                            clearTimeout(this._delay), clearTimeout(this._timeout);
                        }
                    },
                    {
                        key: "getCurrentValue",
                        value: function() {
                            return this._state;
                        }
                    },
                    {
                        key: "subscribe",
                        value: function(callback) {
                            var _this2 = this;
                            return this._callbacks.add(callback), function() {
                                _this2._callbacks.delete(callback);
                            };
                        }
                    }
                ]), LoadableSubscription;
            }();
            function Loadable(opts1) {
                return function(loadFn, options) {
                    var opts = Object.assign({
                        loader: null,
                        loading: null,
                        delay: 200,
                        timeout: null,
                        webpack: null,
                        modules: null
                    }, options), subscription = null;
                    function init() {
                        if (!subscription) {
                            var sub = new LoadableSubscription(loadFn, opts);
                            subscription = {
                                getCurrentValue: sub.getCurrentValue.bind(sub),
                                subscribe: sub.subscribe.bind(sub),
                                retry: sub.retry.bind(sub),
                                promise: sub.promise.bind(sub)
                            };
                        }
                        return subscription.promise();
                    }
                    if (!initialized && "function" == typeof opts.webpack) {
                        var moduleIds = opts.webpack();
                        READY_INITIALIZERS.push(function(ids) {
                            var _step, _iterator = function(o, allowArrayLike) {
                                if ("undefined" == typeof Symbol || null == o[Symbol.iterator]) {
                                    if (Array.isArray(o) || (it = function(o, minLen) {
                                        if (o) {
                                            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
                                            var n = Object.prototype.toString.call(o).slice(8, -1);
                                            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
                                            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
                                        }
                                    }(o))) {
                                        it && (o = it);
                                        var i = 0, F = function() {};
                                        return {
                                            s: F,
                                            n: function() {
                                                return i >= o.length ? {
                                                    done: !0
                                                } : {
                                                    done: !1,
                                                    value: o[i++]
                                                };
                                            },
                                            e: function(_e) {
                                                throw _e;
                                            },
                                            f: F
                                        };
                                    }
                                    throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                                }
                                var it, err, normalCompletion = !0, didErr = !1;
                                return {
                                    s: function() {
                                        it = o[Symbol.iterator]();
                                    },
                                    n: function() {
                                        var step = it.next();
                                        return normalCompletion = step.done, step;
                                    },
                                    e: function(_e2) {
                                        didErr = !0, err = _e2;
                                    },
                                    f: function() {
                                        try {
                                            normalCompletion || null == it.return || it.return();
                                        } finally{
                                            if (didErr) throw err;
                                        }
                                    }
                                };
                            }(moduleIds);
                            try {
                                for(_iterator.s(); !(_step = _iterator.n()).done;){
                                    var moduleId = _step.value;
                                    if (-1 !== ids.indexOf(moduleId)) return init();
                                }
                            } catch (err) {
                                _iterator.e(err);
                            } finally{
                                _iterator.f();
                            }
                        });
                    }
                    var LoadableComponent = function(props, ref) {
                        init();
                        var context = _react.default.useContext(_loadableContext.LoadableContext), state = _useSubscription.useSubscription(subscription);
                        return _react.default.useImperativeHandle(ref, function() {
                            return {
                                retry: subscription.retry
                            };
                        }, []), context && Array.isArray(opts.modules) && opts.modules.forEach(function(moduleName) {
                            context(moduleName);
                        }), _react.default.useMemo(function() {
                            var obj;
                            return state.loading || state.error ? _react.default.createElement(opts.loading, {
                                isLoading: state.loading,
                                pastDelay: state.pastDelay,
                                timedOut: state.timedOut,
                                error: state.error,
                                retry: subscription.retry
                            }) : state.loaded ? _react.default.createElement((obj = state.loaded) && obj.__esModule ? obj.default : obj, props) : null;
                        }, [
                            props,
                            state
                        ]);
                    };
                    return LoadableComponent.preload = function() {
                        return init();
                    }, LoadableComponent.displayName = "LoadableComponent", _react.default.forwardRef(LoadableComponent);
                }(load, opts1);
            }
            function flushInitializers(initializers, ids) {
                for(var promises = []; initializers.length;){
                    var init = initializers.pop();
                    promises.push(init(ids));
                }
                return Promise.all(promises).then(function() {
                    if (initializers.length) return flushInitializers(initializers, ids);
                });
            }
            Loadable.preloadAll = function() {
                return new Promise(function(resolveInitializers, reject) {
                    flushInitializers(ALL_INITIALIZERS).then(resolveInitializers, reject);
                });
            }, Loadable.preloadReady = function() {
                var ids = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                return new Promise(function(resolvePreload) {
                    var res = function() {
                        return initialized = !0, resolvePreload();
                    };
                    flushInitializers(READY_INITIALIZERS, ids).then(res, res);
                });
            }, window.__NEXT_PRELOADREADY = Loadable.preloadReady, exports.default = Loadable;
        },
        9087: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return Welcome;
                }
            });
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8436), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8370), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2911), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3001), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7130), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2374), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9178), Welcome = function(_React$Component) {
                (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__.Z)(Welcome, _React$Component);
                var hasNativeReflectConstruct, _super = (hasNativeReflectConstruct = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var result, Super = (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__.Z)(Welcome);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__.Z)(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__.Z)(this, result);
                });
                function Welcome() {
                    var _this;
                    (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__.Z)(this, Welcome);
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return _this = _super.call.apply(_super, [
                        this
                    ].concat(args)), (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__.Z)((0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_7__.Z)(_this), "state", {
                        name: null
                    }), _this;
                }
                return (0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_8__.Z)(Welcome, [
                    {
                        key: "componentDidMount",
                        value: function() {
                            var name = this.props.name;
                            this.setState({
                                name: name
                            });
                        }
                    },
                    {
                        key: "render",
                        value: function() {
                            var name = this.state.name;
                            return name ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                children: [
                                    "Welcome, ",
                                    name
                                ]
                            }) : null;
                        }
                    }
                ]), Welcome;
            }(__webpack_require__(2735).Component);
        },
        8837: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4652), _components_welcome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9087), Welcome2 = (0, next_dynamic__WEBPACK_IMPORTED_MODULE_1__.default)(function() {
                return Promise.resolve().then(__webpack_require__.bind(__webpack_require__, 9087));
            }, {
                loadableGenerated: {
                    webpack: function() {
                        return [
                            9087
                        ];
                    },
                    modules: [
                        "dynamic/no-chunk.js -> ../../components/welcome"
                    ]
                }
            });
            __webpack_exports__.default = function() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_welcome__WEBPACK_IMPORTED_MODULE_2__.default, {
                            name: "normal"
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Welcome2, {
                            name: "dynamic"
                        })
                    ]
                });
            };
        },
        5279: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic/no-chunk",
                function() {
                    return __webpack_require__(8837);
                }
            ]);
        },
        4652: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(8551);
        }
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 5279);
        }), _N_E = __webpack_require__.O();
    }
]);
