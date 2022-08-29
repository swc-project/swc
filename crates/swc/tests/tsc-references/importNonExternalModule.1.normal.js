//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var foo;
    (function(foo) {
        var answer = foo.answer = 42;
    })(foo || (foo = {}));
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
    // Import should fail.  foo_0 not an external module
    if (_foo0.answer === 42) {}
});
