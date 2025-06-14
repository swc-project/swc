//// [typesWithSpecializedCallSignatures.ts]
import "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_inherits";
var i, a, c = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}())();
c = i, i = c = a, i = a, a = c, a = i, c.foo('hi'), c.foo('bye'), c.foo('hm');
