//// [foo_0.ts]
"use strict";
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
    (function(Test) {
        Test.answer = 42;
    })(Foo.Test || (Foo.Test = {}));
})(Foo || (Foo = {}));
var Foo;
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
