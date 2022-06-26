var a, b, M;
a.foo, a.bar, b.foo, b.bar, function(M) {
    var a, b;
    a.foo, a.bar, b.foo, b.bar;
}(M || (M = {}));
