function o(o) {
    const { a: e, b: n } = o;
    console.log(n);
}
o({ a: 1, b: 2 });
o({
    get a() {
        var o = "side effect";
        console.log(o);
        return o;
    },
    b: 4,
});
