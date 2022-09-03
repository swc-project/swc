//// [mergeTwoInterfaces.ts]
var a, b, M, r1 = a.foo, r2 = a.bar, r3 = b.foo, r4 = b.bar;
!function(M) {
    var a, b;
    a.foo, a.bar, b.foo, b.bar;
}(M || (M = {}));
