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
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    }), _object_spread = _object_spread.default, _object_spread_props = _object_spread_props.default;
    var obj3, obj0 = {
        to: "world"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _object_spread({
        onClick: function(e) {}
    }, obj0), _object_spread({
        to: "10000"
    }, {
        onClick: function() {}
    }), _object_spread_props(_object_spread({}, obj3), {
        to: !0
    }), _object_spread({
        onClick: function(e) {}
    }, obj0);
});
