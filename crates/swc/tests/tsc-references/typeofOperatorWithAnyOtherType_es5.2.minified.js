import * as swcHelpers from "@swc/helpers";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "a",
    y: function() {}
};
function foo() {}
var A = function() {
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
void 0 === ANY1 || swcHelpers.typeOf(ANY1), swcHelpers.typeOf(ANY2), swcHelpers.typeOf(A), void 0 === M || swcHelpers.typeOf(M), void 0 === obj || swcHelpers.typeOf(obj), swcHelpers.typeOf(obj1), swcHelpers.typeOf(null), swcHelpers.typeOf({}), swcHelpers.typeOf(ANY2[0]), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(obj1.x), swcHelpers.typeOf(M.n), swcHelpers.typeOf(foo()), swcHelpers.typeOf(A.foo()), swcHelpers.typeOf(ANY + ANY1), swcHelpers.typeOf(NaN), swcHelpers.typeOf(0), swcHelpers.typeOf(NaN), swcHelpers.typeOf(void 0 === ANY ? "undefined" : swcHelpers.typeOf(ANY)), swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(ANY + ANY1))), void 0 === ANY || swcHelpers.typeOf(ANY), void 0 === ANY1 || swcHelpers.typeOf(ANY1), swcHelpers.typeOf(ANY2[0]), void 0 === ANY || swcHelpers.typeOf(ANY), swcHelpers.typeOf(obj1), swcHelpers.typeOf(obj1.x), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n);
z: void 0 === ANY || swcHelpers.typeOf(ANY);
x: swcHelpers.typeOf(ANY2);
r: swcHelpers.typeOf(foo);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
z: swcHelpers.typeOf(obj1.x);
