//// [constEnumPropertyAccess1.ts]
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
var G, G1;
(G = G1 || (G1 = {}))[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
