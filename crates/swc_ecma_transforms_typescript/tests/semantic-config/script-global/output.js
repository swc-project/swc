(function(N) {
    (function(E) {
        E[E["A"] = 5] = "A";
        E[E["B"] = 6] = "B";
    })(N.E || (N.E = {}));
})(N || (N = {}));
const A = N.E;
const B = A;
const value = 6;
var N;
