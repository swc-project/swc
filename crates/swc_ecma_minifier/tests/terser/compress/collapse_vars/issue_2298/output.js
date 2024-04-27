!function() {
    (function() {
        var a = undefined;
        var undefined = a++;
        try {
            !function(b) {
                (void 0)[1] = "foo";
            }();
            console.log("FAIL");
        } catch (e) {
            console.log("PASS");
        }
    })();
}();
