define([
    "require",
    "exports",
    "white",
    "black"
], function(require, exports, _white, _black) {
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
        named1: function() {
            return _white.named1;
        },
        named2: function() {
            return _black.named2;
        }
    });
});
