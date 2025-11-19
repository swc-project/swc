//// [voidOperatorWithAnyOtherType.ts]
// void  operator on any type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj;
var obj1 = {
    x: "",
    y: 1
};
function foo() {
    var a;
    return a;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        var a;
        return a;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// any type var
var ResultIsAny1 = void ANY1;
var ResultIsAny2 = void ANY2;
var ResultIsAny3 = void A;
var ResultIsAny4 = void M;
var ResultIsAny5 = void obj;
var ResultIsAny6 = void obj1;
// any type literal
var ResultIsAny7 = void undefined;
var ResultIsAny8 = void null;
// any type expressions
var ResultIsAny9 = void ANY2[0];
var ResultIsAny10 = void obj1.x;
var ResultIsAny11 = void obj1.y;
var ResultIsAny12 = void objA.a;
var ResultIsAny13 = void M.n;
var ResultIsAny14 = void foo();
var ResultIsAny15 = void A.foo();
var ResultIsAny16 = void (ANY + ANY1);
var ResultIsAny17 = void (null + undefined);
var ResultIsAny18 = void (null + null);
var ResultIsAny19 = void (undefined + undefined);
// multiple void  operators
var ResultIsAny20 = void void ANY;
var ResultIsAny21 = void void void (ANY + ANY1);
// miss assignment operators
void ANY;
void ANY1;
void ANY2[0];
ANY, ANY1;
void objA.a;
void M.n;
var M;
