(function() {
    var n = function() {
        console.log(this.p);
    };
    function f() {
        var f = {
            p: "PASS",
            f: n
        };
        f.f();
    }
    f();
})();
