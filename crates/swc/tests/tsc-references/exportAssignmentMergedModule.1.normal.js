//// [foo_0.ts]
"use strict";
var Foo;
(function(Foo) {
    function a() {
        return 5;
    }
    Foo.a = a;
    Foo.b = true;
})(Foo || (Foo = {}));
(function(Foo) {
    function c(a) {
        return a;
    }
    Foo.c = c;
    var Test;
    (function(Test) {
        Test.answer = 42;
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
