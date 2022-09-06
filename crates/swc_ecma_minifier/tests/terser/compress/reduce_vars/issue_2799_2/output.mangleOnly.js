(function () {
    function n() {
        Function.prototype.call.apply(console.log, [null, "PASS"]);
    }
    n();
})();
