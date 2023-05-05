define([
    "require",
    "exports",
    ".",
    "@emotion/styled",
    "@eduzz/houston-tokens/variables/breakpoints",
    "@emotion/css"
], function(require, exports, _, _styled, _breakpoints, _css) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        cx: function() {
            return _css.cx;
        },
        clsx: function() {
            return _css.cx;
        },
        keyframes: function() {
            return _css.keyframes;
        },
        breakpoints: function() {
            return breakpoints;
        },
        default: function() {
            return _default;
        }
    });
    _styled = /*#__PURE__*/ _interop_require_default(_styled);
    interface IStyledProp {
        className?: string;
    }
    const breakpoints = _breakpoints.breakpoinstUtils;
    const styled = _styled.default;
    const _default = styled;
});
