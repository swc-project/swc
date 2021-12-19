var // enums are only subtypes of number, any and no other types
E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
class A {
}
class A2 {
}
var E2;
(function(E2) {
    E2[E2["A"] = 0] = "A";
})(E2 || (E2 = {
}));
function f() {
}
(function(f1) {
    f1.bar = 1;
})(f || (f = {
}));
class c {
}
(function(c1) {
    c1.bar = 1;
})(c || (c = {
}));
