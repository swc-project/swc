(function() {
    var a = function() {
        console.log(this.p);
    };
    function b() {
        var b = {
            p: "PASS",
            f: a
        };
        b.f();
    }
    b();
})();
