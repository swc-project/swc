//// [constEnumPropertyAccess2.ts]
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {}));
var G, g, z = G, z1 = G[1];
function foo(x) {}
g = "string", G.B = 3;
