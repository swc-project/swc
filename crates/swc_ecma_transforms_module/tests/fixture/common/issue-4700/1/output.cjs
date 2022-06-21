"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "whatever", {
    get: ()=>whatever,
    enumerable: true
});
_reExport(exports, require("another-module"));
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
