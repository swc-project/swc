//// [genericCallWithNonSymmetricSubtypes.ts]
function foo(x, y) {}
var a, b, x, y, s1, s2, r = foo(a, b), r2 = foo(b, a), r3 = foo(a, x), r4 = foo(x, a), r5 = foo(a, y), r5 = foo(y, a), r6 = foo(x, y), r6 = foo(y, x), r7 = foo(s1, s2), r8 = foo(s2, s1);
