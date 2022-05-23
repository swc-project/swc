import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, A);
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
void 0 === STRING || swcHelpers.typeOf(STRING), swcHelpers.typeOf(STRING1), swcHelpers.typeOf(""), swcHelpers.typeOf({
    x: "",
    y: ""
}), swcHelpers.typeOf({
    x: "",
    y: function(s) {
        return s;
    }
}), swcHelpers.typeOf(objA.a), swcHelpers.typeOf(M.n), swcHelpers.typeOf(STRING1[0]), swcHelpers.typeOf(foo()), swcHelpers.typeOf(A.foo()), swcHelpers.typeOf(STRING + STRING), swcHelpers.typeOf(STRING.charAt(0)), swcHelpers.typeOf(void 0 === STRING ? "undefined" : swcHelpers.typeOf(STRING)), swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(STRING + STRING))), swcHelpers.typeOf(""), void 0 === STRING || swcHelpers.typeOf(STRING), swcHelpers.typeOf(STRING1), swcHelpers.typeOf(foo()), swcHelpers.typeOf(objA.a), M.n;
z: void 0 === STRING || swcHelpers.typeOf(STRING);
x: swcHelpers.typeOf(STRING1);
r: swcHelpers.typeOf(foo);
z: swcHelpers.typeOf("");
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
