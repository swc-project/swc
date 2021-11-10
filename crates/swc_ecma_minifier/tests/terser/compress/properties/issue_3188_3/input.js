(function () {
    function f() {
        console.log(this[0]);
    }
    (function () {
        var o = ["PASS", f];
        o[1]();
    })();
})();
