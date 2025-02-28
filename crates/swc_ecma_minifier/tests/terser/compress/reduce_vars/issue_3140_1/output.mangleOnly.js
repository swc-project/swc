(function() {
    var t;
    function n() {}
    n.g = function n() {
        function o() {
            console.log(t ? "PASS" : "FAIL");
        }
        t = true;
        this();
        t = false;
        o.g = n;
        return o;
    };
    return n;
})().g().g();
