//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    (function(foo) {
        foo.answer = 42;
    })(foo || (foo = {}));
    var foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_0"
], function(require, foo) {
    "use strict";
    // Import should fail.  foo_0 not an external module
    if (foo.answer === 42) {}
});
