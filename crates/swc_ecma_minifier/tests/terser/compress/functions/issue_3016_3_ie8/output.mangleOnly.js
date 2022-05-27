var a = 1;
do {
    console.log((function() {
        return a ? "FAIL" : (a = "PASS");
        try {
            a = 2;
        } catch (a) {
            var a;
        }
    })());
}while (a--)
