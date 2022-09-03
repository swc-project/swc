//// [typeofOperatorWithStringType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var STRING, M, z, x, r, STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return "";
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsString1 = void 0 === STRING ? "undefined" : _type_of(STRING), ResultIsString2 = void 0 === STRING1 ? "undefined" : _type_of(STRING1), ResultIsString3 = _type_of(""), ResultIsString4 = _type_of({
    x: "",
    y: ""
}), ResultIsString5 = _type_of({
    x: "",
    y: function(s) {
        return s;
    }
}), ResultIsString6 = _type_of(objA.a), ResultIsString7 = _type_of(M.n), ResultIsString8 = _type_of(STRING1[0]), ResultIsString9 = _type_of(foo()), ResultIsString10 = _type_of(A.foo()), ResultIsString11 = _type_of(STRING + STRING), ResultIsString12 = _type_of(STRING.charAt(0)), ResultIsString13 = _type_of(void 0 === STRING ? "undefined" : _type_of(STRING)), ResultIsString14 = _type_of(_type_of(_type_of(STRING + STRING)));
_type_of(""), void 0 === STRING || _type_of(STRING), void 0 === STRING1 || _type_of(STRING1), _type_of(foo()), _type_of(objA.a), M.n;
z: void 0 === STRING || _type_of(STRING);
x: void 0 === STRING1 || _type_of(STRING1);
r: _type_of(foo);
var y = {
    a: "",
    b: ""
};
z: _type_of(y.a);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
