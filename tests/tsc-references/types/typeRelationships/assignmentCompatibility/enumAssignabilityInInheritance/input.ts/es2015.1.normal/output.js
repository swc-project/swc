var // enum is only a subtype of number, no types are subtypes of enum, all of these except the first are errors
E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
var r = foo(E1.A); // E
var r2 = foo(1); // number
var r3 = foo(null); // any
var r4 = foo2(E1.A);
var r4 = foo3(E1.A);
var r4 = foo4(E1.A);
var r4 = foo5(E1.A);
var r4 = foo6(E1.A);
var r4 = foo7(E1.A);
var r4 = foo8(E1.A);
class A {
}
var r4 = foo9(E1.A);
class A2 {
}
var r4 = foo10(E1.A);
var r4 = foo11(E1.A);
var r4 = foo12(E1.A);
var E21;
(function(E2) {
    E2[E2["A"] = 0] = "A";
})(E21 || (E21 = {
}));
var r4 = foo13(E1.A);
function f1() {
}
(function(f) {
    f.bar = 1;
})(f1 || (f1 = {
}));
var r4 = foo14(E1.A);
class CC1 {
}
(function(CC) {
    CC.bar = 1;
})(CC1 || (CC1 = {
}));
var r4 = foo15(E1.A);
var r4 = foo16(E1.A);
var r4 = foo16(E1.A);
