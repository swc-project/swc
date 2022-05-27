(function() {
    function a() {
        console.log(this.p);
    }
    (function() {
        var b = {
            p: "PASS",
            f: a
        };
        b.f();
    })();
})();
