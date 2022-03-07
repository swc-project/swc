var a, b, M;
a.foo, a.bar, a.baz, b.foo, b.bar, b.baz, function(M) {
    var a1, b1;
    a1.foo, a1.bar, a1.baz, b1.foo, b1.bar, b1.baz;
}(M || (M = {}));
