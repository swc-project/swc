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
    _export(_exports, {
        render: function() {
            return _customRender.customRender;
        }
    });
    _reExport(_exports, _react);
});
