//// [typeofOperatorWithBooleanType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
function foo() {
    return !0;
}
var BOOLEAN, M, z, x, r, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return !1;
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsString1 = void 0 === BOOLEAN ? "undefined" : _type_of(BOOLEAN), ResultIsString2 = _type_of(!0), ResultIsString3 = _type_of({
    x: !0,
    y: !1
}), ResultIsString4 = _type_of(objA.a), ResultIsString5 = _type_of(M.n), ResultIsString6 = _type_of(foo()), ResultIsString7 = _type_of(A.foo()), ResultIsString8 = _type_of(void 0 === BOOLEAN ? "undefined" : _type_of(BOOLEAN));
_type_of(!0), void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(foo()), _type_of(!0), _type_of(objA.a), _type_of(M.n);
z: void 0 === BOOLEAN || _type_of(BOOLEAN);
r: _type_of(foo);
var y = {
    a: !0,
    b: !1
};
z: _type_of(y.a);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
