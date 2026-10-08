(function(N) {
    N.A = 100;
    (function(E) {
        E[E["A"] = 1] = "A";
        E[E["B"] = 2] = "B";
    })(N.E || (N.E = {}));
})(N || (N = {}));
(function(N) {
    N.result = 2;
})(N || (N = {}));
console.log(N.result);
var N;
