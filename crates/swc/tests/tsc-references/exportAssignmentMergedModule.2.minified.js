//// [foo_0.ts]
var Foo, Foo1, Foo2, Test;
Foo1 = Foo || (Foo = {}), Foo1.a = function() {
    return 5;
}, Foo1.b = !0, Foo2 = Foo || (Foo = {}), Foo2.c = function(a) {
    return a;
}, Test = Foo2.Test || (Foo2.Test = {}), Test.answer = 42, module.exports = Foo;
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
