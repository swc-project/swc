function f(x) {
    if (x) {
        const a = foo();
        x(a);
    }
}
function g(x) {
    if (x) {
        let a = foo();
        x(a);
    }
}
function h(x) {
    if (x) {
        var a = foo();
        x(a);
    }
}
