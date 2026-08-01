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
    "./foo_0"
], function(require, foo) {
    "use strict";
    if (foo.answer === 42) {}
});
