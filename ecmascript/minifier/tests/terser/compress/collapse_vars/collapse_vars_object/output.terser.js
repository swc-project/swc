function f0(x, y) {
    return {
        get b() {
            return 7;
        },
        r: x + y,
    };
}
function f1(x, y) {
    return {
        r: x + y,
        get b() {
            return 7;
        },
    };
}
function f2(x, y) {
    var z = x + y;
    return { q: x - y, r: g(x), s: z };
}
function f3(x, y) {
    return [{ a: { q: x, r: y, s: f(x + y) }, b: g() }];
}
