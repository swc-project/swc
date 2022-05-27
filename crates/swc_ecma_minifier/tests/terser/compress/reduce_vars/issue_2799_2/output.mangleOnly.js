(function() {
    function a() {
        Function.prototype.call.apply(console.log, [
            null,
            "PASS"
        ]);
    }
    a();
})();
