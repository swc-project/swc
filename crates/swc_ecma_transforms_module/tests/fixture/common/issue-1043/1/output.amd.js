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
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        Scope: ()=>_interfaces.Scope
    });
    _reExport(exports, _http);
});
