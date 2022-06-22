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
    function _exportStar(from, to) {
        Object.keys(from).forEach(function(k) {
            if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
                get: function() {
                    return from[k];
                },
                enumerable: true
            });
        });
        return from;
    }
    _exportStar(_file1, exports);
    _exportStar(_file2, exports);
    const BIZ = "biz";
});
