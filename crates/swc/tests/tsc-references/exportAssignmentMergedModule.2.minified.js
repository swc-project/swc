//// [foo_0.ts]
var Foo, Foo1, b, Foo2, Test, answer;
(Foo1 = Foo || (Foo = {})).a = function() {
    return 5;
}, b = !0, Object.defineProperty(Foo1, "b", {
    enumerable: !0,
    get: function() {
        return b;
    },
    set: function(v) {
        b = v;
    }
}), (Foo2 = Foo || (Foo = {})).c = function(a) {
    return a;
}, Test = Foo2.Test || (Foo2.Test = {}), answer = 42, Object.defineProperty(Test, "answer", {
    enumerable: !0,
    get: function() {
        return answer;
    },
    set: function(v) {
        answer = v;
    }
}), module.exports = Foo;
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
