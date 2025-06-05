(function () {
    function WL(t) {
        var n = (console.log(), t);
        Object.keys(n).forEach(function (t) {
            console.log(n);
            console.log(t);
            console.log(n[t]);
        });
    }
    try {
        t = { a: 1 };
        WL(t);
    } catch {}
})();
