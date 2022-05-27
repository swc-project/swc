!(function() {
    function a() {
        var a = b;
        var b = a++;
        try {
            !(function b(a) {
                a[1] = "foo";
            })();
            console.log("FAIL");
        } catch (c) {
            console.log("PASS");
        }
    }
    a();
})();
