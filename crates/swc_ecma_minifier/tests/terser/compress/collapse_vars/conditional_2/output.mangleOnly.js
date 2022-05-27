function a(a, b) {
    var c = a + 1, d = a + 2;
    return b ? c : d;
}
console.log(a(3, 0), a(4, 1));
