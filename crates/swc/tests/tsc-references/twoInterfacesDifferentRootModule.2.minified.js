//// [twoInterfacesDifferentRootModule.ts]
// two interfaces with different root modules should not merge
var M2, a, b;
M2 || (M2 = {}), a.foo, a.bar, b.foo, b.bar;
