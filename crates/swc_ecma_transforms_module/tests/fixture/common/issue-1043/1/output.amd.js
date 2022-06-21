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
    _reExport(exports, _http);
});
