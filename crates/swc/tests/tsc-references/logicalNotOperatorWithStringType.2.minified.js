//// [logicalNotOperatorWithStringType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var STRING, M, STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return "";
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsBoolean1 = !STRING, ResultIsBoolean2 = !STRING1, ResultIsBoolean3 = !0, ResultIsBoolean4 = !1, ResultIsBoolean5 = !1, ResultIsBoolean6 = !objA.a, ResultIsBoolean7 = !M.n, ResultIsBoolean8 = !STRING1[0], ResultIsBoolean9 = !foo(), ResultIsBoolean10 = !A.foo(), ResultIsBoolean11 = !(STRING + STRING), ResultIsBoolean12 = !STRING.charAt(0), ResultIsBoolean13 = !!STRING, ResultIsBoolean14 = !(STRING + STRING);
foo(), objA.a, M.n;
