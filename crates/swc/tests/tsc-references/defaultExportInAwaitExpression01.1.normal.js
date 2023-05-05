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
        get: function() {
            return _default;
        }
    });
    const x = new Promise((resolve, reject)=>{
        resolve({});
    });
    const _default = x;
});
//// [b.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_default"), require("./a"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_async_to_generator",
        "@swc/helpers/_/_interop_require_default",
        "./a"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.bTs = {}, global.asyncToGenerator, global.interopRequireDefault, global.a);
})(this, function(exports, _async_to_generator, _interop_require_default, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _a = /*#__PURE__*/ _interop_require_default._(_a);
    _async_to_generator._(function*() {
        const value = yield _a.default;
    })();
});
