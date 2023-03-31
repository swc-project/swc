//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
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
    }), _object_spread = _object_spread.default, _object_spread_props = _object_spread_props.default, _object_spread({
        to: 10000
    }, {
        children: "hi",
        to: "boo"
    }), _object_spread_props(_object_spread({}, obj1), {
        to: "/to/somewhere"
    });
});
