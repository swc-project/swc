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
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    }), _objectSpread = _objectSpread.default, _objectSpreadProps = _objectSpreadProps.default;
    var obj3, obj0 = {
        to: "world"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _objectSpread({
        onClick: function(e) {}
    }, obj0), _objectSpread({
        to: "10000"
    }, {
        onClick: function() {}
    }), _objectSpreadProps(_objectSpread({}, obj3), {
        to: !0
    }), _objectSpread({
        onClick: function(e) {}
    }, obj0);
});
