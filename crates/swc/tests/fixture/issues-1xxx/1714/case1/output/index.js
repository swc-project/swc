"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "render", {
    get: function() {
        return _customRender.customRender;
    },
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
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _customRender = require("./customRender");
_exportStar(require("@testing-library/react"), exports);
