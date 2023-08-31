//// [constEnumPropertyAccess2.ts]
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
var G, G1;
(G1 = G || (G = {}))[G1.A = 1] = "A", G1[G1.B = 2] = "B", G1[G1.C = 3] = "C", G1[G1.D = 2] = "D", G[1], G.B = 3;
