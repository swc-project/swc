function f() {
    function g() {
        L: for (;;) break L;
    }
    g();
}
f();
