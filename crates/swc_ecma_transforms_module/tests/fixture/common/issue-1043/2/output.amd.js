define([
    "require",
    "exports",
    "reflect-metadata",
    "./http",
    "./interfaces",
    "./pipes"
], function(require, exports, _reflectmetadata, _http, _interfaces, _pipes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "id", {
        enumerable: true,
        get: function() {
            return _interfaces.id;
        }
    });
    _export_star(_http, exports);
    _export_star(_pipes, exports);
});
