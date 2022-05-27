(function() {
    var a = 1;
    (function() {
        var b = a, c;
        c = f(b);
        c.bar = b;
    })();
})();
