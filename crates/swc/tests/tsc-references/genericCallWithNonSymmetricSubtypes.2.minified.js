//// [genericCallWithNonSymmetricSubtypes.ts]
var a, b, x, y, s1, s2;
function foo(x, y) {}
foo(a, b), foo(b, a), foo(a, x), foo(x, a), foo(a, y), foo(y, a), foo(x, y), foo(y, x), foo(s1, s2), foo(s2, s1);
