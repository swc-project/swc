function o(o) {
    const { a: e , b: n  } = o;
    console.log(n);
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
