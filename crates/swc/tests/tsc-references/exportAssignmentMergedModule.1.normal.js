//// [foo_0.ts]
"use strict";
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
module.exports = Foo;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("./foo_0");
var a = foo.a();
if (!!foo.b) {
    foo.Test.answer = foo.c(42);
}
