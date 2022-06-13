import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var E, M, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {}, C;
}();
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), function(M1) {
    var a;
    M1.a = a;
}(M || (M = {})), E.a, new C(), E.a, C.foo(), E.a;
