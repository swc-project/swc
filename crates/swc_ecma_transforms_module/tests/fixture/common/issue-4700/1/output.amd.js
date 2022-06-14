define([
    "require",
    "exports",
    "another-module"
], function(require, _exports, _anotherModule) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    __export(_exports, {
        whatever: function() {
            return whatever;
        }
    });
    __reExport(_exports, _anotherModule);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
