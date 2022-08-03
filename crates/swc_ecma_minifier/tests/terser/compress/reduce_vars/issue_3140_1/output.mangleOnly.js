(function() {
    var n;
    function t() {}
    t.g = function t() {
        function u() {
            console.log(n ? "PASS" : "FAIL");
        }
        n = true;
        this();
        n = false;
        u.g = t;
        return u;
    };
    return t;
})().g().g();
