(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./url"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./url"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.url);
})(this, function(_url) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "setup", {
        get: ()=>setup,
        enumerable: true
    });
    function setup(url: string, obj: any) {
        const _queryString = (0, _url.queryString)(obj);
        const _url1 = url + "?" + _queryString;
        return _url1;
    }
});
