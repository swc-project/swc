(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./dep"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./dep"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.umd = {}, global.dep);
})(this, function(exports, _dep) {
    "use strict";
    exports.__esModule = true;
    exports.value = _dep.value;
});
