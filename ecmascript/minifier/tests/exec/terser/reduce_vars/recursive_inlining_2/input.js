!(function () {
    function foo() {
        qux();
    }
    function bar() {
        foo();
    }
    function qux() {
        bar();
    }
    console.log("PASS");
})();
