(function () {
    var n = "long piece of string";
    (function () {
        var i = n,
            o;
        o = f(i);
        o.bar = i;
    })();
})();
