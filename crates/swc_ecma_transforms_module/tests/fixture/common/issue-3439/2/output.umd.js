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
        bar: function() {
            return bar;
        },
        foo1: function() {
            return foo;
        },
        bar2: function() {
            return bar;
        },
        foo: function() {
            return foo;
        },
        default: function() {
            return _default;
        }
    });
    const foo = 1;
    let bar = 2;
    const _default = bar;
    bar = 3;
});
