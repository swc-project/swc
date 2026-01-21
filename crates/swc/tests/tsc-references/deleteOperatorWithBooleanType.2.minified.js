//// [deleteOperatorWithBooleanType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return !1;
    }, A;
}();
M || (M = {});
var objA = new A();
delete {
    x: !0,
    y: !1
}, delete objA.a, delete M.n, delete A.foo(), delete objA.a, delete M.n;
