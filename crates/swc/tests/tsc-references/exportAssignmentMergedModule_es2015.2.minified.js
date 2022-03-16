var Foo;
!function(Foo1) {
    Foo1.a = function() {
        return 5;
    }, Foo1.b = !0;
}(Foo || (Foo = {})), function(Foo2) {
    Foo2.c = function(a) {
        return a;
    }, (Foo2.Test || (Foo2.Test = {})).answer = 42;
}(Foo || (Foo = {})), module.exports = Foo;
const foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
export { };
