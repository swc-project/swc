(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        888
    ],
    {
        6840: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function() {
                    return __webpack_require__(669);
                }
            ]);
        },
        669: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return _app;
                }
            });
            var _define_property = __webpack_require__(4924);
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
                    'function' == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }))), ownKeys.forEach(function(key) {
                        (0, _define_property.Z)(target, key, source[key]);
                    });
                }
                return target;
            }
            var jsx_runtime = __webpack_require__(5893);
            function MyApp(param) {
                var Component = param.Component, pageProps = param.pageProps;
                return (0, jsx_runtime.jsx)(Component, _objectSpread({}, pageProps));
            }
            __webpack_require__(906);
            var _app = MyApp;
        },
        906: function() {},
        4924: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
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
        }
    },
    function(__webpack_require__) {
        var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        __webpack_require__.O(0, [
            774,
            179
        ], function() {
            return __webpack_exec__(6840), __webpack_exec__(387);
        }), _N_E = __webpack_require__.O();
    }
]);
