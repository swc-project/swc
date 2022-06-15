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
    _export(exports, {
        render: function() {
            return _customRender.customRender;
        }
    });
    _reExport(exports, _react);
});
