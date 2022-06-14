define([
    "require",
    "exports",
    "./customRender",
    "@testing-library/react"
], function(require, _exports, _customRender, _react) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    __export(_exports, {
        render: function() {
            return _customRender.customRender;
        }
    });
    __reExport(_exports, _react);
});
