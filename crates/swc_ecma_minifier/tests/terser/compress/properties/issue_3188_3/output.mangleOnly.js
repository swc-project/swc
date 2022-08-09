(function() {
    function n() {
        console.log(this[0]);
    }
    (function() {
        var i = [
            "PASS",
            n
        ];
        i[1]();
    })();
})();
