(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("foo"), require("foo-bar"), require("./directory/foo-bar"));
    else if (typeof define === "function" && define.amd) define([
        "foo",
        "foo-bar",
        "./directory/foo-bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.foo, global.fooBar, global.fooBar);
})(this, function(_foo, _fooBar, _fooBar1) {
    "use strict";
});
