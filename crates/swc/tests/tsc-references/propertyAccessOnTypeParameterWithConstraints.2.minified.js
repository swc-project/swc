//// [propertyAccessOnTypeParameterWithConstraints.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var i, a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.getDate() + x.getDate();
    }, C;
}(), r = new C().f(), r2 = i.foo.getDate(), r2b = i.foo.getDate(), r3 = a().getDate(), r3b = a().getDate(), b = {
    foo: function(x) {
        return x.getDate() + x.getDate();
    }
}, r4 = b.foo(new Date());
