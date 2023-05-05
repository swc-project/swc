define([
    "require",
    "exports",
    "./customRender",
    "@testing-library/react"
], function(require, exports, _customRender, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "render", {
        enumerable: true,
        get: function() {
            return _customRender.customRender;
        }
    });
    _export_star(_react, exports);
});
