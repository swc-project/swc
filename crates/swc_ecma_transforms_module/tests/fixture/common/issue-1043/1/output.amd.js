define([
    "exports",
    "./http",
    "./interfaces"
], function(exports, _http, _interfaces) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Scope", {
        get: ()=>_interfaces.Scope,
        enumerable: true
    });
    _exportStar(_http, exports);
});
