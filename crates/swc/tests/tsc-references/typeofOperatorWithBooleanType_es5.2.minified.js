import * as swcHelpers from "@swc/helpers";
function foo() {
    return !0;
}
var BOOLEAN, M, A = function() {
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
void 0 === BOOLEAN || swcHelpers.typeOf(BOOLEAN), swcHelpers.typeOf(!0), swcHelpers.typeOf({
    x: !0,
    y: !1
}), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n), swcHelpers.typeOf(!0), swcHelpers.typeOf(A.foo()), swcHelpers.typeOf(void 0 === BOOLEAN ? "undefined" : swcHelpers.typeOf(BOOLEAN)), swcHelpers.typeOf(!0), void 0 === BOOLEAN || swcHelpers.typeOf(BOOLEAN), swcHelpers.typeOf(!0), swcHelpers.typeOf(!0), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n);
z: void 0 === BOOLEAN || swcHelpers.typeOf(BOOLEAN);
r: swcHelpers.typeOf(foo);
z: swcHelpers.typeOf(!0);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
