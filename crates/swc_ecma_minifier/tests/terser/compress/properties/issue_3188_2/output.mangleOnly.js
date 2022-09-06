(function () {
    var n = function () {
        console.log(this.p);
    };
    function o() {
        var o = { p: "PASS", f: n };
        o.f();
    }
    o();
})();
