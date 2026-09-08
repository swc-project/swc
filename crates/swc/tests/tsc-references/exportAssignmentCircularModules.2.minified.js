//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, foo1) {
    var Foo;
    return (Foo || (Foo = {})).x = foo1.x, Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, foo2) {
    var Foo;
    return (Foo || (Foo = {})).x = foo2.x, Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, foo0) {
    var Foo;
    return (Foo || (Foo = {})).x = foo0.x, Foo;
});
