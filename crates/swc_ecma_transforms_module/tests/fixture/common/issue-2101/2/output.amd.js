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
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        render: ()=>_customRender.customRender
    });
    _reExport(exports, _react);
});
