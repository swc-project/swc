(function() {
    var b;
    function a() {}
    a.g = function c() {
        var d = {
            p: this
        };
        function a() {
            console.log(b ? "PASS" : "FAIL");
        }
        b = true;
        d.p();
        b = false;
        a.g = c;
        return a;
    };
    return a;
})().g().g();
