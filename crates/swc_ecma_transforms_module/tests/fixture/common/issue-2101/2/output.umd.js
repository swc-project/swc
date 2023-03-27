(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./customRender"), require("@testing-library/react"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./customRender",
        "@testing-library/react"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.customRender, global.react);
})(this, function(exports, _custom_render, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "render", {
        enumerable: true,
        get: ()=>_custom_render.customRender
    });
    _export_star(_react, exports);
});
