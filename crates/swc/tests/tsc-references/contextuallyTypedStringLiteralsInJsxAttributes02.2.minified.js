//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    function MainButton(props) {
        return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    function NoOverload(buttonProps) {}
    function NoOverload1(linkProps) {}
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
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
});
