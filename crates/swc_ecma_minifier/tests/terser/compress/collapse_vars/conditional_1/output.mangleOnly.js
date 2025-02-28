function n(o, r) {
    var n = "";
    var a = r ? ">" : "<";
    if (o) n += "=";
    return (n += a);
}
console.log(n(0, 0), n(0, 1), n(1, 0), n(1, 1));
