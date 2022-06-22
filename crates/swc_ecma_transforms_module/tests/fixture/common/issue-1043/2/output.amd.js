define([
    "require",
    "exports",
    "reflect-metadata",
    "./http",
    "./interfaces",
    "./pipes"
], function(require, exports, _reflectMetadata, _http, _interfaces, _pipes) {
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
    _exportStar(_http, exports);
    _exportStar(_pipes, exports);
});
