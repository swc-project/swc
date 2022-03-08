var a, b, M;
a.foo, a.bar, b.foo, b.bar, function(M) {
    var a1, b1;
    a1.foo, a1.bar, b1.foo, b1.bar;
}(M || (M = {}));
