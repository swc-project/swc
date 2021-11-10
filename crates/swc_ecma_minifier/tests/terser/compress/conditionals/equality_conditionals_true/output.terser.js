function f(a, b, c) {
    console.log(
        (b, a == a),
        a == (b ? a : c),
        (b, a != a),
        a != (b ? a : c),
        (b, a === a),
        a === (b ? a : c),
        (b, a !== a),
        a !== (b ? a : c)
    );
}
f(0, 0, 0), f(0, true, 0), f(1, 2, 3), f(1, null, 3), f(NaN), f(NaN, "foo");
