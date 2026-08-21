function nested() {
    var a = 2;
    for (var a of [
        1
    ])break;
    return a;
}
function rest() {
    return function(...a) {
        for (var a of [
            [
                1
            ]
        ])break;
        return a[0];
    }(2);
}
console.log(nested());
console.log(rest());
