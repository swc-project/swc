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
    // Error
    function Bar(arg) {
        var a1 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _extends({}, arg, {
            "ignore-prop": 10
        }));
    }
    // Error
    function Baz(arg) {
        var a0 = /*#__PURE__*/ _react.createElement(ComponentSpecific1, _extends({}, arg));
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
        selectHandler: function(val) {}
    });
});
