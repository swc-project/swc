var f1 = function (x, y) {
    var a,
        b,
        r = x + y,
        q = r * r,
        z = q - r;
    (a = z), (b = 7);
    throw a + b;
};
try {
    f1(1, 2);
} catch (e) {
    console.log(e);
}
