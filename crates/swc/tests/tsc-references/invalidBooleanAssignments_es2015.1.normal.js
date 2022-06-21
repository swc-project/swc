var x = true;
var a = x;
var b = x;
var c = x;
var d = x;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
var e = x;
class C {
}
var f = x;
var g = x;
var h = x;
var h2 = x; // no error
var M;
(function(M) {
    var a = M.a = 1;
})(M || (M = {}));
M = x;
function i(a) {
    a = x;
}
i = x;
