define([
    "require",
    "exports",
    "another-module"
], function(require, exports, _anotherModule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "whatever", {
        get: ()=>whatever,
        enumerable: true
    });
    _reExport(exports, _anotherModule);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
