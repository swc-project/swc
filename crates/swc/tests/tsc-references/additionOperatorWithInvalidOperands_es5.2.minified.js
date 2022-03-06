import * as swcHelpers from "@swc/helpers";
var E, M, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, null, [
        {
            key: "foo",
            value: function() {}
        }
    ]), C;
}();
(function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
})(E || (E = {})), (function(M1) {
    var a;
    M1.a = a;
})(M || (M = {})), {} + {}, E.a + new C(), E.a + C.foo(), E.a;
