function n(n, o) {
    var r = "";
    var a = o ? ">" : "<";
    if (n) r += "=";
    return (r += a);
}
console.log(n(0, 0), n(0, 1), n(1, 0), n(1, 1));
