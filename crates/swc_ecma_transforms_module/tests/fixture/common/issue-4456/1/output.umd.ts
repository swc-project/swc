(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("."), require("@emotion/styled"), require("@eduzz/houston-tokens/variables/breakpoints"), require("@emotion/css"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        ".",
        "@emotion/styled",
        "@eduzz/houston-tokens/variables/breakpoints",
        "@emotion/css"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global[""], global.styled, global.breakpoints, global.css);
})(this, function(exports, _, _styled, _breakpoints, _css) {
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
        breakpoints: ()=>breakpoints,
        clsx: ()=>_css.cx,
        cx: ()=>_css.cx,
        default: ()=>_default,
        keyframes: ()=>_css.keyframes
    });
    _styled = _interopRequireDefault(_styled);
    interface IStyledProp {
        className?: string;
    }
    const breakpoints = _breakpoints.breakpoinstUtils;
    const styled = _styled.default;
    var _default = styled;
});
