var a = function(a, b) {
    var c, d, e = a + b, f = e * e, g = f - e;
    (c = g), (d = 7);
    throw c + d;
};
try {
    a(1, 2);
} catch (b) {
    console.log(b);
}
