(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("assert"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "assert"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.assert);
})(this, function(exports, _assert) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _assert(true);
    module Foo {
        export const Baz = 42;
    }
    console.log(Bar.Baz);
});
