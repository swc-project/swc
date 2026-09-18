var C = "outer";
(function(N) {
    N.x = C;
})(N || (N = {}));
var D = "outer";
(function(M) {
    M.y = D;
})(M || (M = {}));
var N, M;
