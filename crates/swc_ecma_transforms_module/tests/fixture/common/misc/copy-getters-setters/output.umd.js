(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./moduleWithGetter"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./moduleWithGetter"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.moduleWithGetter);
})(this, function(exports, _module_with_getter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        baz: ()=>_module_with_getter.baz,
        Foo: ()=>_module_with_getter.default
    });
    _module_with_getter = /*#__PURE__*/ _interop_require_wildcard(_module_with_getter);
});
