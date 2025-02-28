function o(o) {
    const { a: n, b: e } = o;
    console.log(e);
}
o({
    a: 1,
    b: 2
});
o({
    get a () {
        var e = "side effect";
        console.log(e);
        return e;
    },
    b: 4
});
