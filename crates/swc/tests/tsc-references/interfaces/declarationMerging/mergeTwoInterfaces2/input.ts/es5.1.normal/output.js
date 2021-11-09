// two interfaces with the same root module should merge
// root module now multiple module declarations
var M21;
(function(M2) {
    var a;
    var r1 = a.foo;
    var r2 = a.bar;
})(M21 || (M21 = {
}));
(function(M2) {
    var a;
    var r1 = a.foo;
    var r2 = a.bar;
})(M21 || (M21 = {
}));
(function(M2) {
    var M3;
    (function(M3) {
        var a;
        var r1 = a.foo;
        var r2 = a.bar;
    })(M3 || (M3 = {
    }));
    M2.M3 = M3;
})(M21 || (M21 = {
}));
(function(M2) {
    (function(M3) {
        var a;
        var r1 = a.foo;
        var r2 = a.bar;
    })(M3 || (M3 = {
    }));
})(M21 || (M21 = {
}));
