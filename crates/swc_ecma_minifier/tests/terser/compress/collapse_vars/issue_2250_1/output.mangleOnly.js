function a(a) {
    if (a) {
        const b = foo();
        a(b);
    }
}
function b(a) {
    if (a) {
        let b = foo();
        a(b);
    }
}
function c(a) {
    if (a) {
        var b = foo();
        a(b);
    }
}
