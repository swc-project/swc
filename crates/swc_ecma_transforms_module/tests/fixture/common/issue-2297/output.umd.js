(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./Bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./Bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(_bar) {
    "use strict";
    const makeX = (props)=>{
        const _bar1 = props.bar;
        const { list  } = _bar1;
        return list.map(()=>_bar.bar);
    };
});
