//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    (function(Foo) {
        Foo.answer = 42;
    })(Foo || (Foo = {}));
    var Foo;
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    if (_foo_0.answer === 42) {}
});
