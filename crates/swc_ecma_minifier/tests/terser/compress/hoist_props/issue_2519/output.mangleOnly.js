function n() {
    var n = { minX: 5, maxX: 6 };
    var a = 1;
    var r = { x: (n.maxX + n.minX) / 2 };
    return r.x * a;
}
console.log(n());
