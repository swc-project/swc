var a;
var a = bar(1, 1, g); // Should be number
var a = baz(1, 1, g); // Should be number
var b;
var b = foo(g); // Error, number and string are disjoint types
var b = bar(1, "one", g); // Error, number and string are disjoint types
var b = bar("one", 1, g); // Error, number and string are disjoint types
var b = baz(b, b, g); // Should be number | string
var d;
var d = foo(h); // Should be number[] | string[]
var d = bar(1, "one", h); // Should be number[] | string[]
var d = bar("one", 1, h); // Should be number[] | string[]
var d = baz(d, d, g); // Should be number[] | string[]
