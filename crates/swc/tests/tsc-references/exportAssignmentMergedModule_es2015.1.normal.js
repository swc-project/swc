// @module: commonjs
// @Filename: foo_0.ts
var Foo;
(function(Foo1) {
    function a() {
        return 5;
    }
    Foo1.a = a;
    var b = Foo1.b = true;
})(Foo || (Foo = {}));
(function(Foo2) {
    function c(a) {
        return a;
    }
    Foo2.c = c;
    let Test1;
    (function(Test) {
        var answer = Test.answer = 42;
    })(Test1 = Foo2.Test || (Foo2.Test = {}));
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
var a = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
export { };
