//// [a.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.aTs = {});
}(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
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
}(this, function(exports, _asyncToGenerator, _interopRequireDefault, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _asyncToGenerator = _asyncToGenerator.default, _a = (_interopRequireDefault = _interopRequireDefault.default)(_a), _asyncToGenerator(function*() {
        yield _a.default;
    })();
});
