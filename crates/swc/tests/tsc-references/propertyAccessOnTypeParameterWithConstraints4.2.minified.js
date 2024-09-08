//// [propertyAccessOnTypeParameterWithConstraints4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.notHere() + x.notHere();
    }, C;
}())().f(), i.foo.notHere(), i.foo.notHere(), a().notHere(), a().notHere();
var i, a, b = {
    foo: function(x) {
        return x.notHere() + x.notHere();
    },
    bar: b.foo().notHere()
};
b.foo(new Date());
