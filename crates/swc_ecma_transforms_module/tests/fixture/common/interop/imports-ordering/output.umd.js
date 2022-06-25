(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("./foo"), require("./bar"), require("./derp"), require("./qux"));
    else if (typeof define === "function" && define.amd) define([
        "./foo",
        "./bar",
        "./derp",
        "./qux"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.foo, global.bar, global.derp, global.qux);
})(this, function(_foo, _bar, _derp, _qux) {
    "use strict";
    _bar = _interopRequireDefault(_bar);
});
