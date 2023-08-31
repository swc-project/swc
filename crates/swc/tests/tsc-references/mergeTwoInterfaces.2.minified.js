//// [mergeTwoInterfaces.ts]
// two interfaces with the same root module should merge
// basic case
var a, b, M, a1, b1;
a.foo, a.bar, b.foo, b.bar, M || (M = {}), a1.foo, a1.bar, b1.foo, b1.bar;
