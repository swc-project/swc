//// [twoMergedInterfacesWithDifferingOverloads.ts]
// interfaces that merge must not have members that conflict
var c, d;
(void 0).foo(!0), c.foo(1, 2), d.foo(1, 1);
 // boolean, last definition wins
