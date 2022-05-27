var a = function(d, e) {
    var b, c, a = d + e, f = a * a, g = f - a;
    (b = g), (c = 7);
    throw b + c;
};
try {
    a(1, 2);
} catch (b) {
    console.log(b);
}
