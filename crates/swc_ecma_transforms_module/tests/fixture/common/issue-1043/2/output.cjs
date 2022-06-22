"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "id", {
    get: ()=>_interfaces.id,
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
require("reflect-metadata");
_exportStar(require("./http"), exports);
const _interfaces = require("./interfaces");
_exportStar(require("./pipes"), exports);
