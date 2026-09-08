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
    "./foo_0"
], function(require, foo) {
    "use strict";
    if (foo.answer === 42) {
        var x = foo();
    }
});
