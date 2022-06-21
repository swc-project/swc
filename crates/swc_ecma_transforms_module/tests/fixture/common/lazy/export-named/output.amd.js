define([
    "require",
    "exports",
    "external"
], function(require, exports, _external) {
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
        named1: ()=>_external.named1
    });
});
