function f() {
    if (!foo) {
        bar();
        baz();
    }
}
function g() {
    if (!(foo || bar || baz || baa)) {
        a();
        b();
    }
}
