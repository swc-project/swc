(function() {
    var b = function() {
        console.log(this.p);
    };
    function a() {
        var a = {
            p: "PASS",
            f: b
        };
        a.f();
    }
    a();
})();
