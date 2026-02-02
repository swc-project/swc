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
    // OK
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread_props._(_object_spread._({}, arg1), {
            a: "hello",
            "ignore-prop": true
        }));
        var a1 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread_props._(_object_spread._({}, arg2), {
            "ignore-pro": "hello world"
        }));
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, arg2);
        var a3 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread_props._(_object_spread._({}, arg1), {
            "ignore-prop": true
        }));
        var a4 = /*#__PURE__*/ _react.createElement(OverloadComponent, null);
        var a5 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread._(_object_spread_props._(_object_spread._({}, arg2), {
            "ignore-prop": "hello"
        }), arg1));
        var a6 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread._(_object_spread_props._(_object_spread._({}, arg2), {
            "ignore-prop": true
        }), arg1));
    }
    function createLink(func) {
        var o = /*#__PURE__*/ _react.createElement(Link, {
            func: func
        });
        var o1 = /*#__PURE__*/ _react.createElement(Link, {
            func: function func(a, b) {}
        });
    }
});
