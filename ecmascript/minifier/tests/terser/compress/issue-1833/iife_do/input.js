function f() {
    function g() {
        L: do {
            break L;
        } while (1);
    }
    g();
}
f();
