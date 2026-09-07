(function(N) {
    N.foo = "s";
})(N || (N = {}));
var E = /*#__PURE__*/ function(E) {
    E["A"] = "s";
    E["B"] = "b";
    return E;
}(E || {});
(function(M) {
    (function(Inner) {
        Inner.bar = "t";
    })(M.Inner || (M.Inner = {}));
})(M || (M = {}));
var F = /*#__PURE__*/ function(F) {
    F["A"] = "t";
    F["B"] = "b";
    return F;
}(F || {});
(function(C1) {
    (function(C2) {
        (function(C3) {
            C3.deep = "d";
        })(C2.C3 || (C2.C3 = {}));
    })(C1.C2 || (C1.C2 = {}));
})(C1 || (C1 = {}));
var G = /*#__PURE__*/ function(G) {
    G["A"] = "d";
    G["B"] = "b";
    return G;
}(G || {});
(function(Dot) {
    (function(Sub) {
        Sub.x = "dotted";
    })(Dot.Sub || (Dot.Sub = {}));
})(Dot || (Dot = {}));
var H = /*#__PURE__*/ function(H) {
    H["A"] = "dotted";
    H["B"] = "b";
    return H;
}(H || {});
var Merged = /*#__PURE__*/ function(Merged) {
    Merged[Merged["foo"] = 1] = "foo";
    return Merged;
}(Merged || {});
(function(Merged) {
    Merged.bar = "merged";
})(Merged || (Merged = {}));
var I = /*#__PURE__*/ function(I) {
    I[I["A"] = 1] = "A";
    I["B"] = "merged";
    I["C"] = "c";
    return I;
}(I || {});
var N, M, C1, Dot;
