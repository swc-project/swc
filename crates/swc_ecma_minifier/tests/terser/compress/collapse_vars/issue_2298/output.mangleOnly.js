!(function() {
    function o() {
        var o = n;
        var n = o++;
        try {
            !(function o(n) {
                n[1] = "foo";
            })();
            console.log("FAIL");
        } catch (c) {
            console.log("PASS");
        }
    }
    o();
})();
