//// [decrementOperatorWithNumberType.ts]
// -- operator on number type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var n, NUMBER, M, NUMBER1 = [
    1,
    2
];
(M || (M = {})).n = n;
var objA = new function A() {
    _class_call_check(this, A);
}();
--NUMBER, NUMBER--, --objA.a, --M.n, objA.a--, M.n--, NUMBER1[0]--, // miss assignment operators
--NUMBER, --NUMBER1[0], --objA.a, --M.n, --objA.a, M.n, NUMBER--, NUMBER1[0]--, objA.a--, M.n--, objA.a--, M.n--;
