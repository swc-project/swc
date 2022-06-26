import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Optional parameters should be valid in all the below casts
function foo(x) {}
var f = function foo(x) {};
var f2 = function(x, y) {};
foo(1);
foo();
f(1);
f();
f2(1);
f2(1, 2);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    return C;
}();
var c;
c.foo();
c.foo(1);
var i;
i();
i(1);
i.foo(1);
i.foo(1, 2);
var a;
a();
a(1);
a.foo();
a.foo(1);
var b = {
    foo: function foo(x) {},
    a: function foo(x, y) {},
    b: function(x) {}
};
b.foo();
b.foo(1);
b.a(1);
b.a(1, 2);
b.b();
b.b(1);
