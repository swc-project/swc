// @module: commonjs
// @Filename: foo_0.ts
var Foo;
(function(Foo) {
    var a = function a() {
        return 5;
    };
    Foo.a = a;
    Foo.b = true;
})(Foo || (Foo = {
}));
(function(Foo) {
    var c = function c(a) {
        return a;
    };
    Foo.c = c;
    var Test;
    (function(Test) {
        Test.answer = 42;
    })(Test || (Test = {
    }));
    Foo.Test = Test;
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
