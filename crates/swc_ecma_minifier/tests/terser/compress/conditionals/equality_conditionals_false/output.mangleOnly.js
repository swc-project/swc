function o(o, l, n) {
    console.log(
        o == (l ? o : o),
        o == (l ? o : n),
        o != (l ? o : o),
        o != (l ? o : n),
        o === (l ? o : o),
        o === (l ? o : n),
        o !== (l ? o : o),
        o !== (l ? o : n)
    );
}
o(0, 0, 0);
o(0, true, 0);
o(1, 2, 3);
o(1, null, 3);
o(NaN);
o(NaN, "foo");
