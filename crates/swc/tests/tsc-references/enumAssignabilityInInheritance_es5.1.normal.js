function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var // enum is only a subtype of number, no types are subtypes of enum, all of these except the first are errors
E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
var r = foo(E.A); // E
var r2 = foo(1); // number
var r3 = foo(null); // any
var r4 = foo2(E.A);
var r4 = foo3(E.A);
var r4 = foo4(E.A);
var r4 = foo5(E.A);
var r4 = foo6(E.A);
var r4 = foo7(E.A);
var r4 = foo8(E.A);
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var r4 = foo9(E.A);
var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
};
var r4 = foo10(E.A);
var r4 = foo11(E.A);
var r4 = foo12(E.A);
var E2;
(function(E2) {
    E2[E2["A"] = 0] = "A";
})(E2 || (E2 = {
}));
var r4 = foo13(E.A);
function f() {
}
(function(f1) {
    f1.bar = 1;
})(f || (f = {
}));
var r4 = foo14(E.A);
var CC = function CC() {
    "use strict";
    _classCallCheck(this, CC);
};
(function(CC) {
    CC.bar = 1;
})(CC || (CC = {
}));
var r4 = foo15(E.A);
var r4 = foo16(E.A);
var r4 = foo16(E.A);
