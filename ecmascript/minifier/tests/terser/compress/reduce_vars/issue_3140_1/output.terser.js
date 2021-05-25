(function () {
    var a;
    function f() {}
    f.g = function g() {
        function h() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        this();
        a = false;
        h.g = g;
        return h;
    };
    return f;
})()
    .g()
    .g();
