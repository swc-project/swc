function f(a, b) {
    "foo" ^ (b += a),
        b ? false : (b = a) ? -1 : (b -= a) - (b ^= a),
        a-- || !a,
        a;
}
