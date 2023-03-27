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
    // Error
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, {
            a: arg1.b
        });
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, _object_spread_props(_object_spread({}, arg1), {
            "ignore-prop": true
        })) // missing a
        ;
    }
});
