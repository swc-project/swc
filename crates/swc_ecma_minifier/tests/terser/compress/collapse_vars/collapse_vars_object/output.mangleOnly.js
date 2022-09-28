function r(r, n) {
    var t = r + n;
    return {
        get b () {
            return 7;
        },
        r: t
    };
}
function n(r, n) {
    var t = r + n;
    return {
        r: t,
        get b () {
            return 7;
        }
    };
}
function t(r, n) {
    var t = r + n;
    var u = r - n;
    return {
        q: u,
        r: g(r),
        s: t
    };
}
function u(r, n) {
    var t = f(r + n);
    return [
        {
            a: {
                q: r,
                r: n,
                s: t
            },
            b: g()
        }
    ];
}
