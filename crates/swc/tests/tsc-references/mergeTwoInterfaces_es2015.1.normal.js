var a;
var r1 = a.foo;
var r2 = a.bar;
var b;
var r3 = b.foo;
var r4 = b.bar;
// basic non-generic and generic case inside a module
var M;
(function(M) {
    var a1;
    var r1 = a1.foo;
    // BUG 856491
    var r2 = a1.bar; // any, should be number
    var b1;
    var r3 = b1.foo;
    // BUG 856491
    var r4 = b1.bar; // any, should be string
})(M || (M = {}));
