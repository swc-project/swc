import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var M, ANY2 = [
    "",
    ""
], obj1 = {
    x: function(s) {},
    y: function(s1) {}
}, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
ANY2[0], obj1.x, obj1.y, objA.a, M.n, A.foo(), ANY2[0], objA.a, M.n;
