(function () {
    function n() {
        console.log(this[0]);
    }
    (function () {
        var o = ["PASS", n];
        o[1]();
    })();
})();
