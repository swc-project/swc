//// [propertyAccessOnTypeParameterWithConstraints4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var i, a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.notHere() + x.notHere();
    }, C;
}(), r = new C().f(), r2 = i.foo.notHere(), r2b = i.foo.notHere(), r3 = a().notHere(), r3b = a().notHere(), b = {
    foo: function(x) {
        return x.notHere() + x.notHere();
    },
    bar: b.foo().notHere()
}, r4 = b.foo(new Date());
