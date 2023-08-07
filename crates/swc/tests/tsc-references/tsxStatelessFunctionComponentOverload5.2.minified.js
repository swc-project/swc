//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    });
    var obj3, obj0 = {
        to: "world"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _object_spread._({
        onClick: function(e) {}
    }, obj0), _object_spread._({
        to: "10000"
    }, {
        onClick: function() {}
    }), _object_spread_props._(_object_spread._({}, obj3), {
        to: !0
    }), _object_spread._({
        onClick: function(e) {}
    }, obj0);
});
