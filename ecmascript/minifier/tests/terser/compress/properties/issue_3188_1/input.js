(function () {
    function f() {
        console.log(this.p);
    }
    (function () {
        var o = { p: "PASS", f: f };
        o.f();
    })();
})();
