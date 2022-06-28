define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        diff: ()=>diff,
        diffLevel: ()=>diffLevel
    });
    let diffLevel = 0;
    function diff() {
        if (!--diffLevel) {
            console.log("hey");
        }
    }
});
