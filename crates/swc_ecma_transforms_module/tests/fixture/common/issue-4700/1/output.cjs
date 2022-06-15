"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
__export(exports, {
    whatever: function() {
        return whatever;
    }
});
__reExport(exports, require("another-module"));
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
