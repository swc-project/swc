(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8581:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4369);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 7645:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
__webpack_unused_export__ = ({
    value: true
});
exports["default"] = dynamic;
__webpack_unused_export__ = noSSR;
var _react = _interopRequireDefault(__webpack_require__(7294));
var _loadable = _interopRequireDefault(__webpack_require__(4588));
function dynamic(dynamicOptions, options) {
    var loadableFn = _loadable.default;
    var loadableOptions = {
        // A loading component is not required, so we default it
        loading: function(param) {
            var error = param.error, isLoading = param.isLoading, pastDelay = param.pastDelay;
            if (!pastDelay) return null;
            if (false) {}
            return null;
        }
    };
    // Support for direct import(), eg: dynamic(import('../hello-world'))
    // Note that this is only kept for the edge case where someone is passing in a promise as first argument
    // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
    // To make sure we don't execute the import without rendering first
    if (_instanceof(dynamicOptions, Promise)) {
        loadableOptions.loader = function() {
            return dynamicOptions;
        };
    // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
    } else if (typeof dynamicOptions === "function") {
        loadableOptions.loader = dynamicOptions;
    // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
    } else if (typeof dynamicOptions === "object") {
        loadableOptions = _objectSpread({}, loadableOptions, dynamicOptions);
    }
    // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
    loadableOptions = _objectSpread({}, loadableOptions, options);
    var suspenseOptions = loadableOptions;
    // Error if Fizz rendering is not enabled and `suspense` option is set to true
    if ( true && suspenseOptions.suspense) {
        throw new Error("Invalid suspense option usage in next/dynamic. Read more: https://nextjs.org/docs/messages/invalid-dynamic-suspense");
    }
    if (suspenseOptions.suspense) {
        return loadableFn(suspenseOptions);
    }
    // coming from build/babel/plugins/react-loadable-plugin.js
    if (loadableOptions.loadableGenerated) {
        loadableOptions = _objectSpread({}, loadableOptions, loadableOptions.loadableGenerated);
        delete loadableOptions.loadableGenerated;
    }
    // support for disabling server side rendering, eg: dynamic(import('../hello-world'), {ssr: false})
    if (typeof loadableOptions.ssr === "boolean") {
        if (!loadableOptions.ssr) {
            delete loadableOptions.ssr;
            return noSSR(loadableFn, loadableOptions);
        }
        delete loadableOptions.ssr;
    }
    return loadableFn(loadableOptions);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var isServerSide = "object" === "undefined";
function noSSR(LoadableInitializer, loadableOptions) {
    // Removing webpack and modules means react-loadable won't try preloading
    delete loadableOptions.webpack;
    delete loadableOptions.modules;
    // This check is necessary to prevent react-loadable from initializing on the server
    if (!isServerSide) {
        return LoadableInitializer(loadableOptions);
    }
    var Loading = loadableOptions.loading;
    // This will only be rendered on the server side
    return function() {
        return /*#__PURE__*/ _react.default.createElement(Loading, {
            error: null,
            isLoading: true,
            pastDelay: false,
            timedOut: false
        });
    };
} //# sourceMappingURL=dynamic.js.map


/***/ }),

/***/ 3644:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.LoadableContext = void 0;
var _react = _interopRequireDefault(__webpack_require__(7294));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var LoadableContext = _react.default.createContext(null);
exports.LoadableContext = LoadableContext;
if (false) {} //# sourceMappingURL=loadable-context.js.map


/***/ }),

