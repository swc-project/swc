(function() {
    var a;
    function b() {}
    b.g = function b() {
        var c = {
            p: this
        };
        function d() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        c.p();
        a = false;
        d.g = b;
        return d;
    };
    return b;
})().g().g();
