//// [typeOfThisInStaticMembers8.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
C.f = 1, C.arrowFunctionBoundary = function() {
    return C.f + 1;
}, C.functionExprBoundary = function() {
    return this.f + 2;
}, C.classExprBoundary = function _class() {
    _class_call_check(this, _class), this.a = this.f + 3;
}, C.functionAndClassDeclBoundary = void 0;
