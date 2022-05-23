function f(a, b) {
    var c = "";
    var d = b ? ">" : "<";
    if (a) c += "=";
    return (c += d);
}
console.log(f(0, 0), f(0, 1), f(1, 0), f(1, 1));
