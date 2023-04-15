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
require(".");
const _styled = /*#__PURE__*/ _interop_require_default(require("@emotion/styled"));
const _breakpoints = require("@eduzz/houston-tokens/variables/breakpoints");
const _css = require("@emotion/css");
interface IStyledProp {
    className?: string;
}
const breakpoints = _breakpoints.breakpoinstUtils;
const styled = _styled.default;
const _default = styled;
