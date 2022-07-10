(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
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
        bar: ()=>bar,
        foo1: ()=>foo,
        bar2: ()=>bar,
        foo: ()=>foo,
        default: ()=>_default
    });
    const foo = 1;
    let bar = 2;
    var _default = bar;
    bar = 3;
});
