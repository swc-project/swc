function a(a, b) {
    var c = a + b;
    return {
        get b () {
            return 7;
        },
        r: c
    };
}
function b(a, b) {
    var c = a + b;
    return {
        r: c,
        get b () {
            return 7;
        }
    };
}
function c(a, b) {
    var c = a + b;
    var d = a - b;
    return {
        q: d,
        r: g(a),
        s: c
    };
}
function d(a, b) {
    var c = f(a + b);
    return [
        {
            a: {
                q: a,
                r: b,
                s: c
            },
            b: g()
        }
    ];
}
