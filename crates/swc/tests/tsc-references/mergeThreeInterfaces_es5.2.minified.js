var a, b, M;
a.foo, a.bar, a.baz, b.foo, b.bar, b.baz, function(M) {
    var a, b;
    a.foo, a.bar, a.baz, b.foo, b.bar, b.baz;
}(M || (M = {}));
