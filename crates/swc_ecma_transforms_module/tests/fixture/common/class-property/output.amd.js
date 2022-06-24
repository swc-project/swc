define([
    "exports",
    "./files_with_swcrc/simple"
], function(exports, _simple) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Foo", {
        get: ()=>Foo,
        enumerable: true
    });
    class Foo {
        static prop = _simple.a;
    }
});
