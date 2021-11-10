function f() {
    function g() {
        L: for (var a in x) break L;
    }
    g();
}
f();
