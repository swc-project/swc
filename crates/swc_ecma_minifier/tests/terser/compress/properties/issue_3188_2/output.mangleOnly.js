(function() {
    var o = function() {
        console.log(this.p);
    };
    function n() {
        var n = {
            p: "PASS",
            f: o
        };
        n.f();
    }
    n();
})();
