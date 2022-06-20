define([
    "require",
    "exports"
], function(require, exports) {
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
        good: function() {
            return good;
        }
    });
    const good = {
        a (bad1) {
            (...bad2)=>{};
        }
    };
});
