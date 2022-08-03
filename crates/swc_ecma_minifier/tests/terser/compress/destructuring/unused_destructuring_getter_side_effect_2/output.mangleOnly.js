function a(a) {
    const { a: n , b: o  } = a;
    console.log(o);
}
a({
    a: 1,
    b: 2
});
a({
    get a () {
        var n = "side effect";
        console.log(n);
        return n;
    },
    b: 4
});
