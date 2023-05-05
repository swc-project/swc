define([
    "require",
    "exports",
    "another-module"
], function(require, exports, _anothermodule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "whatever", {
        enumerable: true,
        get: function() {
            return whatever;
        }
    });
    _export_star(_anothermodule, exports);
    function whatever(notExportName) {
        const shouldNotBeExportNameAsWell = 123;
        return shouldNotBeExportNameAsWell + notExportName;
    }
});
