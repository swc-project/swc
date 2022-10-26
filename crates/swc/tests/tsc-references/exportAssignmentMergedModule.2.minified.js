//// [foo_0.ts]
"use strict";
var Foo;
!function(Foo) {
    Foo.a = function() {
        return 5;
    }, Foo.b = !0;
}(Foo || (Foo = {})), function(Foo) {
    Foo.c = function(a) {
        return a;
    }, (Foo.Test || (Foo.Test = {})).answer = 42;
}(Foo || (Foo = {})), module.exports = Foo;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0");
foo.a(), foo.b && (foo.Test.answer = foo.c(42));
