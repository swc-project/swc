(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        888
    ],
    {
        1118: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function() {
                    return __webpack_require__(2373);
                }
            ]);
            if (false) ;
        },
        2373: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return _app;
                }
            });
            function _defineProperty(obj, key, value) {
                if (key in obj) Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
                else obj[key] = value;
                return obj;
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    var ownKeys = Object.keys(source);
                    if ('function' == typeof Object.getOwnPropertySymbols) ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }));
                    ownKeys.forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            }
            var jsx_runtime = __webpack_require__(5893);
            var globals = __webpack_require__(906);
            function MyApp(param) {
                var Component = param.Component, pageProps = param.pageProps;
                return (0, jsx_runtime.jsx)(Component, _objectSpread({}, pageProps));
            }
            var _app = MyApp;
        },
        906: function() {}
    },
    function(__webpack_require__) {
        var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        __webpack_require__.O(0, [
            774,
            179
        ], function() {
            return __webpack_exec__(1118), __webpack_exec__(387);
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    }
]);
