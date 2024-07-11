var D;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 2] = "B";
})(D || (D = {}));
D.A = 5;
console.log(D.A);
var E;
console.log(1);
var F;
var G;
(function(G) {
    G[G["A"] = 2] = "A";
})(G || (G = {}));
console.log(G.A);
var H;
(function(H) {
    H[H["A"] = 2] = "A";
})(H || (H = {}));
var I;
(function(I) {
    I[I["A"] = H.A] = "A";
})(I || (I = {}));
console.log(I.A);
