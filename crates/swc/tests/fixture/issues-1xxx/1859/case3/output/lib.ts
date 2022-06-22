"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
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
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
_exportStar(require("./foo"), exports);
_exportStar(require("./bar"), exports);
