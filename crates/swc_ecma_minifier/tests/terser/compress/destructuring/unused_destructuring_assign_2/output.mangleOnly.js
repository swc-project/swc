function a(a) {
    var r;
    let t;
    ({ a: r , b: t  } = a);
    console.log(t);
}
a({
    a: 1,
    b: 2
});
a({
    get a () {
        var r = "side effect";
        console.log(r);
        return r;
    },
    b: 4
});
