define([
    "require",
    "exports",
    "another-module"
], function(require, exports, _another_module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "whatever", {
        enumerable: true,
        get: ()=>whatever
    });
    _export_star(_another_module, exports);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
