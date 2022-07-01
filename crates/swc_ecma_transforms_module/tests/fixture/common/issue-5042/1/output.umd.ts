(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("jquery"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "jquery"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.jquery);
})(this, function(exports, _jquery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        "$": ()=>_jquery,
        jquery: ()=>_jquery
    });
    _jquery(".hello");
});
