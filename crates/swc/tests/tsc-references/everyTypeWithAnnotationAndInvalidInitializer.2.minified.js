//// [everyTypeWithAnnotationAndInvalidInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, N, M1, N1, C = function C() {
    _class_call_check(this, C);
}, D = function D() {
    _class_call_check(this, D);
};
(M = M1 || (M1 = {})).A = function A() {
    _class_call_check(this, A);
}, M.F2 = function(x) {
    return x.toString();
}, (N = N1 || (N1 = {})).A = function A() {
    _class_call_check(this, A);
}, N.F2 = function(x) {
    return x.toString();
}, new D(), new D(), new C(), new C(), new N1.A();
