function e(e) {
    var o;
    let a;
    ({ a: o , b: a  } = e);
    console.log(a);
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
