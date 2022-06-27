(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const makeX = ()=>{
        const _bar1 = ()=>(0, _bar.bar)();
        return {
            _bar: _bar1
        };
    };
    makeX()._bar();
});
