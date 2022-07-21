define([
    "require",
    "exports",
    "a",
    "b"
], function(require, exports, _a, _b) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        Aa: ()=>_a.A,
        Ab: ()=>_b.A
    });
});
