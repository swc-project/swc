(function () {
    var a = "long piece of string";
    (function () {
        var b = a,
            c;
        c = f(b);
        c.bar = b;
    })();
})();
