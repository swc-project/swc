//// [foo_0.ts]
define([
    "require"
], function(require) {
    var foo, foo1, foo2, answer;
    return (foo1 = foo || (foo = {}))[foo1.red = 0] = "red", foo1[foo1.green = 1] = "green", foo1[foo1.blue = 2] = "blue", foo2 = foo || (foo = {}), answer = 42, Object.defineProperty(foo2, "answer", {
        enumerable: !0,
        get: function() {
            return answer;
        },
        set: function(v) {
            answer = v;
        }
    }), foo;
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
