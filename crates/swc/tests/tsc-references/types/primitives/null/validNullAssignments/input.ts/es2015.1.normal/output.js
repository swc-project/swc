var a = null;
var b = null;
var c = null;
var d = null;
var e = null;
e = null; // ok
var E;
(function(E1) {
    E1[E1["A"] = 0] = "A";
})(E || (E = {
}));
E.A = null; // error
class C {
}
var f;
f = null; // ok
C = null; // error
var g;
g = null; // ok
I = null; // error
var M;
(function(M1) {
    M1.x = 1;
})(M || (M = {
}));
M = null; // error
var h = null;
function i(a1) {
    a1 = null;
}
i = null; // error
