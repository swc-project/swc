//// [propertyAccessOnTypeParameterWithoutConstraints.ts]
var i, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x; // should be string
        return x.toString() + x.toString();
    }, C;
}())().f(), i.foo.toString(), i.foo.toString(), a().toString(), a().toString(), ({
    foo: function(x) {
        return x.toString() + x.toString();
    }
}).foo(1);
