var specific_microfront;
!function() {
    "use strict";
    var __webpack_modules__ = {
        "webpack/container/entry/specific_page": function(__unused_webpack_module, exports, __webpack_require__) {
            var moduleMap = {
                ".": function() {
                    return Promise.all([]).then(function() {
                        return function() {
                            return __webpack_require__("./workers.ts");
                        };
                    });
                }
            }, get = function(module, getScope) {
                return __webpack_require__.R = getScope, getScope = __webpack_require__.o(moduleMap, module) ? moduleMap[module]() : Promise.resolve().then(function() {
                    throw Error('Module "' + module + '" does not exist in container.');
                }), __webpack_require__.R = void 0, getScope;
            }, init = function(shareScope, initScope) {
                if (__webpack_require__.S) {
                    var name = "default", oldScope = __webpack_require__.S[name];
                    if (oldScope && oldScope !== shareScope) throw Error("Container initialization failed as it has already been initialized with a different share scope");
                    return __webpack_require__.S[name] = shareScope, __webpack_require__.I(name, initScope);
                }
            };
            __webpack_require__.d(exports, {
                get: function() {
                    return get;
                },
                init: function() {
                    return init;
                }
            });
        },
        react: function(module) {
            module.exports = React;
        },
        jquery: function(module) {
            module.exports = jQuery;
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            loaded: !1,
            exports: {}
        };
        return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.loaded = !0, module.exports;
    }
    __webpack_require__.m = __webpack_modules__, __webpack_require__.c = __webpack_module_cache__, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, specific_microfront = __webpack_require__("webpack/container/entry/specific_page");
}();
