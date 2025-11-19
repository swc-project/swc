//// [plusOperatorWithBooleanType.ts]
// + operator on boolean type
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
var ResultIsNumber1 = +BOOLEAN;
// boolean type literal
var ResultIsNumber2 = +true;
var ResultIsNumber3 = +{
    x: true,
    y: false
};
// boolean type expressions
var ResultIsNumber4 = +objA.a;
var ResultIsNumber5 = +M.n;
var ResultIsNumber6 = +foo();
var ResultIsNumber7 = +A.foo();
// miss assignment operators
+true;
+BOOLEAN;
+foo();
+true, false;
+objA.a;
+M.n;
var M;
