(function () {
    return function (o, i) {
        while (i--) console.log(f(o));
    };
    function f(a) {
        var b = a.b;
        return b || a;
    }
})()({ b: "PASS" }, 1);
