var D = /*#__PURE__*/ function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 2] = "B";
    return D;
}(D || {});
D.A = 5;
console.log(D.A);
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    return E;
}(E || {});
console.log(E.B);
var F = /*#__PURE__*/ function(F) {
    F[F["A"] = 2] = "A";
    return F;
}(F || {});
var G = /*#__PURE__*/ function(G) {
    G[G["A"] = F.A] = "A";
    return G;
}(G || {});
console.log(G.A);
var H = /*#__PURE__*/ function(H) {
    H[H["A"] = 2] = "A";
    return H;
}(H || {});
var I = /*#__PURE__*/ function(I) {
    I[I["A"] = H.A] = "A";
    return I;
}(I || {});
console.log(I.A);
