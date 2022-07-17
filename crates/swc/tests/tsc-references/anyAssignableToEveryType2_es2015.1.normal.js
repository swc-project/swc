// any is not a subtype of any other types, but is assignable, all the below should work
class A {
}
class A2 {
}
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
function f() {}
(function(f) {
    var bar = f.bar = 1;
})(f || (f = {}));
class c {
}
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