/***/ 4588:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(7294));
var _useSubscription = __webpack_require__(2021);
var _loadableContext = __webpack_require__(3644);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];
var initialized = false;
function load(loader) {
    var promise = loader();
    var state = {
        loading: true,
        loaded: null,
        error: null
    };
    state.promise = promise.then(function(loaded) {
        state.loading = false;
        state.loaded = loaded;
        return loaded;
    }).catch(function(err) {
        state.loading = false;
        state.error = err;
        throw err;
    });
    return state;
}
function resolve(obj) {
    return obj && obj.__esModule ? obj.default : obj;
}
function createLoadableComponent(loadFn, options) {
    var init = function init() {
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
    };
    var LoadableImpl = function LoadableImpl(props, ref) {
        init();
        var context = _react.default.useContext(_loadableContext.LoadableContext);
        var state = (0, _useSubscription).useSubscription(subscription);
        _react.default.useImperativeHandle(ref, function() {
            return {
                retry: subscription.retry
            };
        }, []);
        if (context && Array.isArray(opts.modules)) {
            opts.modules.forEach(function(moduleName) {
                context(moduleName);
            });
        }
        return _react.default.useMemo(function() {
            if (state.loading || state.error) {
                return _react.default.createElement(opts.loading, {
                    isLoading: state.loading,
                    pastDelay: state.pastDelay,
                    timedOut: state.timedOut,
                    error: state.error,
                    retry: subscription.retry
                });
            } else if (state.loaded) {
                return _react.default.createElement(resolve(state.loaded), props);
            } else {
                return null;
            }
        }, [
            props,
            state
        ]);
    };
    var LazyImpl = function LazyImpl(props, ref) {
        return _react.default.createElement(opts.lazy, _objectSpread({}, props, {
            ref: ref
        }));
    };
    var opts = Object.assign({
        loader: null,
        loading: null,
        delay: 200,
        timeout: null,
        webpack: null,
        modules: null,
        suspense: false
    }, options);
    if (opts.suspense) {
        opts.lazy = _react.default.lazy(opts.loader);
    }
    var subscription = null;
    // Server only
    if (false) {}
    // Client only
    if (!initialized && "object" !== "undefined" && !opts.suspense) {
        // require.resolveWeak check is needed for environments that don't have it available like Jest
        var moduleIds = opts.webpack && "function" === "function" ? opts.webpack() : opts.modules;
        if (moduleIds) {
            READY_INITIALIZERS.push(function(ids) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = moduleIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var moduleId = _step.value;
                        if (ids.indexOf(moduleId) !== -1) {
                            return init();
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
            });
        }
    }
    var LoadableComponent = opts.suspense ? LazyImpl : LoadableImpl;
    LoadableComponent.preload = function() {
        return !opts.suspense && init();
    };
    LoadableComponent.displayName = "LoadableComponent";
    return _react.default.forwardRef(LoadableComponent);
}
var LoadableSubscription = /*#__PURE__*/ function() {
    function LoadableSubscription(loadFn, opts) {
        _classCallCheck(this, LoadableSubscription);
        this._loadFn = loadFn;
        this._opts = opts;
        this._callbacks = new Set();
        this._delay = null;
        this._timeout = null;
        this.retry();
    }
    _createClass(LoadableSubscription, [
        {
            key: "promise",
            value: function promise() {
                return this._res.promise;
            }
        },
        {
            key: "retry",
            value: function retry() {
                var _this = this;
                this._clearTimeouts();
                this._res = this._loadFn(this._opts.loader);
                this._state = {
                    pastDelay: false,
                    timedOut: false
                };
                var ref = this, res = ref._res, opts = ref._opts;
                if (res.loading) {
                    if (typeof opts.delay === "number") {
                        if (opts.delay === 0) {
                            this._state.pastDelay = true;
                        } else {
                            var _this1 = this;
                            this._delay = setTimeout(function() {
                                _this1._update({
                                    pastDelay: true
                                });
                            }, opts.delay);
                        }
                    }
                    if (typeof opts.timeout === "number") {
                        var _this2 = this;
                        this._timeout = setTimeout(function() {
                            _this2._update({
                                timedOut: true
                            });
                        }, opts.timeout);
                    }
                }
                this._res.promise.then(function() {
                    _this._update({});
                    _this._clearTimeouts();
                }).catch(function(_err) {
                    _this._update({});
                    _this._clearTimeouts();
                });
                this._update({});
            }
        },
        {
            key: "_update",
            value: function _update(partial) {
                this._state = _objectSpread({}, this._state, {
                    error: this._res.error,
                    loaded: this._res.loaded,
                    loading: this._res.loading
                }, partial);
                this._callbacks.forEach(function(callback) {
                    return callback();
                });
            }
        },
        {
            key: "_clearTimeouts",
            value: function _clearTimeouts() {
                clearTimeout(this._delay);
                clearTimeout(this._timeout);
            }
        },
        {
            key: "getCurrentValue",
            value: function getCurrentValue() {
                return this._state;
            }
        },
        {
            key: "subscribe",
            value: function subscribe(callback) {
                var _this = this;
                this._callbacks.add(callback);
                return function() {
                    _this._callbacks.delete(callback);
                };
            }
        }
    ]);
    return LoadableSubscription;
}();
function Loadable(opts) {
    return createLoadableComponent(load, opts);
}
function flushInitializers(initializers, ids) {
    var promises = [];
    while(initializers.length){
        var init = initializers.pop();
        promises.push(init(ids));
    }
    return Promise.all(promises).then(function() {
        if (initializers.length) {
            return flushInitializers(initializers, ids);
        }
    });
}
Loadable.preloadAll = function() {
    return new Promise(function(resolveInitializers, reject) {
        flushInitializers(ALL_INITIALIZERS).then(resolveInitializers, reject);
    });
};
Loadable.preloadReady = function() {
    var ids = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return new Promise(function(resolvePreload) {
        var res = function() {
            initialized = true;
            return resolvePreload();
        };
        // We always will resolve, errors should be handled within loading UIs.
        flushInitializers(READY_INITIALIZERS, ids).then(res, res);
    });
};
if (true) {
    window.__NEXT_PRELOADREADY = Loadable.preloadReady;
}
var _default = Loadable;
exports["default"] = _default; //# sourceMappingURL=loadable.js.map


