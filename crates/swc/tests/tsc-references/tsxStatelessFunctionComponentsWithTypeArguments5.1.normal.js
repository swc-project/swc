//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function createComponent(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(Component, arg);
        var a2 = /*#__PURE__*/ _react.createElement(Component, _object_spread_props._(_object_spread._({}, arg), {
            prop1: true
        }));
    }
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props._(_object_spread._({}, arg), {
            "ignore-prop": "hi"
        })); // U is number
        var a2 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _object_spread_props._(_object_spread._({}, arg), {
            "ignore-prop": 10
        })); // U is number
        var a3 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props._(_object_spread._({}, arg), {
            prop: "hello"
        })); // U is "hello"
        var a4 = /*#__PURE__*/ _react.createElement(ComponentSpecific, _object_spread_props._(_object_spread._({}, arg), {
            prop1: "hello"
        })); // U is "hello"
    }
});
