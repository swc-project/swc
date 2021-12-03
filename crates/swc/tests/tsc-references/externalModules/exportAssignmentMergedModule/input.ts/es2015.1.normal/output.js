// @module: commonjs
// @Filename: foo_0.ts
var Foo;
(function(Foo1) {
    function a1() {
        return 5;
    }
    Foo1.a = a1;
    Foo1.b = true;
})(Foo || (Foo = {
}));
(function(Foo2) {
    function c(a2) {
        return a2;
    }
    Foo2.c = c;
    let Test1;
    (function(Test) {
        Test.answer = 42;
    })(Test1 || (Test1 = {
    }));
    Foo2.Test = Test1;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
var a = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
export { };
