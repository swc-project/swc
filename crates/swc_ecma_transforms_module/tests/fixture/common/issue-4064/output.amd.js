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
        get: ()=>BIZ,
        enumerable: true
    });
    _reExport(exports, _file1);
    _reExport(exports, _file2);
    const BIZ = "biz";
});
