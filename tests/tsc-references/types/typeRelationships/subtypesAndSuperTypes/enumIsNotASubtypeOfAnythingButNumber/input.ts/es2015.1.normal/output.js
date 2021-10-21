var // enums are only subtypes of number, any and no other types
E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
class A {
}
class A2 {
}
var E21;
(function(E2) {
    E2[E2["A"] = 0] = "A";
})(E21 || (E21 = {
}));
function f1() {
}
(function(f) {
    f.bar = 1;
})(f1 || (f1 = {
}));
class c1 {
}
(function(c) {
    c.bar = 1;
})(c1 || (c1 = {
}));
