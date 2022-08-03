(function() {
    function l() {
        Function.prototype.call.apply(console.log, [
            null,
            "PASS"
        ]);
    }
    l();
})();
