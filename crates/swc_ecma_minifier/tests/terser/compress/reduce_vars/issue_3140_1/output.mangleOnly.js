(function () {
    var n;
    function t() {}
    t.g = function t() {
        function o() {
            console.log(n ? "PASS" : "FAIL");
        }
        n = true;
        this();
        n = false;
        o.g = t;
        return o;
    };
    return t;
})()
    .g()
    .g();
