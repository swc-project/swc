import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _type_of from "@swc/helpers/lib/_type_of.js";
function foo() {
    return !0;
}
var BOOLEAN, M, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
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
void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(!0), _type_of({
    x: !0,
    y: !1
}), _type_of(objA.a), _type_of(M.n), _type_of(foo()), _type_of(A.foo()), _type_of(void 0 === BOOLEAN ? "undefined" : _type_of(BOOLEAN)), _type_of(!0), void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(foo()), _type_of(!0), _type_of(objA.a), _type_of(M.n);
z: void 0 === BOOLEAN || _type_of(BOOLEAN);
r: _type_of(foo);
z: _type_of(!0);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
