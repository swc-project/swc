//// [foo_0.ts]
define([
    "require"
], function(require) {
    var foo;
    (foo || (foo = {})).answer = 42;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_0"
], function(require, foo) {
    foo.answer;
});
