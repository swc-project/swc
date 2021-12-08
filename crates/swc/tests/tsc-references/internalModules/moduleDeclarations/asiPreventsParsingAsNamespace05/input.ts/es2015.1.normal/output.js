let namespace = 10;
var a;
(function(a1) {
    let b1;
    (function(b) {
        b.c = 20;
    })(b1 = a1.b || (a1.b = {
    }));
})(a || (a = {
}));
