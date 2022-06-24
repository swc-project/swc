define([
    "exports",
    "./customRender",
    "@testing-library/react"
], function(exports, _customRender, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "render", {
        get: ()=>_customRender.customRender,
        enumerable: true
    });
    _exportStar(_react, exports);
});
