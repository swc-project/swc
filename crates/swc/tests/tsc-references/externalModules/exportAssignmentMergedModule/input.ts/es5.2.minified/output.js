var Foo, Foo;
(Foo = Foo || (Foo = {
})).a = function() {
    return 5;
}, Foo.b = !0, (function(Foo) {
    var Test, Test;
    Foo.c = function(a) {
        return a;
    }, (Test = Test || (Test = {
    })).answer = 42, Foo.Test = Test;
})(Foo || (Foo = {
})), module.exports = Foo;
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
export { };
