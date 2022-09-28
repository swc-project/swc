function n(n, r) {
    var t = n + r;
    return [
        t
    ];
}
function r(n, r) {
    var t = n + r;
    return [
        n,
        side_effect(),
        t
    ];
}
function t(n, r) {
    var t = f(n + r);
    return [
        [
            3
        ],
        [
            t,
            n,
            r
        ],
        [
            g()
        ]
    ];
}
