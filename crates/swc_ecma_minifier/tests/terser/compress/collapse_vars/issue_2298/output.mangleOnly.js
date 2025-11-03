!(function() {
    function o() {
        var o = n;
        var n = o++;
        try {
            !(function o(_o) {
                _o[1] = "foo";
            })();
            console.log("FAIL");
        } catch (o) {
            console.log("PASS");
        }
    }
    o();
})();
