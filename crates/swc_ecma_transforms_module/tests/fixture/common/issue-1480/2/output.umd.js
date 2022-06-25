(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("ora"));
    else if (typeof define === "function" && define.amd) define([
        "ora"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.ora);
})(this, function(_ora) {
    "use strict";
    _ora = _interopRequireWildcard(_ora);
});
