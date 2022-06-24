(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("react"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "react"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.react);
})(this, function(_react) {
    "use strict";
    _react = _interopRequireWildcard(_react);
    class X extends _react.Component {
    }
    _react.default.render();
});
