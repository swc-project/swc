//// [contextualSignatureInstantiation.ts]
var a, b, d, a = bar(1, 1, g), a = baz(1, 1, g), b = foo(g), b = bar(1, "one", g), b = bar("one", 1, g), b = baz(b, b, g), d = foo(h), d = bar(1, "one", h), d = bar("one", 1, h), d = baz(d, d, g);
