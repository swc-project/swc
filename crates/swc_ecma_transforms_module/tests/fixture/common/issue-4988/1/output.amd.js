define([
    "require",
    "exports",
    "jquery"
], function(require, exports, _jquery) {
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
        "$": function() {
            return _jquery;
        },
        jquery: function() {
            return _jquery;
        }
    });
    _jquery(".hello");
});
