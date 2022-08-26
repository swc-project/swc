function e(e) {
    var a;
    let t;
    ({ a: a , b: t  } = e);
    console.log(t);
}
e({
    a: 1,
    b: 2
});
e({
    get a () {
        var a = "side effect";
        console.log(a);
        return a;
    },
    b: 4
});
