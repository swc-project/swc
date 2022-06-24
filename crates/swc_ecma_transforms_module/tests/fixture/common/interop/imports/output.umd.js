(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("foo-bar"), require("./directory/foo-bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "foo-bar",
        "./directory/foo-bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.fooBar, global.fooBar);
})(this, function(exports, _foo, _fooBar, _fooBar1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
