function testFunc() {
    var dimensions = { minX: 5, maxX: 6 };
    var scale = 1;
    var d = { x: (dimensions.maxX + dimensions.minX) / 2 };
    return d.x * scale;
}
console.log(testFunc());
