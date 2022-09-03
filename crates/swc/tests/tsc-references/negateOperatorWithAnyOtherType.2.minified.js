//// [negateOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "",
    y: function() {}
};
function foo() {}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsNumber1 = -ANY1, ResultIsNumber2 = -ANY2, ResultIsNumber3 = -A, ResultIsNumber4 = -M, ResultIsNumber5 = -obj, ResultIsNumber6 = -obj1, ResultIsNumber7 = -void 0, ResultIsNumber = -null, ResultIsNumber8 = -ANY2[0], ResultIsNumber9 = -obj1.x, ResultIsNumber10 = -obj1.y, ResultIsNumber11 = -objA.a, ResultIsNumber12 = -M.n, ResultIsNumber13 = -foo(), ResultIsNumber14 = -A.foo(), ResultIsNumber15 = -(ANY - ANY1);
ANY2[0], objA.a, M.n;
