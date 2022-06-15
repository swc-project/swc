define([
    "require",
    "exports",
    "./files_with_swcrc/simple"
], function(require, _exports, _simple) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _export(_exports, {
        Foo: function() {
            return Foo;
        }
    });
    class Foo {
        static prop = _simple.a;
    }
});
