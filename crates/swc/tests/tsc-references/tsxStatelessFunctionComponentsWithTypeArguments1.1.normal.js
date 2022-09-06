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
    // OK
    function Baz(key1, value) {
        var a0 = /*#__PURE__*/ _react.createElement(ComponentWithTwoAttributes, {
            key1: key1,
            value: value
        });
        var a1 = /*#__PURE__*/ _react.createElement(ComponentWithTwoAttributes, _extends({}, {
            key1: key1,
            value: value
        }, {
            key: "Component"
        }));
    }
    // OK
    function createLink(func) {
        var o = /*#__PURE__*/ _react.createElement(Link, {
            func: func
        });
    }
    function createLink1(func) {
        var o = /*#__PURE__*/ _react.createElement(Link, {
            func: func
        });
    }
    // OK
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
