//// [constEnumPropertyAccess2.ts]
// Error from referring constant enum in any other context than a property access
var z = G;
var z1 = G[1];
var g;
g = "string";
function foo(x) {}
G.B = 3;
