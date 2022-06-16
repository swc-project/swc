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
    _styled = _interopRequireDefault(_styled);
    const breakpoints = _breakpoints.breakpoinstUtils;
    const styled = _styled.default;
    var _default = styled;
});
