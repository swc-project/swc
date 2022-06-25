(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("react"));
    else if (typeof define === "function" && define.amd) define([
        "react"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.react);
})(this, function(_react) {
    "use strict";
    _react = _interopRequireDefault(_react);
    window.React = _react.default;
});
