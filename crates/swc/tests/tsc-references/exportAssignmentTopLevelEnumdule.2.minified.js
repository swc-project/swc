//// [foo_0.ts]
define([
    "require"
], function(require) {
    var foo, foo1 = ((foo = foo1 || {})[foo.red = 0] = "red", foo[foo.green = 1] = "green", foo[foo.blue = 2] = "blue", foo);
    return (foo1 || (foo1 = {})).answer = 42, foo1;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_0"
], function(require, foo) {
    var color;
    color === foo.green && (color = foo.answer);
});
