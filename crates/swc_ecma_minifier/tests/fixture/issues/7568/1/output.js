var specific_microfront;
!function() {
    "use strict";
    var __webpack_modules__ = {}, __webpack_module_cache__ = {};
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
