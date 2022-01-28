(function () {
    var a;
    function f() {}
    f.g = function g() {
        var self = this;
        function h() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        self();
        a = false;
        h.g = g;
        return h;
    };
    return f;
})()
    .g()
    .g();
