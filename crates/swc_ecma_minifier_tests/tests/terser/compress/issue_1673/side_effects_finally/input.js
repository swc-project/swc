function f() {
    function g() {
        try {
            x();
        } catch (e) {
        } finally {
            console.log("PASS");
        }
    }
    g();
}
f();
