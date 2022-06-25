define([
    "require"
], function(require) {
    "use strict";
    _assert(true);
    module Foo {
        define([
            "require",
            "exports",
            "assert"
        ], function(require, exports, _assert) {
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
