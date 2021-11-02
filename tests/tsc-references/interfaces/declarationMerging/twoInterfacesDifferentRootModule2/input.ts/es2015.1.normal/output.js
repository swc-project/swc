// two interfaces with different root modules should not merge
var M;
(function(M) {
    var M2;
    (function(M2) {
        var a;
        var r1 = a.foo; // error
        var r2 = a.bar;
        var b;
        var r3 = b.foo; // error
        var r4 = b.bar;
    })(M2 || (M2 = {
    }));
    var a1;
    var r1 = a1.foo;
    var r2 = a1.bar; // error
    var b1;
    var r3 = b1.foo;
    var r4 = b1.bar; // error
})(M || (M = {
}));
