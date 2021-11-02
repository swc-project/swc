// @module: commonjs
// @Filename: foo_0.ts
var Foo1;
(function(Foo) {
    var a = function a() {
        return 5;
    };
    Foo.a = a;
    Foo.b = true;
})(Foo1 || (Foo1 = {
}));
(function(Foo) {
    var c = function c(a) {
        return a;
    };
    Foo.c = c;
    var Test1;
    (function(Test) {
        Test.answer = 42;
    })(Test1 || (Test1 = {
    }));
    Foo.Test = Test1;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
// @Filename: foo_1.ts
var foo = require("./foo_0");
var a1 = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
export { };
