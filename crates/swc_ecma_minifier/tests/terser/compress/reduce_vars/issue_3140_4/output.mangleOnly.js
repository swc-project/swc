(function () {
    var n;
    function t() {}
    t.g = function t() {
        var o = { p: this };
        function r() {
            console.log(n ? "PASS" : "FAIL");
        }
        n = true;
        o.p();
        n = false;
        r.g = t;
        return r;
    };
    return t;
})()
    .g()
    .g();
