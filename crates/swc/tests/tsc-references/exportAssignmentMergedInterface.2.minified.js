//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    return Foo;
});
//// [foo_1.ts]
define([
    "require"
], function(require) {
    "use strict";
    var x;
    x("test"), x(42), x.b, x.c, x.d;
});
