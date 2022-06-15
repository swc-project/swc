define([
    "require",
    "exports",
    "another-module"
], function(require, exports, _anotherModule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        whatever: function() {
            return whatever;
        }
    });
    _reExport(exports, _anotherModule);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
