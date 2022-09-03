//// [decrementOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ANY, ANY1, M, ANY2 = [
    "",
    ""
], obj = {
    x: 1,
    y: null
}, A = function A() {
    "use strict";
    _class_call_check(this, A);
};
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsNumber1 = --ANY, ResultIsNumber2 = --ANY1, ResultIsNumber3 = ANY1--, ResultIsNumber4 = ANY1--, ResultIsNumber5 = --ANY2[0], ResultIsNumber6 = --obj.x, ResultIsNumber7 = --obj.y, ResultIsNumber8 = --objA.a, ResultIsNumber = --M.n, ResultIsNumber9 = ANY2[0]--, ResultIsNumber10 = obj.x--, ResultIsNumber11 = obj.y--, ResultIsNumber12 = objA.a--, ResultIsNumber13 = M.n--;
--ANY, --ANY1, --ANY2[0], --ANY, --ANY1, --objA.a, --M.n, ANY--, ANY1--, ANY2[0]--, ANY--, ANY1--, objA.a--, M.n--;
