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
    _exportStar(_http, exports);
    _exportStar(_pipes, exports);
});
