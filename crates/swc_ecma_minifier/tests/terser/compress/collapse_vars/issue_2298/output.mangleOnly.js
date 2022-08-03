!(function() {
    function n() {
        var n = c;
        var c = n++;
        try {
            !(function n(c) {
                c[1] = "foo";
            })();
            console.log("FAIL");
        } catch (o) {
            console.log("PASS");
        }
    }
    n();
})();
