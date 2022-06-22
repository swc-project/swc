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
    _styled = _interopRequireDefault(_styled);
    const breakpoints = _breakpoints.breakpoinstUtils;
    const styled = _styled.default;
    var _default = styled;
});
