"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export(exports, {
    whatever: function() {
        return whatever;
    }
});
_reExport(exports, require("another-module"));
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
