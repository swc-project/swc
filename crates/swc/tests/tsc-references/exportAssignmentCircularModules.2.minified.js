//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, _foo_1) {
    var Foo;
    return (Foo = {}).x = _foo_1.x, Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, _foo_2) {
    var Foo;
    return (Foo = {}).x = _foo_2.x, Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, _foo_0) {
    var Foo;
    return (Foo = {}).x = _foo_0.x, Foo;
});
