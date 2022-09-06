function e(e) {
    var o;
    let a;
    ({ a: o, b: a } = e);
    console.log(a);
}
e({ a: 1, b: 2 });
e({
    get a() {
        var e = "side effect";
        console.log(e);
        return e;
    },
    b: 4,
});
