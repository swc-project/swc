//// [typeParametersAvailableInNestedScope.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var c = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C), this.x = function(a) {};
    }
    return C.prototype.foo = function() {}, C;
}())();
c.data = c.x(null), c.data = c.foo();
