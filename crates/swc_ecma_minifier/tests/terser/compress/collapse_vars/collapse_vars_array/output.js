function f1(x, y) {
    return [
        x + y
    ];
}
function f2(x, y) {
    return [
        x,
        side_effect(),
        x + y
    ];
}
function f3(x, y) {
    var z = f(x + y);
    return [
        [
            3
        ],
        [
            z,
            x,
            y
        ],
        [
            g()
        ]
    ];
}
