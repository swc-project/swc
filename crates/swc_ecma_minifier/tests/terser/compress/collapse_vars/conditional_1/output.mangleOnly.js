function a(b, c) {
    var a = "";
    var d = c ? ">" : "<";
    if (b) a += "=";
    return (a += d);
}
console.log(a(0, 0), a(0, 1), a(1, 0), a(1, 1));
