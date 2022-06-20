define([
    "require",
    "exports",
    "./files_with_swcrc/simple"
], function(require, exports, _simple) {
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
        Foo: function() {
            return Foo;
        }
    });
    class Foo {
        static prop = _simple.a;
    }
});
