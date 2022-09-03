//// [typeofOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var ANY, ANY1, obj, M, z, x, r, ANY2 = [
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
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsString1 = void 0 === ANY1 ? "undefined" : _type_of(ANY1), ResultIsString2 = void 0 === ANY2 ? "undefined" : _type_of(ANY2), ResultIsString3 = void 0 === A ? "undefined" : _type_of(A), ResultIsString4 = void 0 === M ? "undefined" : _type_of(M), ResultIsString5 = void 0 === obj ? "undefined" : _type_of(obj), ResultIsString6 = void 0 === obj1 ? "undefined" : _type_of(obj1), ResultIsString7 = "undefined", ResultIsString8 = _type_of(null), ResultIsString9 = _type_of({}), ResultIsString10 = _type_of(ANY2[0]), ResultIsString11 = _type_of(objA.a), ResultIsString12 = _type_of(obj1.x), ResultIsString13 = _type_of(M.n), ResultIsString14 = _type_of(foo()), ResultIsString15 = _type_of(A.foo()), ResultIsString16 = _type_of(ANY + ANY1), ResultIsString17 = _type_of(NaN), ResultIsString18 = _type_of(0), ResultIsString19 = _type_of(NaN), ResultIsString20 = _type_of(void 0 === ANY ? "undefined" : _type_of(ANY)), ResultIsString21 = _type_of(_type_of(_type_of(ANY + ANY1)));
void 0 === ANY || _type_of(ANY), void 0 === ANY1 || _type_of(ANY1), _type_of(ANY2[0]), void 0 === ANY || _type_of(ANY), void 0 === obj1 || _type_of(obj1), _type_of(obj1.x), _type_of(objA.a), _type_of(M.n);
z: void 0 === ANY || _type_of(ANY);
x: void 0 === ANY2 || _type_of(ANY2);
r: _type_of(foo);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
z: _type_of(obj1.x);
