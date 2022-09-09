(function () {
    var n = 1;
    (function () {
        var a = n,
            r;
        r = f(a);
        r.bar = a;
    })();
})();
