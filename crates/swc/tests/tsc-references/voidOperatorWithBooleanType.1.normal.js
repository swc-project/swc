//// [voidOperatorWithBooleanType.ts]
// void  operator on boolean type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var BOOLEAN;
function foo() {
    return true;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return false;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// boolean type var
var ResultIsAny1 = void BOOLEAN;
// boolean type literal
var ResultIsAny2 = void true;
var ResultIsAny3 = void {
    x: true,
    y: false
};
// boolean type expressions
var ResultIsAny4 = void objA.a;
var ResultIsAny5 = void M.n;
var ResultIsAny6 = void foo();
var ResultIsAny7 = void A.foo();
// multiple void  operator
var ResultIsAny8 = void void BOOLEAN;
// miss assignment operators
void true;
void BOOLEAN;
void foo();
true, false;
void objA.a;
void M.n;
var M;
