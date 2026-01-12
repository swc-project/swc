//// [mergeTwoInterfaces.ts]
// two interfaces with the same root module should merge
// basic case
var a;
var r1 = a.foo;
var r2 = a.bar;
var b;
var r3 = b.foo;
var r4 = b.bar;
// basic non-generic and generic case inside a module
(function(M) {
    var a;
    var r1 = a.foo;
    // BUG 856491
    var r2 = a.bar; // any, should be number
    var b;
    var r3 = b.foo;
    // BUG 856491
    var r4 = b.bar; // any, should be string
})(M || (M = {}));
var M;
