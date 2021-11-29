var x;
x = 1;
x = '';
x = true;
let E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
x = E;
x = E.A;
class C {
}
var a1;
x = a1;
var b;
x = b;
x = {
    f () {
    }
};
var M;
(function(M) {
    M.x = 1;
})(M || (M = {
}));
x = M;
function f(a) {
    x = a;
}
x = f;
