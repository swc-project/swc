//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _object_spread = _object_spread.default;
    _object_spread_props = _object_spread_props.default;
    function createComponent(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(Component, arg);
        var a2 = /*#__PURE__*/ _react.createElement(Component, _object_spread_props(_object_spread({}, arg), {
            prop1: true
        }));
    }
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props(_object_spread({}, arg), {
            "ignore-prop": "hi"
        })); // U is number
        var a2 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _object_spread_props(_object_spread({}, arg), {
            "ignore-prop": 10
        })); // U is number
        var a3 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props(_object_spread({}, arg), {
            prop: "hello"
        })); // U is "hello"
        var a4 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props(_object_spread({}, arg), {
            prop1: "hello"
        })); // U is "hello"
    }
});
