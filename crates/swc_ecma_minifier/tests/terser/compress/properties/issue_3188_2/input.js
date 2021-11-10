(function () {
    var f = function () {
        console.log(this.p);
    };
    function g() {
        var o = { p: "PASS", f: f };
        o.f();
    }
    g();
})();
