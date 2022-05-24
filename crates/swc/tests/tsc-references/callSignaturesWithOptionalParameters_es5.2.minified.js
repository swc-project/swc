import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function foo(x) {}
var c, i, a, f = function(x) {}, f2 = function(x, y) {};
foo(1), foo(), f(1), f(), f2(1), f2(1, 2);
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}();
c.foo(), c.foo(1), i(), i(1), i.foo(1), i.foo(1, 2), a(), a(1), a.foo(), a.foo(1);
var b = {
    foo: function(x) {},
    a: function(x, y) {},
    b: function(x) {}
};
b.foo(), b.foo(1), b.a(1), b.a(1, 2), b.b(), b.b(1);
