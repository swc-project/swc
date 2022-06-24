(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("another-module"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "another-module"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.anotherModule);
})(this, function(_anotherModule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "whatever", {
        get: ()=>whatever,
        enumerable: true
    });
    _exportStar(_anotherModule, exports);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
