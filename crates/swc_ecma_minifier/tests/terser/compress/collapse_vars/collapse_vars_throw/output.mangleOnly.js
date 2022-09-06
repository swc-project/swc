var o = function(o, c) {
    var r, t, a = o + c, n = a * a, h = n - a;
    (r = h), (t = 7);
    throw r + t;
};
try {
    o(1, 2);
} catch (c) {
    console.log(c);
}
