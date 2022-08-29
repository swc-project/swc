//// [plusOperatorWithStringType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    return "abc";
}
var STRING, M, A = function() {
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
var objA = new A();
objA.a, M.n, foo(), A.foo(), STRING.charAt(0), foo(), objA.a, M.n;
