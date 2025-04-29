"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get breakpoints () {
        return breakpoints;
    },
    get clsx () {
        return _css.cx;
    },
    get cx () {
        return _css.cx;
    },
    get default () {
        return _default;
    },
    get keyframes () {
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
