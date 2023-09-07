//// [foo_0.ts]
define([
    "require"
], function(require) {
    var Foo, Foo1, answer;
    return Foo1 = Foo || (Foo = {}), answer = 42, Object.defineProperty(Foo1, "answer", {
        enumerable: !0,
        get: function() {
            return answer;
        },
        set: function(v) {
            answer = v;
        }
    }), Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _foo_0.answer;
});
