let D;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 2] = "B";
})(D || (D = {}));
D.A = 5;
console.log(D.A);
let E;
console.log(1);
let F;
let G;
(function(G) {
    G[G["A"] = 2] = "A";
})(G || (G = {}));
console.log(G.A);
let H;
(function(H) {
    H[H["A"] = 2] = "A";
})(H || (H = {}));
let I;
(function(I) {
    I[I["A"] = H.A] = "A";
})(I || (I = {}));
console.log(I.A);
