//// [bitwiseNotOperatorWithStringType.ts]
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
var objA = new A(), ResultIsNumber1 = ~STRING, ResultIsNumber2 = ~STRING1, ResultIsNumber3 = -1, ResultIsNumber4 = ~{
    x: "",
    y: ""
}, ResultIsNumber5 = ~{
    x: "",
    y: function(s) {
        return s;
    }
}, ResultIsNumber6 = ~objA.a, ResultIsNumber7 = ~M.n, ResultIsNumber8 = ~STRING1[0], ResultIsNumber9 = ~foo(), ResultIsNumber10 = ~A.foo(), ResultIsNumber11 = ~(STRING + STRING), ResultIsNumber12 = ~STRING.charAt(0), ResultIsNumber13 = ~~STRING, ResultIsNumber14 = ~~~(STRING + STRING);
foo(), objA.a, M.n;
