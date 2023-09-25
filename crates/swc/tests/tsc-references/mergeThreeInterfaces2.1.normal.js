//// [mergeThreeInterfaces2.ts]
// two interfaces with the same root module should merge
// root module now multiple module declarations
var M2;
(function(M2) {
    var a;
    var r1 = a.foo;
    var r2 = a.bar;
})(M2 || (M2 = {}));
(function(M2) {
    var a;
    var r1 = a.foo;
    var r2 = a.bar;
    var r3 = a.baz;
})(M2 || (M2 = {}));
// same as above but with an additional level of nesting and third module declaration
(function(M2) {
    var M3;
    (function(M3) {
        var a;
        var r1 = a.foo;
        var r2 = a.bar;
    })(M3 = M2.M3 || (M2.M3 = {}));
})(M2 || (M2 = {}));
(function(M2) {
    var M3;
    (function(M3) {
        var a;
        var r1 = a.foo;
        var r2 = a.bar;
        var r3 = a.baz;
    })(M3 = M2.M3 || (M2.M3 = {}));
})(M2 || (M2 = {}));
(function(M2) {
    var M3;
    (function(M3) {
        var a;
        var r1 = a.foo;
        var r2 = a.bar;
        var r3 = a.baz;
    })(M3 = M2.M3 || (M2.M3 = {}));
})(M2 || (M2 = {}));
