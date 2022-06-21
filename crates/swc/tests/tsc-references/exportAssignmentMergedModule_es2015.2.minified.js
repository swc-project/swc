var Foo;
!function(Foo) {
    function a() {
        return 5;
    }
    Foo.a = a, Foo.b = !0;
}(Foo || (Foo = {})), function(Foo) {
    function c(a) {
        return a;
    }
    Foo.c = c, (Foo.Test || (Foo.Test = {})).answer = 42;
}(Foo || (Foo = {}));
let foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42)), module.exports = Foo;
export { };
