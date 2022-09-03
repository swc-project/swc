//// [plusOperatorWithNumberType.ts]
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
var objA = new A(), ResultIsNumber1 = +NUMBER, ResultIsNumber2 = +NUMBER1, ResultIsNumber3 = 1, ResultIsNumber4 = NaN, ResultIsNumber5 = NaN, ResultIsNumber6 = +objA.a, ResultIsNumber7 = +M.n, ResultIsNumber8 = +NUMBER1[0], ResultIsNumber9 = +foo(), ResultIsNumber10 = +A.foo(), ResultIsNumber11 = +(NUMBER + NUMBER);
foo(), objA.a, M.n, objA.a, M.n;
