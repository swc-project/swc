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
    default: ()=>_default,
    cx: ()=>_css.cx,
    clsx: ()=>_css.cx,
    keyframes: ()=>_css.keyframes,
    breakpoints: ()=>breakpoints
});
require(".");
const _styled = _interopRequireDefault(require("@emotion/styled"));
const _breakpoints = require("@eduzz/houston-tokens/variables/breakpoints");
const _css = require("@emotion/css");
interface IStyledProp {
    className?: string;
}
const breakpoints = _breakpoints.breakpoinstUtils;
const styled = _styled.default;
var _default = styled;
