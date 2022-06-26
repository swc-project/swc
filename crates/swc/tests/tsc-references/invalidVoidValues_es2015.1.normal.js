var x;
x = 1;
x = '';
x = true;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
x = E;
x = E.A;
class C {
}
var a;
x = a;
var b;
x = b;
x = {
    f () {}
};
var M;
(function(M) {
    var x = M.x = 1;
})(M || (M = {}));
x = M;
function f(a) {
    x = a;
}
x = f;
