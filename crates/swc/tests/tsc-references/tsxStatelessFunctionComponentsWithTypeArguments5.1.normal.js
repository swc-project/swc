//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _objectSpread, _objectSpreadProps, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _objectSpread = _objectSpread.default;
    _objectSpreadProps = _objectSpreadProps.default;
    function createComponent(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(Component, arg);
        var a2 = /*#__PURE__*/ _react.createElement(Component, _objectSpreadProps(_objectSpread({}, arg), {
            prop1: true
        }));
    }
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _objectSpreadProps(_objectSpread({}, arg), {
            "ignore-prop": "hi"
        })); // U is number
        var a2 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _objectSpreadProps(_objectSpread({}, arg), {
            "ignore-prop": 10
        })); // U is number
        var a3 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _objectSpreadProps(_objectSpread({}, arg), {
            prop: "hello"
        })); // U is "hello"
        var a4 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _objectSpreadProps(_objectSpread({}, arg), {
            prop1: "hello"
        })); // U is "hello"
    }
});
