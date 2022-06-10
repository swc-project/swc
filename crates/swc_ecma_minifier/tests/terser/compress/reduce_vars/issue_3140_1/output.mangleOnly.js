(function() {
    var b;
    function a() {}
    a.g = function c() {
        function a() {
            console.log(b ? "PASS" : "FAIL");
        }
        b = true;
        this();
        b = false;
        a.g = c;
        return a;
    };
    return a;
})().g().g();
