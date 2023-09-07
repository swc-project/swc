//// [foo_0.ts]
define([
    "require"
], function(require) {
    var foo, foo1, answer;
    foo1 = foo || (foo = {}), answer = 42, Object.defineProperty(foo1, "answer", {
        enumerable: !0,
        get: function() {
            return answer;
        },
        set: function(v) {
            answer = v;
        }
    });
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
