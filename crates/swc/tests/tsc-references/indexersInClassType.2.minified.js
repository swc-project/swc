//// [indexersInClassType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var r = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.fn = function() {
        return this;
    }, C;
}())().fn();
r[1], r.a;
