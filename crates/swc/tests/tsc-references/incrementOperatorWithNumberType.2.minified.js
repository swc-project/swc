//// [incrementOperatorWithNumberType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NUMBER, M, NUMBER1 = [
    1,
    2
], A = function A() {
    "use strict";
    _class_call_check(this, A);
};
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsNumber1 = ++NUMBER, ResultIsNumber2 = NUMBER++, ResultIsNumber3 = ++objA.a, ResultIsNumber4 = ++M.n, ResultIsNumber5 = objA.a++, ResultIsNumber6 = M.n++, ResultIsNumber7 = NUMBER1[0]++;
++NUMBER, ++NUMBER1[0], ++objA.a, ++M.n, ++objA.a, M.n, NUMBER++, NUMBER1[0]++, objA.a++, M.n++, objA.a++, M.n++;
