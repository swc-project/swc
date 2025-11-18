//// [negateOperatorWithNumberType.ts]
// - operator on number type
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
var ResultIsNumber1 = -NUMBER;
var ResultIsNumber2 = -NUMBER1;
// number type literal
var ResultIsNumber3 = -1;
var ResultIsNumber4 = -{
    x: 1,
    y: 2
};
var ResultIsNumber5 = -{
    x: 1,
    y: function(n) {
        return n;
    }
};
// number type expressions
var ResultIsNumber6 = -objA.a;
var ResultIsNumber7 = -M.n;
var ResultIsNumber8 = -NUMBER1[0];
var ResultIsNumber9 = -foo();
var ResultIsNumber10 = -A.foo();
var ResultIsNumber11 = -(NUMBER - NUMBER);
// miss assignment operators
-1;
-NUMBER;
-NUMBER1;
-foo();
-objA.a;
-M.n;
-objA.a, M.n;
var M;
