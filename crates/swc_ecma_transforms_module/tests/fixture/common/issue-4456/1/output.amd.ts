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
        default: ()=>_default,
        cx: ()=>_css.cx,
        clsx: ()=>_css.cx,
        keyframes: ()=>_css.keyframes,
        breakpoints: ()=>breakpoints
    });
    _styled = _interopRequireDefault(_styled);
    interface IStyledProp {
        className?: string;
    }
    const breakpoints = _breakpoints.breakpoinstUtils;
    const styled = _styled.default;
    var _default = styled;
});
