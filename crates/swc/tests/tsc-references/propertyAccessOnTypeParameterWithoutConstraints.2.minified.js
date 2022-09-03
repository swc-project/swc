//// [propertyAccessOnTypeParameterWithoutConstraints.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var i, a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.toString() + x.toString();
    }, C;
}(), r = new C().f(), r2 = i.foo.toString(), r2b = i.foo.toString(), r3 = a().toString(), r3b = a().toString(), b = {
    foo: function(x) {
        return x.toString() + x.toString();
    }
}, r4 = b.foo(1);
