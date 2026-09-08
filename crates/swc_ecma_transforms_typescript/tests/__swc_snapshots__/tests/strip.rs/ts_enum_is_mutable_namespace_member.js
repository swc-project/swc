(function(N) {
    N.foo = "s";
    (function(E) {
        E[E["X"] = 1] = "X";
    })(N.E || (N.E = {}));
    (function(CE) {
        CE[CE["Y"] = 2] = "Y";
    })(N.CE || (N.CE = {}));
})(N || (N = {}));
var F = /*#__PURE__*/ function(F) {
    F["A"] = "s";
    F[F["B"] = 1] = "B";
    F[F["C"] = 2] = "C";
    F["D"] = "d";
    return F;
}(F || {});
const viaNs = N.E.X;
var G = function(G) {
    G[G["A"] = viaNs] = "A";
    G["B"] = "b";
    return G;
}(G || {});
var N;
