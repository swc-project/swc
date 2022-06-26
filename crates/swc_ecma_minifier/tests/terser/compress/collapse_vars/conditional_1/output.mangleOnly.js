function a(a, b) {
    var c = "";
    var d = b ? ">" : "<";
    if (a) c += "=";
    return (c += d);
}
console.log(a(0, 0), a(0, 1), a(1, 0), a(1, 1));
