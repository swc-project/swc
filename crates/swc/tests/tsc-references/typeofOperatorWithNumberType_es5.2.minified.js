import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _type_of from "@swc/helpers/lib/_type_of.js";
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
        _class_call_check(this, A);
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
void 0 === NUMBER || _type_of(NUMBER), _type_of(NUMBER1), _type_of(1), _type_of({
    x: 1,
    y: 2
}), _type_of({
    x: 1,
    y: function(n) {
        return n;
    }
}), _type_of(objA.a), _type_of(M.n), _type_of(NUMBER1[0]), _type_of(foo()), _type_of(A.foo()), _type_of(NUMBER + NUMBER), _type_of(void 0 === NUMBER ? "undefined" : _type_of(NUMBER)), _type_of(_type_of(_type_of(NUMBER + NUMBER))), _type_of(1), void 0 === NUMBER || _type_of(NUMBER), _type_of(NUMBER1), _type_of(foo()), _type_of(objA.a), _type_of(M.n), _type_of(objA.a), M.n;
z: void 0 === NUMBER || _type_of(NUMBER);
x: _type_of(NUMBER1);
r: _type_of(foo);
z: _type_of(1);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
