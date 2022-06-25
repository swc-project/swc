(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("./foo"));
    else if (typeof define === "function" && define.amd) define([
        "./foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.foo);
})(this, function(_foo) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    console.log(_foo.default);
});
