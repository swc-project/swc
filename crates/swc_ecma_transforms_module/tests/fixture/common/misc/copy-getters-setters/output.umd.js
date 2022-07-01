(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./moduleWithGetter"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./moduleWithGetter"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.moduleWithGetter);
})(this, function(exports, _moduleWithGetter) {
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
        Foo: ()=>_moduleWithGetter.default,
        baz: ()=>_moduleWithGetter.baz
    });
    _moduleWithGetter = _interopRequireWildcard(_moduleWithGetter);
});
