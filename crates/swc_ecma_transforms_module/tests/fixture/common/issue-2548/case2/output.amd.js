define([
    "require",
    "exports",
    "./Z"
], function(require, exports, _z) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "X", {
        get: ()=>_z.default,
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
    _z = _interopRequireDefault(_exportStar(_z, exports));
});
