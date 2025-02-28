(function() {
    var t;
    function n() {}
    n.g = function n() {
        var r = {
            p: this
        };
        function o() {
            console.log(t ? "PASS" : "FAIL");
        }
        t = true;
        r.p();
        t = false;
        o.g = n;
        return o;
    };
    return n;
})().g().g();
