//// [foo_0.ts]
define([
    "require"
], function(require) {
    return Foo;
});
//// [foo_1.ts]
define([
    "require"
], function(require) {
    var x;
    x("test"), x(42), x.b, x.c, x.d;
});
