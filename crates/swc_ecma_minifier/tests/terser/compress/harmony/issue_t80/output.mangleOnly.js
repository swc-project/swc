function n(l = []) {
    var u, e = "unused";
    if (arguments.length == 1) {
        l = [
            l
        ];
    }
    return l;
}
console.log(JSON.stringify([
    n(),
    n(null),
    n(5, 6)
]));
