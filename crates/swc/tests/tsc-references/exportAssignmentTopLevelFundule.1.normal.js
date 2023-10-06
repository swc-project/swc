//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    function foo() {
        return "test";
    }
    (function(foo) {
        foo.answer = 42;
    })(foo || (foo = {}));
    return foo;
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
    if (_foo_0.answer === 42) {
        var x = _foo_0();
    }
});
