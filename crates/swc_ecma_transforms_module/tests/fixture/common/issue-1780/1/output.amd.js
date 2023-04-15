define([
    "require",
    "exports",
    "./File1",
    "./File2"
], function(require, exports, _File1, _File2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "BIZ", {
        enumerable: true,
        get: function() {
            return BIZ;
        }
    });
    _export_star(_File1, exports);
    _export_star(_File2, exports);
    const BIZ = "biz";
});
