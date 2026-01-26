//// [deleteOperatorWithNumberType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
}();
M || (M = {});
var objA = new A();
delete 1, delete {
    x: 1,
    y: 2
}, delete {
    x: 1,
    y: function(n) {
        return n;
    }
}, delete objA.a, delete M.n, delete [
    1,
    2
][0], delete 1, delete A.foo(), delete 1, delete 1, delete objA.a, delete M.n, delete objA.a, M.n;
