function a() {
    var a = {
        minX: 5,
        maxX: 6
    };
    var n = 1;
    var r = {
        x: (a.maxX + a.minX) / 2
    };
    return r.x * n;
}
console.log(a());
