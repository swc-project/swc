var Foo, Foo1;
(Foo1 = Foo || (Foo = {
})).a = function() {
    return 5;
}, Foo1.b = !0, (function(Foo2) {
    var Test;
    Foo2.c = function(a) {
        return a;
    }, (Test || (Test = {
    })).answer = 42, Foo2.Test = Test;
})(Foo || (Foo = {
})), module.exports = Foo;
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
export { };
