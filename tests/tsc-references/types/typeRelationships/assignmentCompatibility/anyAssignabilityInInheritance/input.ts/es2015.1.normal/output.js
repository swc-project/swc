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
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
var r3 = foo3(a); // any
function f1() {
}
(function(f) {
    f.bar = 1;
})(f1 || (f1 = {
}));
var r3 = foo3(a); // any
class CC1 {
}
(function(CC) {
    CC.bar = 1;
})(CC1 || (CC1 = {
}));
var r3 = foo3(a); // any
var r3 = foo3(a); // any
var r3 = foo3(a); // any
