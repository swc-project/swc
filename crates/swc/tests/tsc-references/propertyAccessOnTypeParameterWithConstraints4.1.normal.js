//// [propertyAccessOnTypeParameterWithConstraints4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a = x['notHere'](); // should be string
        return a + x.notHere();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.notHere();
var r2b = i.foo['notHere']();
var a;
var r3 = a().notHere();
var r3b = a()['notHere']();
var b = {
    foo: function(x) {
        var a = x['notHere'](); // should be string
        return a + x.notHere();
    },
    bar: b.foo().notHere()
};
var r4 = b.foo(new Date());
