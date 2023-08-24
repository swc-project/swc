//// [twoInterfacesDifferentRootModule2.ts]
// two interfaces with different root modules should not merge
var M, M2, a, b, a1, b1;
M || (M = {}), M2 || (M2 = {}), a1.foo, a1.bar, b1.foo, b1.bar, a.foo, a.bar, b.foo, b.bar;
