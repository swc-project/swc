!(function () {
    function f() {
        var a = undefined;
        var undefined = a++;
        try {
            !(function g(b) {
                b[1] = "foo";
            })();
            console.log("FAIL");
        } catch (e) {
            console.log("PASS");
        }
    }
    f();
})();
