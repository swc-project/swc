//// [callSignatureWithoutReturnTypeAnnotationInference.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function m1() {
    return 1;
}
!function foo3() {
    return foo3();
}(), _type_of(1), (M = M1 || (M1 = {})).x = 1, M.C = function C() {
    _class_call_check(this, C);
}, (m1 || (m1 = {})).y = 2;
var e1, M, M1, c1 = function c1(x) {
    _class_call_check(this, c1);
};
(c1 || (c1 = {})).x = 1;
var e11 = ((e1 = e11 || {})[e1.A = 0] = "A", e1);
(e11 || (e11 = {})).y = 1;
