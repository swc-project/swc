(function() {
    var n;
    function t() {}
    t.g = function t() {
        var r = this;
        function u() {
            console.log(n ? "PASS" : "FAIL");
        }
        n = true;
        (function() {
            return r;
        })()();
        n = false;
        u.g = t;
        return u;
    };
    return t;
})().g().g();
