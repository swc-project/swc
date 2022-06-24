(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("something"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "something"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.something);
})(this, function(exports, _something) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "fn", {
        get: ()=>fn,
        enumerable: true
    });
    const fn = ({ a =new _something.Foo()  })=>a;
});
