function o(o) {
    if (o) {
        const f = foo();
        o(f);
    }
}
function f(o) {
    if (o) {
        let f = foo();
        o(f);
    }
}
function n(o) {
    if (o) {
        var f = foo();
        o(f);
    }
}
