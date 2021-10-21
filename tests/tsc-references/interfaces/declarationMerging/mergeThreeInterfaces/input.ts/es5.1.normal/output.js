var a1;
var r1 = a1.foo;
var r2 = a1.bar;
var r3 = a1.baz;
var b1;
var r4 = b1.foo;
var r5 = b1.bar;
var r6 = b1.baz;
// basic non-generic and generic case inside a module
var M;
(function(M) {
    var a;
    var r1 = a.foo;
    // BUG 856491
    var r2 = a.bar; // any, should be number
    // BUG 856491
    var r3 = a.baz; // any, should be boolean
    var b;
    var r4 = b.foo;
    // BUG 856491
    var r5 = b.bar; // any, should be number
    // BUG 856491
    var r6 = b.baz; // any, should be boolean
})(M || (M = {
}));
