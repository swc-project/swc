//// [a.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.aTs = {});
}(this, function(exports1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "default", {
        enumerable: !0,
        get: ()=>_default
    });
    let x = new Promise((resolve, reject)=>{
        resolve({});
    }), _default = x;
});
//// [b.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_default.mjs"), require("./a")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_default.mjs",
        "./a"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.bTs = {}, global.asyncToGeneratorMjs, global.interopRequireDefaultMjs, global.a);
}(this, function(exports1, _async_to_generator, _interop_require_default, _a) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), _async_to_generator = _async_to_generator.default, _a = (_interop_require_default = _interop_require_default.default)(_a), _async_to_generator(function*() {
        yield _a.default;
    })();
});
