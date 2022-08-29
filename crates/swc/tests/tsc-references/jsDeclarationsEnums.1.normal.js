//// [index.js]
// Pretty much all of this should be an error, (since enums are forbidden in js),
// but we should be able to synthesize declarations from the symbols regardless
export var A;
(function(A) {})(A || (A = {}));
export var B;
(function(B) {
    B[B["Member"] = 0] = "Member";
})(B || (B = {}));
var C;
(function(C) {})(C || (C = {}));
export { C };
var DD;
(function(DD) {})(DD || (DD = {}));
export { DD as D };
export var E;
(function(E) {})(E || (E = {}));
export { E as EE };
export { F as FF };
export var F;
(function(F) {})(F || (F = {}));
export var G;
(function(G) {
    G[G["A"] = 1] = "A";
    G[G["B"] = 2] = "B";
    G[G["C"] = 3] = "C";
})(G || (G = {}));
export var H;
(function(H) {
    H["A"] = "a";
    H["B"] = "b";
})(H || (H = {}));
export var I;
(function(I) {
    I["A"] = "a";
    I[I["B"] = 0] = "B";
    I[I["C"] = 1] = "C";
})(I || (I = {}));
export var J;
(function(J) {
    J[J["A"] = 1] = "A";
    J[J["B"] = 2] = "B";
    J[J["C"] = 3] = "C";
})(J || (J = {}));
export var K;
(function(K) {
    K[K["None"] = 0] = "None";
    K[K["A"] = 1] = "A";
    K[K["B"] = 2] = "B";
    K[K["C"] = 4] = "C";
    K[K["Mask"] = 7] = "Mask";
})(K || (K = {}));
export var L;
(function(L) {
    L[L["None"] = 0] = "None";
    L[L["A"] = 1] = "A";
    L[L["B"] = 2] = "B";
    L[L["C"] = 4] = "C";
    L[L["Mask"] = 7] = "Mask";
})(L || (L = {}));
