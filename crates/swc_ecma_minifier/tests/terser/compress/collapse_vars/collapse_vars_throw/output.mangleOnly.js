var o = function(o, c) {
    var r, t, a = o + c, n = a * a, e = n - a;
    (r = e), (t = 7);
    throw r + t;
};
try {
    o(1, 2);
} catch (o) {
    console.log(o);
}
