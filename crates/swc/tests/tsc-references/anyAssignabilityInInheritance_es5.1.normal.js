import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var a;
var r3 = foo2(a); // any, not a subtype of number so it skips that overload, is a subtype of itself so it picks second (if truly ambiguous it would pick first overload)
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var r3 = foo3(a); // any
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
var r3 = foo3(a); // any
function f() {}
(function(f1) {
    var bar = f1.bar = 1;
})(f || (f = {}));
var r3 = foo3(a); // any
var CC = function CC() {
    "use strict";
    _class_call_check(this, CC);
};
(function(CC) {
    var bar = CC.bar = 1;
})(CC || (CC = {}));
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
