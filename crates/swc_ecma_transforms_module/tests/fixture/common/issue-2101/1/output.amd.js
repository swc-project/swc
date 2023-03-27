define([
    "require",
    "exports",
    "./customRender",
    "@testing-library/react"
], function(require, exports, _custom_render, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "render", {
        enumerable: true,
        get: ()=>_custom_render.customRender
    });
    _export_star(_react, exports);
});
