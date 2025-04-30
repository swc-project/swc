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
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get bar () {
            return bar;
        },
        get foo () {
            return foo;
        },
        get foo2 () {
            return foo2;
        },
        get foo3 () {
            return foo3;
        },
        get foo4 () {
            return foo4;
        },
        get foo5 () {
            return foo5;
        },
        get foo6 () {
            return foo6;
        },
        get foo7 () {
            return foo7;
        },
        get foo8 () {
            return foo8;
        },
        get foo9 () {
            return foo9;
        }
    });
    var foo = 1;
    var foo2 = 1, bar = 2;
    var foo3 = function() {};
    var foo4;
    let foo5 = 2;
    let foo6;
    const foo7 = 3;
    function foo8() {}
    class foo9 {
    }
});
