define([
    "require",
    "exports",
    "./http",
    "./interfaces"
], function(require, exports, _http, _interfaces) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Scope", {
        get: ()=>_interfaces.Scope,
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
});
