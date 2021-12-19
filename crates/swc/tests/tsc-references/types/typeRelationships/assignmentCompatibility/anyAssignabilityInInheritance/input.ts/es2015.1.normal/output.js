var a;
var r3 = foo2(a); // any, not a subtype of number so it skips that overload, is a subtype of itself so it picks second (if truly ambiguous it would pick first overload)
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
class A {
}
var r3 = foo3(a); // any
class A2 {
}
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
var r3 = foo3(a); // any
function f() {
}
(function(f1) {
    f1.bar = 1;
})(f || (f = {
}));
var r3 = foo3(a); // any
class CC {
}
(function(CC1) {
    CC1.bar = 1;
})(CC || (CC = {
}));
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
