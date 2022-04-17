var Foo;
!function(Foo1) {
    function a() {
        return 5;
    }
    Foo1.a = a, Foo1.b = !0;
}(Foo || (Foo = {})), function(Foo2) {
    function c(a) {
        return a;
    }
    Foo2.c = c, (Foo2.Test || (Foo2.Test = {})).answer = 42;
}(Foo || (Foo = {})), module.exports = Foo;
let foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
export { };
