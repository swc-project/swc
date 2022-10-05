//// [templateLiteralTypes2.ts]
takesLiteral("foo.bar.baz"), takesLiteral("foo.bar.baz"), takesLiteral("foo.bar.".concat(someString));
var id4 = "foo.bar.".concat(someString);
takesLiteral(id4), takesLiteral("foo.bar.".concat(someUnion)), "".concat(22, "px"), "rotate(".concat(12, "dig)");
