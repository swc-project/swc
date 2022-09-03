//// [voidOperatorWithStringType.ts]
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
var objA = new A(), ResultIsAny1 = void 0, ResultIsAny2 = void 0, ResultIsAny3 = void 0, ResultIsAny4 = void 0, ResultIsAny5 = void 0, ResultIsAny6 = void objA.a, ResultIsAny7 = void M.n, ResultIsAny8 = void STRING1[0], ResultIsAny9 = void foo(), ResultIsAny10 = void A.foo(), ResultIsAny11 = void 0, ResultIsAny12 = void STRING.charAt(0), ResultIsAny13 = void 0, ResultIsAny14 = void 0;
foo(), objA.a, M.n;
