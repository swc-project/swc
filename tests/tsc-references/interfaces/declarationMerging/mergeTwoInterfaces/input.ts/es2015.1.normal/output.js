var a1;
var r1 = a1.foo;
var r2 = a1.bar;
var b1;
var r3 = b1.foo;
var r4 = b1.bar;
// basic non-generic and generic case inside a module
var M;
(function(M) {
    var a;
    var r1 = a.foo;
    // BUG 856491
    var r2 = a.bar; // any, should be number
    var b;
    var r3 = b.foo;
    // BUG 856491
    var r4 = b.bar; // any, should be string
})(M || (M = {
}));
