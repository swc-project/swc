function f() {
    function g() {
        try {
            throw 0;
        } catch (e) {
            console.log("PASS");
        }
    }
    g();
}
f();
