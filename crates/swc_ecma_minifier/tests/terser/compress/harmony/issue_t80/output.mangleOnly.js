function n(n = []) {
    var u, i = "unused";
    if (arguments.length == 1) {
        n = [
            n
        ];
    }
    return n;
}
console.log(JSON.stringify([
    n(),
    n(null),
    n(5, 6)
]));
