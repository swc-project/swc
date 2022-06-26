// @module: commonjs
// @Filename: foo_0.ts
var Foo;
(function(Foo) {
    var a = function a() {
        return 5;
    };
    Foo.a = a;
    var b = Foo.b = true;
})(Foo || (Foo = {}));
(function(Foo) {
    var c = function c(a) {
        return a;
    };
    Foo.c = c;
    var Test;
    (function(Test) {
        var answer = Test.answer = 42;
    })(Test = Foo.Test || (Foo.Test = {}));
})(Foo || (Foo = {}));
// @Filename: foo_1.ts
var foo = require("./foo_0");
var a = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
module.exports = Foo;
export { };
