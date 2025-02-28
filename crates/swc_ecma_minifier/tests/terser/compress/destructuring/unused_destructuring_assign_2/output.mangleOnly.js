function e(o) {
    var a;
    let e;
    ({ a: a, b: e } = o);
    console.log(e);
}
e({
    a: 1,
    b: 2
});
e({
    get a () {
        var o = "side effect";
        console.log(o);
        return o;
    },
    b: 4
});
