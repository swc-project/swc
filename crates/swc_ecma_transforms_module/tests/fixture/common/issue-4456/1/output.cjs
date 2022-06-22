"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    breakpoints: ()=>breakpoints,
    clsx: ()=>_css.cx,
    cx: ()=>_css.cx,
    default: ()=>_default,
    keyframes: ()=>_css.keyframes
});
require(".");
const _styled = _interopRequireDefault(require("@emotion/styled"));
const _breakpoints = require("@eduzz/houston-tokens/variables/breakpoints");
const _css = require("@emotion/css");
const breakpoints = _breakpoints.breakpoinstUtils;
const styled = _styled.default;
var _default = styled;
