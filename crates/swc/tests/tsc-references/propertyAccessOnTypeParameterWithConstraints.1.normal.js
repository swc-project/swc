//// [propertyAccessOnTypeParameterWithConstraints.ts]
// generic types should behave as if they have properties of their constraint type
// no errors expected 
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a = x['getDate'](); // number
        return a + x.getDate();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.getDate();
var r2b = i.foo['getDate']();
var a;
var r3 = a().getDate();
var r3b = a()['getDate']();
var b = {
    foo: function(x) {
        var a = x['getDate'](); // number
        return a + x.getDate();
    }
};
var r4 = b.foo(new Date());
