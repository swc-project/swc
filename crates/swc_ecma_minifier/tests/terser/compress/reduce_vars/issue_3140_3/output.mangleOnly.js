(function() {
    var t;
    function n() {}
    n.g = function n() {
        var u = this;
        function r() {
            console.log(t ? "PASS" : "FAIL");
        }
        t = true;
        (function() {
            return u;
        })()();
        t = false;
        r.g = n;
        return r;
    };
    return n;
})().g().g();
