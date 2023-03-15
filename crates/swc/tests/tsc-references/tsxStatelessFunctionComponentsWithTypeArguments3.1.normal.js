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
    // OK
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpreadProps(_objectSpread({}, arg1), {
            a: "hello",
            "ignore-prop": true
        }));
        var a1 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpreadProps(_objectSpread({}, arg2), {
            "ignore-pro": "hello world"
        }));
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, arg2);
        var a3 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpreadProps(_objectSpread({}, arg1), {
            "ignore-prop": true
        }));
        var a4 = /*#__PURE__*/ _react.createElement(OverloadComponent, null);
        var a5 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpread(_objectSpreadProps(_objectSpread({}, arg2), {
            "ignore-prop": "hello"
        }), arg1));
        var a6 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpread(_objectSpreadProps(_objectSpread({}, arg2), {
            "ignore-prop": true
        }), arg1));
    }
    function createLink(func) {
        var o = /*#__PURE__*/ _react.createElement(Link, {
            func: func
        });
        var o1 = /*#__PURE__*/ _react.createElement(Link, {
            func: function(a, b) {}
        });
    }
});
