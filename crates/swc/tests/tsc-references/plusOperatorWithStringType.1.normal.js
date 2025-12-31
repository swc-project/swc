//// [plusOperatorWithStringType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// + operator on string type
var STRING;
var STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return "";
    };
    return A;
}();
var objA = new A();
// string type var
var ResultIsNumber1 = +STRING;
var ResultIsNumber2 = +STRING1;
// string type literal
var ResultIsNumber3 = +"";
var ResultIsNumber4 = +{
    x: "",
    y: ""
};
var ResultIsNumber5 = +{
    x: "",
    y: function(s) {
        return s;
        var _$M;
    }
};
// string type expressions
var ResultIsNumber6 = +objA.a;
var ResultIsNumber7 = +_$M.n;
var ResultIsNumber8 = +STRING1[0];
var ResultIsNumber9 = +foo();
var ResultIsNumber10 = +A.foo();
var ResultIsNumber11 = +(STRING + STRING);
var ResultIsNumber12 = +STRING.charAt(0);
// miss assignment operators
+"";
+STRING;
+STRING1;
+foo();
+objA.a, _$M.n;
