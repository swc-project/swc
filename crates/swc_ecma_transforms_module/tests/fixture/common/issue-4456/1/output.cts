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
    breakpoints: function() {
        return breakpoints;
    },
    clsx: function() {
        return _css.cx;
    },
    cx: function() {
        return _css.cx;
    },
    default: function() {
        return _default;
    },
    keyframes: function() {
        return _css.keyframes;
    }
});
require(".");
const _styled = /*#__PURE__*/ _interop_require_default(require("@emotion/styled"));
const _breakpoints = require("@eduzz/houston-tokens/variables/breakpoints");
const _css = require("@emotion/css");
const breakpoints = _breakpoints.breakpoinstUtils;
const styled = _styled.default;
const _default = styled;
