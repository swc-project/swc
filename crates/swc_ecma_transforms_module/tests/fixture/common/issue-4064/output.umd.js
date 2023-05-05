(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./File1"), require("./File2"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./File1",
        "./File2"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.file1, global.file2);
})(this, function(exports, _File1, _File2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "BIZ", {
        enumerable: true,
        get: function() {
            return BIZ;
        }
    });
    _export_star(_File1, exports);
    _export_star(_File2, exports);
    const BIZ = "biz";
});
