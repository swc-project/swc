(function() {
    function a() {
        console.log(this[0]);
    }
    (function() {
        var b = [
            "PASS",
            a
        ];
        b[1]();
    })();
})();
