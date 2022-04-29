import * as swcHelpers from "@swc/helpers";
var M, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.foo = function() {
        return !1;
    }, A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
objA.a, M.n, A.foo(), objA.a, M.n;
