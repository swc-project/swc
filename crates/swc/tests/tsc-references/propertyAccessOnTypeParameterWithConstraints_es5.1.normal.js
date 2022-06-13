import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// generic types should behave as if they have properties of their constraint type
// no errors expected 
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a1 = x["getDate"](); // number
        return a1 + x.getDate();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.getDate();
var r2b = i.foo["getDate"]();
var a;
var r3 = a().getDate();
var r3b = a()["getDate"]();
var b = {
    foo: function(x) {
        var a2 = x["getDate"](); // number
        return a2 + x.getDate();
    }
};
var r4 = b.foo(new Date());
