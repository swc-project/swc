//// [stringLiteralsWithEqualityChecks04.ts]
var x, y, b;
b = x == y, b = "foo" == y, b = "foo" == y, b = !1, b = "bar" == x, b = "bar" == x, b = "bar" == y, b = "bar" == y, b = x != y, b = "foo" != y, b = "foo" != y, b = !0, b = "bar" != x, b = "bar" != x, b = "bar" != y, b = "bar" != y;
