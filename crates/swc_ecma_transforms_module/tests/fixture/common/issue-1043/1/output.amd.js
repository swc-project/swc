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
        get: ()=>_interfaces.Scope
    });
    _exportStar(_http, exports);
});
