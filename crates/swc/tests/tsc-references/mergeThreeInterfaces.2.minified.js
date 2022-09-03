//// [mergeThreeInterfaces.ts]
var a, b, M, r1 = a.foo, r2 = a.bar, r3 = a.baz, r4 = b.foo, r5 = b.bar, r6 = b.baz;
!function(M) {
    var a, b;
    a.foo, a.bar, a.baz, b.foo, b.bar, b.baz;
}(M || (M = {}));
