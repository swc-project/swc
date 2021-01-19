function f0(x, y) {
    var z = x + y;
    return {
        get b() {
            return 7;
        },
        r: z,
    };
}
function f1(x, y) {
    var z = x + y;
    return {
        r: z,
        get b() {
            return 7;
        },
    };
}
function f2(x, y) {
    var z = x + y;
    var k = x - y;
    return { q: k, r: g(x), s: z };
}
function f3(x, y) {
    var z = f(x + y);
    return [{ a: { q: x, r: y, s: z }, b: g() }];
}
