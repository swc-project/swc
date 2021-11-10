(function () {
    function f(g) {
        var o = g,
            { a: x } = o;
        console.log(x);
    }
    f({ a: "PASS" });
})();
