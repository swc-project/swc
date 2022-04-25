function f(x) {
    function g() {
        L: {
            console.log("PASS");
            break L;
        }
    }
    g();
}
f(0);
