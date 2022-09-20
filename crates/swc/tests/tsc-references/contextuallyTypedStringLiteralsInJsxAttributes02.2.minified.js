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
    });
    !function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        MainButton: function() {
            return MainButton;
        },
        NoOverload: function() {
            return NoOverload;
        },
        NoOverload1: function() {
            return NoOverload1;
        }
    });
    _extends = _extends.default;
    function MainButton(props) {
        return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    _extends({}, {
        onClick: function(k) {
            console.log(k);
        }
    }, {
        extra: !0
    });
    _extends({}, {
        goTo: "home"
    }, {
        extra: !0
    });
    function NoOverload(buttonProps) {}
    _extends({}, {
        onClick: function(k) {
            console.log(k);
        }
    }, {
        extra: !0
    });
    function NoOverload1(linkProps) {}
    _extends({}, {
        goTo: "home"
    }, {
        extra: !0
    });
});
