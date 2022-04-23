function f() {
    (function () {
        try {
            throw 0;
        } catch (e) {
            console.log("PASS");
        }
    })();
}
f();
