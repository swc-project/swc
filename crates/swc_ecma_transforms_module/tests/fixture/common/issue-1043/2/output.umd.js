(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("reflect-metadata"), require("./http"), require("./interfaces"), require("./pipes"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "reflect-metadata",
        "./http",
        "./interfaces",
        "./pipes"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.reflectMetadata, global.http, global.interfaces, global.pipes);
})(this, function(exports, _reflectmetadata, _http, _interfaces, _pipes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "id", {
        enumerable: true,
        get: function() {
            return _interfaces.id;
        }
    });
    _export_star(_http, exports);
    _export_star(_pipes, exports);
});
