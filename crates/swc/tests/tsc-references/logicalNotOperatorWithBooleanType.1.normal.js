//// [logicalNotOperatorWithBooleanType.ts]
// ! operator on boolean type
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
var ResultIsBoolean1 = !BOOLEAN;
// boolean type literal
var ResultIsBoolean2 = !true;
var ResultIsBoolean3 = !{
    x: true,
    y: false
};
// boolean type expressions
var ResultIsBoolean4 = !objA.a;
var ResultIsBoolean5 = !M.n;
var ResultIsBoolean6 = !foo();
var ResultIsBoolean7 = !A.foo();
// multiple ! operators
var ResultIsBoolean = !!BOOLEAN;
// miss assignment operators
!true;
!BOOLEAN;
!foo();
!true, false;
!objA.a;
!M.n;
var M;
