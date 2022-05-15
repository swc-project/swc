import * as swcHelpers from "@swc/helpers";
var NUMBER, M, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
void 0 === NUMBER || swcHelpers.typeOf(NUMBER), swcHelpers.typeOf(NUMBER1), swcHelpers.typeOf(1), swcHelpers.typeOf({
    x: 1,
    y: 2
}), swcHelpers.typeOf({
    x: 1,
    y: function(n) {
        return n;
    }
}), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n), swcHelpers.typeOf(NUMBER1[0]), swcHelpers.typeOf(foo()), swcHelpers.typeOf(A.foo()), swcHelpers.typeOf(NUMBER + NUMBER), swcHelpers.typeOf(void 0 === NUMBER ? "undefined" : swcHelpers.typeOf(NUMBER)), swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(NUMBER + NUMBER))), swcHelpers.typeOf(1), void 0 === NUMBER || swcHelpers.typeOf(NUMBER), swcHelpers.typeOf(NUMBER1), swcHelpers.typeOf(foo()), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n), swcHelpers.typeOf(objA.a), M.n;
z: void 0 === NUMBER || swcHelpers.typeOf(NUMBER);
x: swcHelpers.typeOf(NUMBER1);
r: swcHelpers.typeOf(foo);
z: swcHelpers.typeOf(1);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
