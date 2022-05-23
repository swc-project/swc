var f1 = function (x, y) {
    var r = x + y;
    throw r * r - r + 7;
};
try {
    f1(1, 2);
} catch (e) {
    console.log(e);
}
