//// [mergeThreeInterfaces.ts]
// interfaces with the same root module should merge
// basic case
var a;
var r1 = a.foo;
var r2 = a.bar;
var r3 = a.baz;
var b;
var r4 = b.foo;
var r5 = b.bar;
var r6 = b.baz;
var M;
// basic non-generic and generic case inside a module
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
})(M || (M = {}));
