import * as swcHelpers from "@swc/helpers";
function foo() {
    return "abc";
}
var STRING, M, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, null, [
        {
            key: "foo",
            value: function() {
                return "";
            }
        }
    ]), A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
objA.a, M.n, foo(), A.foo(), STRING.charAt(0), foo(), objA.a, M.n;
