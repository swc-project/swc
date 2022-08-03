function n(n) {
    if (n) {
        const f = foo();
        n(f);
    }
}
function f(n) {
    if (n) {
        let f = foo();
        n(f);
    }
}
function i(n) {
    if (n) {
        var f = foo();
        n(f);
    }
}
