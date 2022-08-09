(function() {
    var n = "long piece of string";
    (function() {
        var a = n, r;
        r = f(a);
        r.bar = a;
    })();
})();
