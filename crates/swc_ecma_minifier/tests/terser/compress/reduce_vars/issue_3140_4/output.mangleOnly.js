(function() {
    var n;
    function t() {}
    t.g = function t() {
        var r = {
            p: this
        };
        function u() {
            console.log(n ? "PASS" : "FAIL");
        }
        n = true;
        r.p();
        n = false;
        u.g = t;
        return u;
    };
    return t;
})().g().g();
