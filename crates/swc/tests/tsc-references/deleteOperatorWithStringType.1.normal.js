//// [deleteOperatorWithStringType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// delete  operator on string type
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
(function(M) {})(M || (M = {}));
var objA = new A();
// string type var
var ResultIsBoolean1 = delete STRING;
var ResultIsBoolean2 = delete STRING1;
// string type literal
var ResultIsBoolean3 = delete "";
var ResultIsBoolean4 = delete {
    x: "",
    y: ""
};
var ResultIsBoolean5 = delete {
    x: "",
    y: function y(s) {
        return s;
    }
};
// string type expressions
var ResultIsBoolean6 = delete objA.a;
var ResultIsBoolean7 = delete M.n;
var ResultIsBoolean8 = delete STRING1[0];
var ResultIsBoolean9 = delete foo();
var ResultIsBoolean10 = delete A.foo();
var ResultIsBoolean11 = delete (STRING + STRING);
var ResultIsBoolean12 = delete STRING.charAt(0);
// multiple delete  operator
var ResultIsBoolean13 = delete delete STRING;
var ResultIsBoolean14 = delete delete delete (STRING + STRING);
// miss assignment operators
delete "";
delete STRING;
delete STRING1;
delete foo();
delete objA.a, M.n;
var M;
