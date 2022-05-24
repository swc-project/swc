import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var STRING, M, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return "";
    }, A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
objA.a, M.n, A.foo(), STRING.charAt(0), objA.a, M.n;
