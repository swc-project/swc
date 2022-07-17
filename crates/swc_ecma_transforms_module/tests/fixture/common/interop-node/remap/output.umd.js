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
        test: ()=>test,
        a: ()=>a,
        c: ()=>b,
        e: ()=>d,
        f: ()=>d
    });
    var test = 2;
    test = 5;
    test++;
    (function() {
        var test = 2;
        test = 3;
        test++;
    })();
    var a = 2;
    a = 3;
    var b = 2;
    b = 3;
    var d = 3;
    d = 4;
});
