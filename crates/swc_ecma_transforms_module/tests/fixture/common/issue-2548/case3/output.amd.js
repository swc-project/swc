define([
    "require",
    "exports",
    "./Z"
], function(require, exports, _z) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        X: ()=>_z.default,
        X2: ()=>_z.X2,
        Y: ()=>_z.Y
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
    _z = _interopRequireWildcard(_exportStar(_z, exports));
});
