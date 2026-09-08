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
(function(WithEnum) {
    (function(Inner) {
        Inner[Inner["X"] = 1] = "X";
    })(WithEnum.Inner || (WithEnum.Inner = {}));
})(WithEnum || (WithEnum = {}));
var J = /*#__PURE__*/ function(J) {
    J[J["A"] = 1] = "A";
    J["B"] = "b";
    return J;
}(J || {});
(function(SelfQ) {
    SelfQ.a = "x";
    (function(E) {
        E["A"] = "x";
        E["B"] = "b";
    })(SelfQ.E || (SelfQ.E = {}));
})(SelfQ || (SelfQ = {}));
(function(OuterQ) {
    OuterQ.a = "y";
    (function(Inner) {
        (function(E) {
            E["A"] = "y";
            E["B"] = "b";
        })(Inner.E || (Inner.E = {}));
    })(OuterQ.Inner || (OuterQ.Inner = {}));
})(OuterQ || (OuterQ = {}));
(function(ConDE) {})(ConDE || (ConDE = {}));
var K = /*#__PURE__*/ function(K) {
    K[K["A"] = 3] = "A";
    K["B"] = "b";
    return K;
}(K || {});
var N, M, C1, Dot, WithEnum, SelfQ, OuterQ, ConDE;
