!(function() {
    function a() {
        var a = b;
        var b = a++;
        try {
            !(function a(b) {
                b[1] = "foo";
            })();
            console.log("FAIL");
        } catch (c) {
            console.log("PASS");
        }
    }
    a();
})();
