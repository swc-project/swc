function f() {
    (function () {
        try {
            x();
        } catch (e) {
        } finally {
            console.log("PASS");
        }
    })();
}
f();
