define([
    "require",
    "exports",
    "./files_with_swcrc/simple"
], function(require, exports, _simple) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        Foo: function() {
            return Foo;
        }
    });
    class Foo {
        static prop = _simple.a;
    }
});
