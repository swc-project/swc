import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var STRING, M, STRING1 = [
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
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
void 0 === STRING || _type_of(STRING), _type_of(STRING1), _type_of(""), _type_of({
    x: "",
    y: ""
}), _type_of({
    x: "",
    y: function(s) {
        return s;
    }
}), _type_of(objA.a), _type_of(M.n), _type_of(STRING1[0]), _type_of(foo()), _type_of(A.foo()), _type_of(STRING + STRING), _type_of(STRING.charAt(0)), _type_of(void 0 === STRING ? "undefined" : _type_of(STRING)), _type_of(_type_of(_type_of(STRING + STRING))), _type_of(""), void 0 === STRING || _type_of(STRING), _type_of(STRING1), _type_of(foo()), _type_of(objA.a), M.n;
z: void 0 === STRING || _type_of(STRING);
x: _type_of(STRING1);
r: _type_of(foo);
z: _type_of("");
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
