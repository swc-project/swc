//// [logicalNotOperatorWithNumberType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NUMBER, M, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsBoolean1 = !NUMBER, ResultIsBoolean2 = !NUMBER1, ResultIsBoolean3 = !1, ResultIsBoolean4 = !1, ResultIsBoolean5 = !1, ResultIsBoolean6 = !objA.a, ResultIsBoolean7 = !M.n, ResultIsBoolean8 = !NUMBER1[0], ResultIsBoolean9 = !foo(), ResultIsBoolean10 = !A.foo(), ResultIsBoolean11 = !(NUMBER + NUMBER), ResultIsBoolean12 = !!NUMBER, ResultIsBoolean13 = !(NUMBER + NUMBER);
foo(), objA.a, M.n, objA.a, M.n;
