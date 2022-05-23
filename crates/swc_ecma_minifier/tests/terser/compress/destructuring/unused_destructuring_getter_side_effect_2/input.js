function extract(obj) {
    const { a: a, b: b } = obj;
    console.log(b);
}
extract({ a: 1, b: 2 });
extract({
    get a() {
        var s = "side effect";
        console.log(s);
        return s;
    },
    b: 4,
});
