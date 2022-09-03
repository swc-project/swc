//// [foo_0.ts]
"use strict";
var Foo;
!function(Foo) {
    var a = function() {
        return 5;
    };
    Foo.a = a, Foo.b = !0;
}(Foo || (Foo = {})), function(Foo) {
    var c = function(a) {
        return a;
    };
    Foo.c = c, (Foo.Test || (Foo.Test = {})).answer = 42;
}(Foo || (Foo = {})), module.exports = Foo;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0"), a = foo.a();
foo.b && (foo.Test.answer = foo.c(42));
