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
        a: function() {
            return a;
        },
        c: function() {
            return b;
        },
        e: function() {
            return d;
        },
        f: function() {
            return d;
        },
        test: function() {
            return test;
        }
    });
    var test = 2;
    test = 5;
    test++;
    (function() {
        var test = 2;
        test = 3;
        test++;
    })();
    var a = 2;
    a = 3;
    var b = 2;
    b = 3;
    var d = 3;
    d = 4;
});
