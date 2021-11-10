function f() {
    function g() {
        switch (0) {
            default:
            case console.log("PASS"):
        }
    }
    g();
}
f();
