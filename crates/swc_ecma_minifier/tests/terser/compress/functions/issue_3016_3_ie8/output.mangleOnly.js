var r = 1;
do {
    console.log((function() {
        return r ? "FAIL" : (r = "PASS");
        try {
            r = 2;
        } catch (r) {
            var r;
        }
    })());
}while (r--)
