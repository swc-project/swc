//// [bitwiseNotOperatorWithAnyOtherType.ts]
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
var objA = new A(), ResultIsNumber = ~ANY1, ResultIsNumber1 = ~ANY2, ResultIsNumber2 = ~A, ResultIsNumber3 = ~M, ResultIsNumber4 = ~obj, ResultIsNumber5 = ~obj1, ResultIsNumber6 = ~void 0, ResultIsNumber7 = -1, ResultIsNumber8 = ~ANY2[0], ResultIsNumber9 = ~obj1.x, ResultIsNumber10 = ~obj1.y, ResultIsNumber11 = ~objA.a, ResultIsNumber12 = ~M.n, ResultIsNumber13 = ~foo(), ResultIsNumber14 = ~A.foo(), ResultIsNumber15 = ~(ANY + ANY1), ResultIsNumber16 = ~NaN, ResultIsNumber17 = -1, ResultIsNumber18 = ~NaN, ResultIsNumber19 = ~~ANY, ResultIsNumber20 = ~~~(ANY + ANY1);
ANY2[0], obj1.y, objA.a, M.n, obj1.x;
