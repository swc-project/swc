(function () {
    var a;
    function f() {}
    f.g = function g() {
        var o = { p: this };
        function h() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        o.p();
        a = false;
        h.g = g;
        return h;
    };
    return f;
})()
    .g()
    .g();
