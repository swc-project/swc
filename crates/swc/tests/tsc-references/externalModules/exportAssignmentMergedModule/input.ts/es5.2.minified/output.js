var Foo2, Foo1;
(Foo1 = Foo2 || (Foo2 = {
})).a = function() {
    return 5;
}, Foo1.b = !0, (function(Foo) {
    var Test;
    Foo.c = function(a) {
        return a;
    }, (Test || (Test = {
    })).answer = 42, Foo.Test = Test;
})(Foo2 || (Foo2 = {
})), module.exports = Foo2;
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
export { };
