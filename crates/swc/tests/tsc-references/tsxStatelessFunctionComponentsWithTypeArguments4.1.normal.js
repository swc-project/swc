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
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, {
            a: arg1.b
        });
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread_props._(_object_spread._({}, arg1), {
            "ignore-prop": true
        })) // missing a
        ;
    }
});
