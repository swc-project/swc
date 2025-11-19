//// [voidOperatorWithNumberType.ts]
// void  operator on number type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var NUMBER;
var NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return 1;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// number type var
var ResultIsAny1 = void NUMBER;
var ResultIsAny2 = void NUMBER1;
// number type literal
var ResultIsAny3 = void 1;
var ResultIsAny4 = void {
    x: 1,
    y: 2
};
var ResultIsAny5 = void {
    x: 1,
    y: function(n) {
        return n;
    }
};
// number type expressions
var ResultIsAny6 = void objA.a;
var ResultIsAny7 = void M.n;
var ResultIsAny8 = void NUMBER1[0];
var ResultIsAny9 = void foo();
var ResultIsAny10 = void A.foo();
var ResultIsAny11 = void (NUMBER + NUMBER);
// multiple void  operators
var ResultIsAny12 = void void NUMBER;
var ResultIsAny13 = void void void (NUMBER + NUMBER);
// miss assignment operators
void 1;
void NUMBER;
void NUMBER1;
void foo();
void objA.a;
void M.n;
objA.a, M.n;
var M;
