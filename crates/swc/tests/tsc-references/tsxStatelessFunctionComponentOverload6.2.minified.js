//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _objectSpread, _objectSpreadProps, _react) {
    "use strict";
    var obj1;
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    }), _objectSpread = _objectSpread.default, _objectSpreadProps = _objectSpreadProps.default, _objectSpread({
        to: 10000
    }, {
        children: "hi",
        to: "boo"
    }), _objectSpreadProps(_objectSpread({}, obj1), {
        to: "/to/somewhere"
    });
});
