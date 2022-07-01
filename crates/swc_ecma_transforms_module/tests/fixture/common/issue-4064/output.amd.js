define([
    "require",
    "exports",
    "./File1",
    "./File2"
], function(require, exports, _file1, _file2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "BIZ", {
        enumerable: true,
        get: ()=>BIZ
    });
    _exportStar(_file1, exports);
    _exportStar(_file2, exports);
    const BIZ = "biz";
});
