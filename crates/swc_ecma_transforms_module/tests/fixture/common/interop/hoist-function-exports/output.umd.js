(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./evens"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./evens"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.evens);
})(this, function(_evens) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        isOdd: ()=>isOdd,
        nextOdd: ()=>nextOdd
    });
    function nextOdd(n) {
        return (0, _evens.isEven)(n) ? n + 1 : n + 2;
    }
    var isOdd = function(isEven) {
        return function(n) {
            return !isEven(n);
        };
    }(_evens.isEven);
});
