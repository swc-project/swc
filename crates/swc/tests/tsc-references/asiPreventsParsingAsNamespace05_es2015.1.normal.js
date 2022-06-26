let namespace = 10;
var a;
(function(a) {
    let b;
    (function(b) {
        var c = b.c = 20;
    })(b = a.b || (a.b = {}));
})(a || (a = {}));
