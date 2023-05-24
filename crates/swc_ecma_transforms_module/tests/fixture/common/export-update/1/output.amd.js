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
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        foo: function() {
            return foo;
        },
        bar: function() {
            return bar;
        },
        baz: function() {
            return baz;
        },
        bazbar: function() {
            return baz;
        },
        foobar: function() {
            return foo;
        }
    });
    let foo = 1n;
    foo++;
    let bar = ++foo;
    let baz = bar--;
    --bar;
});
