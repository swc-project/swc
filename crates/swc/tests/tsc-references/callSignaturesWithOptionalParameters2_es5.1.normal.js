import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {}
foo(1);
foo();
function foo2(x, y) {}
foo2(1);
foo2(1, 2);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    _proto.foo2 = function foo2(x, y) {};
    return C;
}();
var c;
c.foo();
c.foo(1);
c.foo2(1);
c.foo2(1, 2);
var i;
i();
i(1);
i(1, 2);
i.foo(1);
i.foo(1, 2);
i.foo(1, 2, 3);
var a;
a();
a(1);
a(1, 2);
a.foo(1);
a.foo(1, 2);
a.foo(1, 2, 3);
