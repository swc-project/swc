function a(a, b, c) {
    console.log(a == (b ? a : a), a == (b ? a : c), a != (b ? a : a), a != (b ? a : c), a === (b ? a : a), a === (b ? a : c), a !== (b ? a : a), a !== (b ? a : c));
}
a(0, 0, 0);
a(0, true, 0);
a(1, 2, 3);
a(1, null, 3);
a(NaN);
a(NaN, "foo");
