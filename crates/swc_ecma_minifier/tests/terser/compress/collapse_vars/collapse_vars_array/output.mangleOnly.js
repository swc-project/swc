function a(a, b) {
    var c = a + b;
    return [
        c
    ];
}
function b(a, b) {
    var c = a + b;
    return [
        a,
        side_effect(),
        c
    ];
}
function c(a, b) {
    var c = f(a + b);
    return [
        [
            3
        ],
        [
            c,
            a,
            b
        ],
        [
            g()
        ]
    ];
}
