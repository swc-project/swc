(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./A"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./A"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.a);
})(this, function(exports, _A) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get A () {
            return _A;
        },
        get B () {
            return _A;
        }
    });
    _A = /*#__PURE__*/ _interop_require_wildcard(_A);
});
