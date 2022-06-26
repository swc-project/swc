var E;
(function(E) {
    E[E["e1"] = 0] = "e1";
    E[E["e2"] = 1] = "e2";
})(E || (E = {}));
class A {
}
class A2 {
}
function f() {}
(function(f) {
    var bar = f.bar = 1;
})(f || (f = {}));
class c {
}
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
