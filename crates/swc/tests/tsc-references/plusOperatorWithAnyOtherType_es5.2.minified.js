import * as swcHelpers from "@swc/helpers";
var M, ANY2 = [
    "",
    ""
], obj1 = {
    x: function(s) {},
    y: function(s1) {}
}, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.foo = function() {}, A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
ANY2[0], obj1.x, obj1.y, objA.a, M.n, A.foo(), ANY2[0], objA.a, M.n;
