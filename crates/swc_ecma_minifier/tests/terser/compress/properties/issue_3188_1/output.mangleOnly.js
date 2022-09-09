(function () {
    function n() {
        console.log(this.p);
    }
    (function () {
        var o = { p: "PASS", f: n };
        o.f();
    })();
})();
