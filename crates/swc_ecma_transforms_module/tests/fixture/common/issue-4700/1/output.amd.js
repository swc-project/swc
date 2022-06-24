define([
    "exports",
    "another-module"
], function(exports, _anotherModule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "whatever", {
        get: ()=>whatever,
        enumerable: true
    });
    _exportStar(_anotherModule, exports);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
