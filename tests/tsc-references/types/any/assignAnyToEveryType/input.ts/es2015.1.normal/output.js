// all of these are valid
var x;
var a1 = x;
var b = x;
var c = x;
var d = x;
var e = null;
e = x;
var f = undefined;
f = x;
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
var g = x;
var g2 = E1.A;
g2 = x;
class C {
}
var h = x;
var i = x;
var j = x;
var j2 = x;
var M1;
(function(M) {
    M.foo = 1;
})(M1 || (M1 = {
}));
M1 = x;
function k(a) {
    a = x;
}
