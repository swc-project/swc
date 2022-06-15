(function() {
    var a;
    function b() {}
    b.g = function b() {
        function c() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        this();
        a = false;
        c.g = b;
        return c;
    };
    return b;
})().g().g();
