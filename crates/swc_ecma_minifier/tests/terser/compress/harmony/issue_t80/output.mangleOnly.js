function a(a = []) {
    var b, c = "unused";
    if (arguments.length == 1) {
        a = [
            a
        ];
    }
    return a;
}
console.log(JSON.stringify([
    a(),
    a(null),
    a(5, 6)
]));
