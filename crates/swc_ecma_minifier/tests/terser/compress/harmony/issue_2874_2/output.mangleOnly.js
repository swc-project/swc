(function () {
    let n = [];
    function r() {
        var r = [2, 1, 0].map((r) => {
            n.push(r);
            return t();
        });
        return r;
    }
    function t() {
        var r = ["A", "B", "C"],
            t = n.shift();
        return () => console.log(r[t] + t);
    }
    r().map((n) => n());
})();
