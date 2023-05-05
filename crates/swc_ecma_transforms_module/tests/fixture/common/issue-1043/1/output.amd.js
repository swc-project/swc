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
        enumerable: true,
        get: function() {
            return _interfaces.Scope;
        }
    });
    _export_star(_http, exports);
});
