!(function () {
    function bar(x) {
        console.log("bar", x);
        if (x) qux(x - 1);
    }
    function qux(x) {
        console.log("qux", x);
        if (x)
            (function (x) {
                console.log("foo", x);
                if (x) bar(x - 1);
            })(x - 1);
    }
    qux(4);
    bar(5);
})();
