//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
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
    }), _object_spread._({
        to: 10000
    }, {
        children: "hi",
        to: "boo"
    }), _object_spread_props._(_object_spread._({}, obj1), {
        to: "/to/somewhere"
    });
});
