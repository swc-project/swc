(function () {
    return g;
    function f(a) {
        var b = a.b;
        if (b) return b;
        return a;
    }
    function g(o, i) {
        while (i--) {
            console.log(f(o));
        }
    }
})()({ b: "PASS" }, 1);
