(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        888
    ],
    {
        1118: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function() {
                    return __webpack_require__(8484);
                }, 
            ]);
        },
        8484: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
            function _defineProperty(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
                    "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }))), ownKeys.forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            }
            function MyApp(param) {
                var Component = param.Component, pageProps = param.pageProps;
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, _objectSpread({}, pageProps));
            }
            __webpack_require__(6774), __webpack_exports__.default = MyApp;
        },
        6774: function() {}
    },
    function(__webpack_require__) {
        var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        __webpack_require__.O(0, [
            774,
            179
        ], function() {
            return __webpack_exec__(1118), __webpack_exec__(880);
        }), _N_E = __webpack_require__.O();
    }, 
]);
