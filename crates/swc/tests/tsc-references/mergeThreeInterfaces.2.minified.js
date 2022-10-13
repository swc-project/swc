//// [mergeThreeInterfaces.ts]
var a, b, M;
(void 0).foo, a.bar, a.baz, b.foo, b.bar, b.baz, function(M) {
    var a, b;
    (void 0).foo, a.bar, a.baz, b.foo, b.bar, b.baz;
}(M || (M = {}));
