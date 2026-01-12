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
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    var color;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), color === _foo_0.green && (color = _foo_0.answer);
});
