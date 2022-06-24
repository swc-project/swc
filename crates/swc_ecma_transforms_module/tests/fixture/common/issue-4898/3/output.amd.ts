define([], function() {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _assert(true);
    module Foo {
        define([
            "exports",
            "assert"
        ], function(exports, _assert) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            Object.defineProperty(exports, "Baz", {
                get: ()=>Baz,
                enumerable: true
            });
            const Baz = 42;
        });
    }
    console.log(Bar.Baz);
});
