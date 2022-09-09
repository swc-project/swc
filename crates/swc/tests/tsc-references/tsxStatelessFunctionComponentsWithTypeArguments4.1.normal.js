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
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, {
            a: arg1.b
        });
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, _extends({}, arg1, {
            "ignore-prop": true
        })) // missing a
        ;
    }
});
