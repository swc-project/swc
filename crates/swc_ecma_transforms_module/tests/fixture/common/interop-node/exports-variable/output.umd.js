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
        foo: function() {
            return foo;
        },
        foo2: function() {
            return foo2;
        },
        foo3: function() {
            return foo3;
        },
        foo4: function() {
            return foo4;
        },
        foo5: function() {
            return foo5;
        },
        foo6: function() {
            return foo6;
        },
        foo7: function() {
            return foo7;
        },
        foo8: function() {
            return foo8;
        },
        foo9: function() {
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
