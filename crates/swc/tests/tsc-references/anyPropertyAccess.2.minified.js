//// [anyPropertyAccess.ts]
var x, a = x.foo, b = x.foo, c = x.fn(), d = x.bar.baz, e = x[0].foo, f = x["0"].bar;
