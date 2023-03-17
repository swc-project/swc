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
    // Error
    function Baz(arg1, arg2) {
        var a0 = /*#__PURE__*/ _react.createElement(OverloadComponent, {
            a: arg1.b
        });
        var a2 = /*#__PURE__*/ _react.createElement(OverloadComponent, _objectSpreadProps(_objectSpread({}, arg1), {
            "ignore-prop": true
        })) // missing a
        ;
    }
});
