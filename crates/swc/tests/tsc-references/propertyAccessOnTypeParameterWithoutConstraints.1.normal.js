//// [propertyAccessOnTypeParameterWithoutConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a = x['toString'](); // should be string
        return a + x.toString();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.toString();
var r2b = i.foo['toString']();
var a;
var r3 = a().toString();
var r3b = a()['toString']();
var b = {
    foo: function(x) {
        var a = x['toString'](); // should be string
        return a + x.toString();
    }
};
var r4 = b.foo(1);
