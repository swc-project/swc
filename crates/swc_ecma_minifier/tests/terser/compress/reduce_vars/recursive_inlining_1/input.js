!(function () {
    function foo() {
        bar();
    }
    function bar() {
        foo();
    }
    console.log("PASS");
})();
