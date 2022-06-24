(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>_default,
        enumerable: true
    });
    var _default = {
        foo: "bar"
    };
});
