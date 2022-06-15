define([
    "require",
    "exports",
    "./Z"
], function(require, exports, _z) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        X: function() {
            return _z.default;
        },
        X2: function() {
            return _z.X2;
        },
        Y: function() {
            return _z.Y;
        }
    });
    _reExport(exports, _z);
});
