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
        enumerable: true,
        get: ()=>whatever
    });
    _exportStar(_anotherModule, exports);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
