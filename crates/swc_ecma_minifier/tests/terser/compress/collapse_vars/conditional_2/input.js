function f(a, b) {
    var c = a + 1,
        d = a + 2;
    return b ? c : d;
}
console.log(f(3, 0), f(4, 1));
