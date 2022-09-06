//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_extends.mjs",
    "react"
], function(require, exports, _extends, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _extends = _extends.default;
    function createComponent(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(Component, _extends({}, arg));
        var a2 = /*#__PURE__*/ _react.createElement(Component, _extends({}, arg, {
            prop1: true
        }));
    }
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _extends({}, arg, {
            "ignore-prop": "hi"
        })); // U is number
        var a2 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _extends({}, arg, {
            "ignore-prop": 10
        })); // U is number
        var a3 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _extends({}, arg, {
            prop: "hello"
        })); // U is "hello"
        var a4 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _extends({}, arg, {
            prop1: "hello"
        })); // U is "hello"
    }
});
