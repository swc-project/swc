function a() {
    var a = {
        minX: 5,
        maxX: 6
    };
    var b = 1;
    var c = {
        x: (a.maxX + a.minX) / 2
    };
    return c.x * b;
}
console.log(a());
