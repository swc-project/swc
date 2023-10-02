// input.ts
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
    "use client";
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "ReactClientComponent", {
        enumerable: true,
        get: function() {
            return ReactClientComponent;
        }
    });
    function ReactClientComponent() {
        return "Hello world";
    }
});
