//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var Foo;
    (function(Foo) {
        var answer = Foo.answer = 42;
    })(Foo || (Foo = {}));
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    if (_foo0.answer === 42) {}
});
