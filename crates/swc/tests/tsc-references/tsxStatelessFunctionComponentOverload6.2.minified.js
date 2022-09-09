//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_extends.mjs",
    "react"
], function(require, exports, _extends, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    }), _extends = _extends.default;
    var obj1, obj = {
        children: "hi",
        to: "boo"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _extends({}, obj), _extends({}, {
        to: 10000
    }, obj), _extends({}, obj1), _extends({}, obj1, {
        to: "/to/somewhere"
    }), _extends({}, {
        onClick: function() {}
    }), _extends({}, {
        onClick: function() {
            console.log("hi");
        }
    }), _extends({}, {
        onClick: function() {}
    });
});