/***/ }),

/***/ 4369:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9008);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7160);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5152);




var VideoCapture = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_2__["default"])(function() {
    return Promise.all(/* import() */[__webpack_require__.e(581), __webpack_require__.e(503), __webpack_require__.e(799)]).then(__webpack_require__.bind(__webpack_require__, 7799));
}, {
    loadableGenerated: {
        webpack: function() {
            return [
                /*require.resolve*/(7799)
            ];
        }
    },
    ssr: false
});
function Home() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_head__WEBPACK_IMPORTED_MODULE_1__["default"], {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("title", {
                        children: "Create Next App"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("meta", {
                        name: "description",
                        content: "Generated by create next app"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("main", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().main),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(VideoCapture, {})
            })
        ]
    });
};


/***/ }),

/***/ 7160:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__bCOhY","main":"Home_main__nLjiQ","footer":"Home_footer____T7K","title":"Home_title__T09hD","description":"Home_description__41Owk","code":"Home_code__suPER","grid":"Home_grid__GxQ85","card":"Home_card___LpL1","logo":"Home_logo__27_tb"};

/***/ }),

/***/ 2021:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var __dirname = "/";
(function(){"use strict";var e={800:function(e){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var r=Object.getOwnPropertySymbols;var t=Object.prototype.hasOwnProperty;var u=Object.prototype.propertyIsEnumerable;function toObject(e){if(e===null||e===undefined){throw new TypeError("Object.assign cannot be called with null or undefined")}return Object(e)}function shouldUseNative(){try{if(!Object.assign){return false}var e=new String("abc");e[5]="de";if(Object.getOwnPropertyNames(e)[0]==="5"){return false}var r={};for(var t=0;t<10;t++){r["_"+String.fromCharCode(t)]=t}var u=Object.getOwnPropertyNames(r).map((function(e){return r[e]}));if(u.join("")!=="0123456789"){return false}var n={};"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e}));if(Object.keys(Object.assign({},n)).join("")!=="abcdefghijklmnopqrst"){return false}return true}catch(e){return false}}e.exports=shouldUseNative()?Object.assign:function(e,n){var a;var i=toObject(e);var s;for(var c=1;c<arguments.length;c++){a=Object(arguments[c]);for(var o in a){if(t.call(a,o)){i[o]=a[o]}}if(r){s=r(a);for(var f=0;f<s.length;f++){if(u.call(a,s[f])){i[s[f]]=a[s[f]]}}}}return i}},569:function(e,r,t){
/** @license React vundefined
 * use-subscription.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if(false){}},403:function(e,r,t){
/** @license React vundefined
 * use-subscription.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var u=t(800),n=t(522);r.useSubscription=function(e){var r=e.getCurrentValue,t=e.subscribe,a=n.useState((function(){return{getCurrentValue:r,subscribe:t,value:r()}}));e=a[0];var i=a[1];a=e.value;if(e.getCurrentValue!==r||e.subscribe!==t)a=r(),i({getCurrentValue:r,subscribe:t,value:a});n.useDebugValue(a);n.useEffect((function(){function b(){if(!e){var n=r();i((function(e){return e.getCurrentValue!==r||e.subscribe!==t||e.value===n?e:u({},e,{value:n})}))}}var e=!1,n=t(b);b();return function(){e=!0;n()}}),[r,t]);return a}},138:function(e,r,t){if(true){e.exports=t(403)}else{}},522:function(e){e.exports=__webpack_require__(7294)}};var r={};function __nccwpck_require__(t){var u=r[t];if(u!==undefined){return u.exports}var n=r[t]={exports:{}};var a=true;try{e[t](n,n.exports,__nccwpck_require__);a=false}finally{if(a)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(138);module.exports=t})();

/***/ }),

/***/ 5152:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(7645)


/***/ }),

/***/ 9008:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(3121)


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(8581); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);