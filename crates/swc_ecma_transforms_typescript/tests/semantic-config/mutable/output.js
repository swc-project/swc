(function(N) {
    (function(E) {
        E[E["A"] = 1] = "A";
        E[E["B"] = 2] = "B";
    })(N.E || (N.E = {}));
})(N || (N = {}));
N.E.A = 5;
const read = N.E.A;
const folded = 7;
const annotated = N.E.A;
var N;
