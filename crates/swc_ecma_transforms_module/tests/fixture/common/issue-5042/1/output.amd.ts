define([
    "require",
    "exports",
    "jquery"
], function(require, exports, _jquery) {
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
        $: ()=>_jquery,
        jquery: ()=>_jquery
    });
    _jquery(".hello");
});
