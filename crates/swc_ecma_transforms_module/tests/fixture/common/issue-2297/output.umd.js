(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./Bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./Bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(exports, _Bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const makeX = (props)=>{
        const _bar = props.bar;
        const { list  } = _bar;
        return list.map(()=>_Bar.bar);
    };
});
