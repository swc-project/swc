//// [enumAssignabilityInInheritance.ts]
// enum is only a subtype of number, no types are subtypes of enum, all of these except the first are errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var r = foo(0); // E
var r2 = foo(1); // number
var r3 = foo(null); // any
var r4 = foo2(0);
var r4 = foo3(0);
var r4 = foo4(0);
var r4 = foo5(0);
var r4 = foo6(0);
var r4 = foo7(0);
var r4 = foo8(0);
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var r4 = foo9(0);
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var r4 = foo10(0);
var r4 = foo11(0);
var r4 = foo12(0);
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["A"] = 0] = "A";
    return E2;
}(E2 || {});
var r4 = foo13(0);
function f() {}
(function(f) {
    f.bar = 1;
})(f || (f = {}));
var r4 = foo14(0);
var CC = function CC() {
    "use strict";
    _class_call_check(this, CC);
};
(function(CC) {
    CC.bar = 1;
})(CC || (CC = {}));
var r4 = foo15(0);
var r4 = foo16(0);
var r4 = foo16(0);
