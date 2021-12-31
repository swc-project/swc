var namespace = 10;
var a;
(function(a1) {
    var b1;
    (function(b) {
        var c = b.c = 20;
    })(b1 = a1.b || (a1.b = {
    }));
})(a || (a = {
}));
