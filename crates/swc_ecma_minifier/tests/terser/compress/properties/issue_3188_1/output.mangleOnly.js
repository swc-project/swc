(function() {
    function n() {
        console.log(this.p);
    }
    (function() {
        var f = {
            p: "PASS",
            f: n
        };
        f.f();
    })();
})();
