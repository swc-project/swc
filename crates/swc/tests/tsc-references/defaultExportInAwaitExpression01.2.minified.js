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
        get: function() {
            return _default;
        }
    });
    let x = new Promise((resolve, reject)=>{
        resolve({});
    }), _default = x;
});
//// [b.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_default"), require("./a")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/_/_async_to_generator",
        "@swc/helpers/_/_interop_require_default",
        "./a"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.bTs = {}, global.asyncToGenerator, global.interopRequireDefault, global.a);
}(this, function(exports1, _async_to_generator, _interop_require_default, _a) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), _a = _interop_require_default._(_a), _async_to_generator._(function*() {
        yield _a.default;
    })();
});
