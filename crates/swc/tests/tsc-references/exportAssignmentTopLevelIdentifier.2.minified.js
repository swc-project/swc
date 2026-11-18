//// [foo_0.ts]
define([
    "require"
], function(require) {
    var Foo;
    return (Foo || (Foo = {})).answer = 42, Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_0"
], function(require, foo) {
    foo.answer;
});
