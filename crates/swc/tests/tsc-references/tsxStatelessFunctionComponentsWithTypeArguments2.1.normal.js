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
    // Error
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _object_spread_props._(_object_spread._({}, arg), {
            "ignore-prop": 10
        }));
    }
    // Error
    function Baz(arg) {
        var a0 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, arg);
    }
    // Error
    function createLink(func) {
        var o = /*#__PURE__*/ _react.createElement(Link, {
            func: func
        });
    }
    // Error
    var i = /*#__PURE__*/ _react.createElement(InferParamComponent, {
        values: [
            1,
            2,
            3,
            4
        ],
        selectHandler: function selectHandler(val) {}
    });
});
