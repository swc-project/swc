//// [constEnumPropertyAccess2.ts]
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
var G;
// Error from referring constant enum in any other context than a property access
var z = G;
var z1 = G[1];
var g;
g = "string";
function foo(x) {}
G.B = 3;
