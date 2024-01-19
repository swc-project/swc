//// [callSignatureWithoutReturnTypeAnnotationInference.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function m1() {
    return 1;
}
!function foo3() {
    return foo3();
}(), _type_of(1), M = M1 || (M1 = {}), M.x = 1, M.C = function C() {
    _class_call_check(this, C);
}, m11 = m1 || (m1 = {}), m11.y = 2;
var c1, e1, e11, M, m11, M1, e12, c11 = function c1(x) {
    _class_call_check(this, c1);
};
c1 = c11 || (c11 = {}), c1.x = 1, e1 = e12 || (e12 = {}), e1[e1.A = 0] = "A", e11 = e12 || (e12 = {}), e11.y = 1;
