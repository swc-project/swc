// @module: commonjs
// @Filename: foo_0.ts
var Foo;
(function(Foo1) {
    var a = function a() {
        return 5;
    };
    Foo1.a = a;
    Foo1.b = true;
})(Foo || (Foo = {
}));
(function(Foo2) {
    var c = function c(a) {
        return a;
    };
    Foo2.c = c;
    var Test1;
    (function(Test) {
        Test.answer = 42;
    })(Test1 || (Test1 = {
    }));
    Foo2.Test = Test1;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
var a1 = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
export { };
