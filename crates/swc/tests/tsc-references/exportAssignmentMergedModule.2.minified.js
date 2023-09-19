//// [foo_0.ts]
var Foo, Foo1, Foo2;
(Foo1 = Foo || (Foo = {})).a = function() {
    return 5;
}, Foo1.b = !0, (Foo2 = Foo || (Foo = {})).c = function(a) {
    return a;
}, (Foo2.Test || (Foo2.Test = {})).answer = 42, module.exports = Foo;
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
