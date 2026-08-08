var D = /*#__PURE__*/ function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 2] = "B";
    return D;
}(D || {});
D.A = 5;
console.log(D.A);
console.log(1);
var G = /*#__PURE__*/ function(G) {
    G[G["A"] = 2] = "A";
    return G;
}(G || {});
console.log(G.A);
var H = /*#__PURE__*/ function(H) {
    H[H["A"] = 2] = "A";
    return H;
}(H || {});
console.log(2);
const j = H.A;
var J = function(J) {
    J[J["A"] = j] = "A";
    return J;
}(J || {});
console.log(J.A);
const l = 3;
var L = /*#__PURE__*/ function(L) {
    L[L["A"] = 3] = "A";
    return L;
}(L || {});
console.log(L.A);
