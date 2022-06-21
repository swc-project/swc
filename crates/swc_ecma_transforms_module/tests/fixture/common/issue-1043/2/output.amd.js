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
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        id: ()=>_interfaces.id
    });
    _reExport(exports, _http);
    _reExport(exports, _pipes);
});
