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
    var obj3, obj0 = {
        to: "world"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _extends({
        onClick: function(e) {}
    }, obj0), _extends({}, {
        to: "10000"
    }, {
        onClick: function() {}
    }), _extends({}, {
        to: "10000"
    }, {
        onClick: function(k) {}
    }), _extends({}, obj3, {
        to: !0
    }), _extends({}, {
        onClick: function(e) {}
    }, obj0), _extends({}, {
        onClick: function(e) {}
    }, {
        children: 10
    }), _extends({}, {
        onClick: function(e) {}
    }, {
        children: "hello",
        className: !0
    });
});
