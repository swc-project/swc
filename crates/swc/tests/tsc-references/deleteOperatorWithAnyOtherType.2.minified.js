//// [deleteOperatorWithAnyOtherType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "",
    y: function() {}
}, A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
M || (M = {});
var objA = new A();
delete null, delete ANY2[0], delete obj1.x, delete obj1.y, delete objA.a, delete M.n, delete A.foo(), delete ANY2[0], delete obj1.x, delete obj1.y, delete objA.a, delete M.n;
