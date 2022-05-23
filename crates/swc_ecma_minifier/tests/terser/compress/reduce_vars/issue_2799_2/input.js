(function () {
    function foo() {
        Function.prototype.call.apply(console.log, [null, "PASS"]);
    }
    foo();
})();
