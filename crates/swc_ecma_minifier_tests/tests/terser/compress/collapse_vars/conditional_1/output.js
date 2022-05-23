function f(a, b) {
    var c = "";
    if (a) c += "=";
    return (c += b ? ">" : "<");
}
console.log(f(0, 0), f(0, 1), f(1, 0), f(1, 1));
