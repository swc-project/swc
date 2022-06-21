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
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        BIZ: ()=>BIZ
    });
    _reExport(exports, _file1);
    _reExport(exports, _file2);
    const BIZ = "biz";
});
