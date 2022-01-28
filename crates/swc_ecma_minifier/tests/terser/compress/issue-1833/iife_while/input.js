function f() {
    function g() {
        L: while (1) break L;
    }
    g();
}
f();
