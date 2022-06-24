(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(_bar) {
    "use strict";
    const makeX = ()=>{
        const _bar1 = ()=>(0, _bar.bar)();
        const alfa = ()=>_bar1();
        return {
            alfa
        };
    };
});
