var m, o;
m = [
    [
        1,
        2
    ],
    [
        3,
        4
    ]
], o = {
    e: 5,
    f: 3
}, function() {
    for (let [a, b] of m)console.log(a + b);
}(), function() {
    for (var [c, d] of m)console.log(c * d);
}(), function() {
    try {
        var { e, f } = o;
        console.log(e - f);
    } catch (err) {}
}();
