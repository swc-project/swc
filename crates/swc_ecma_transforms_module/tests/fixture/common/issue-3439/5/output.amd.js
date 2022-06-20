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
        bar: function() {
            return foo;
        },
        default: function() {
            return foo;
        }
    });
    foo = 1;
    class foo {
    }
    foo = 2;
});
