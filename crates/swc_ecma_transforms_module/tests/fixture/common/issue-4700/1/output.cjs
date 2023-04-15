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
_export_star(require("another-module"), exports);
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
