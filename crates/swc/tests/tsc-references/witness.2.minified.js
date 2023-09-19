//// [witness.ts]
// Initializers
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!// Return type
function fnReturn1() {
    return fnReturn1();
}(), function fnReturn2() {
    return fnReturn2;
}(), // function call return type
function fnCall() {
    return fnCall();
}(), function fn5() {
    return new (void 0)(fn5);
}();
// Property access
var propAcc1, M2, M21, propAcc1 = {
    m: propAcc1.m
};
(M21 = M2 || (M2 = {})).x = M21.x, M21.x, new // Property access of class instance type
function C2() {
    _class_call_check(this, C2), this.n = this.n // n: any
    ;
}().n;
// Constructor function property access
var C3 = function C3() {
    _class_call_check(this, C3);
};
C3.q = C3.q, C3.q;
 // Parentheses - tested a bunch above
