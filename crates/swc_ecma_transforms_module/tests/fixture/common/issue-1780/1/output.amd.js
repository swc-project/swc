define([
    "require",
    "exports",
    "./File1",
    "./File2"
], function(require, exports, _file_1, _file_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "BIZ", {
        enumerable: true,
        get: ()=>BIZ
    });
    _export_star(_file_1, exports);
    _export_star(_file_2, exports);
    const BIZ = "biz";
});
