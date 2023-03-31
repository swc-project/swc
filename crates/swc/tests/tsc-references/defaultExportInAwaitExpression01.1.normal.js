//// [a.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.aTs = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_default
    });
    const x = new Promise((resolve, reject)=>{
        resolve({});
    });
    const _default = x;
});
//// [b.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_default.mjs"), require("./a"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_default.mjs",
        "./a"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.bTs = {}, global.asyncToGeneratorMjs, global.interopRequireDefaultMjs, global.a);
})(this, function(exports, _async_to_generator, _interop_require_default, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _async_to_generator = _async_to_generator.default;
    _interop_require_default = _interop_require_default.default;
    _a = /*#__PURE__*/ _interop_require_default(_a);
    _async_to_generator(function*() {
        const value = yield _a.default;
    })();
});
