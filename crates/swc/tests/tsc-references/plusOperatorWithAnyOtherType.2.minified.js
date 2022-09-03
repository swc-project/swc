//// [plusOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: function(s) {},
    y: function(s1) {}
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
var objA = new A(), ResultIsNumber1 = +ANY1, ResultIsNumber2 = +ANY2, ResultIsNumber3 = +A, ResultIsNumber4 = +M, ResultIsNumber5 = +obj, ResultIsNumber6 = +obj1, ResultIsNumber7 = NaN, ResultIsNumber8 = 0, ResultIsNumber9 = +ANY2[0], ResultIsNumber10 = +obj1.x, ResultIsNumber11 = +obj1.y, ResultIsNumber12 = +objA.a, ResultIsNumber13 = +M.n, ResultIsNumber14 = +foo(), ResultIsNumber15 = +A.foo(), ResultIsNumber16 = +(ANY + ANY1), ResultIsNumber17 = NaN, ResultIsNumber18 = 0, ResultIsNumber19 = NaN;
ANY2[0], objA.a, M.n;
