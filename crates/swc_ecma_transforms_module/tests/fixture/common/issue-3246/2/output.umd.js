(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(_bar) {
    "use strict";
    _bar = _interopRequireDefault(_bar);
    import(_bar.default);
});
