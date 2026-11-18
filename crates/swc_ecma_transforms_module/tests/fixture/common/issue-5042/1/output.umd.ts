(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("jquery"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "jquery"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.jquery);
})(this, function(exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "jquery", {
        enumerable: true,
        get: function() {
            return exports.$;
        }
    });
    exports.$ = $;
    (0, exports.$)(".hello");
});
