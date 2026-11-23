//// [propertyAccessOnTypeParameterWithConstraints4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        return (void 0).notHere() + (void 0).notHere();
    }, C;
}())().f(), (void 0).foo.notHere(), (void 0).foo.notHere(), (void 0)().notHere(), (void 0)().notHere();
var b = {
    foo: function(x) {
        return x.notHere() + x.notHere();
    },
    bar: b.foo().notHere()
};
b.foo(new Date());
