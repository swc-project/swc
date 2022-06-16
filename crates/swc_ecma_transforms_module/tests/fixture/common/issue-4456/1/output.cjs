"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
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
var _styled = _interopRequireDefault(require("@emotion/styled"));
var _breakpoints = require("@eduzz/houston-tokens/variables/breakpoints");
var _css = require("@emotion/css");
const breakpoints = _breakpoints.breakpoinstUtils;
const styled = _styled.default;
var _default = styled;
