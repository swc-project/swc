//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var all = {
        MainButton: function() {
            return MainButton;
        },
        NoOverload: function() {
            return NoOverload;
        },
        NoOverload1: function() {
            return NoOverload1;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: all[name]
    });
    function MainButton(props) {
        return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    function NoOverload(buttonProps) {}
    function NoOverload1(linkProps) {}
});
