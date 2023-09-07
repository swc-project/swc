//// [foo_0.ts]
"use strict";
var Foo;
(function(Foo) {
    var a = function a() {
        return 5;
    };
    Foo.a = a;
    var b = true;
    Object.defineProperty(Foo, "b", {
        enumerable: true,
        get: function get() {
            return b;
        },
        set: function set(v) {
            b = v;
        }
    });
})(Foo || (Foo = {}));
(function(Foo) {
    var c = function c(a) {
        return a;
    };
    Foo.c = c;
    var Test;
    (function(Test) {
        var answer = 42;
        Object.defineProperty(Test, "answer", {
            enumerable: true,
            get: function get() {
                return answer;
            },
            set: function set(v) {
                answer = v;
            }
        });
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
